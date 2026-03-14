import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { PipelineStage, Types } from 'mongoose';
import Task from '../models/Task';
import { TaskStats } from '../types';
import { HTTP_STATUS } from '../constants/httpStatus';
import { TaskQueryParams } from '../middleware/queryParams';
import { fetchExternalAdvice } from '../services/externalAdviceService';

type TaskInsight = {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  dueDate: string | null;
  isOverdue: boolean;
  urgencyScore: number;
  timelineBucket: 'overdue' | 'today' | 'this-week' | 'later' | 'no-date';
};

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getTimelineBucket = (dueDate: Date | null, now: Date): TaskInsight['timelineBucket'] => {
  if (!dueDate) return 'no-date';
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const sevenDaysLater = new Date(startOfToday);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

  if (dueDate.getTime() < startOfToday.getTime()) return 'overdue';
  if (dueDate.getTime() < startOfTomorrow.getTime()) return 'today';
  if (dueDate.getTime() <= sevenDaysLater.getTime()) return 'this-week';
  return 'later';
};

const computeUrgencyScore = (priority: string, dueDate: Date | null, now: Date): number => {
  const priorityWeight: Record<string, number> = {
    high: 50,
    medium: 30,
    low: 15,
  };

  const base = priorityWeight[priority] ?? 20;
  if (!dueDate) return base;

  const diffDays = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return base + 45;
  if (diffDays <= 1) return base + 30;
  if (diffDays <= 3) return base + 20;
  if (diffDays <= 7) return base + 10;
  return base;
};

const transformTaskToInsight = (task: Record<string, unknown>, now: Date): TaskInsight => {
  const dueDate = toDate(task.dueDate);
  return {
    id: String(task._id ?? task.id ?? ''),
    title: String(task.title ?? ''),
    status: String(task.status ?? 'todo'),
    priority: String(task.priority ?? 'medium'),
    category: String(task.category ?? 'DEVELOPMENT'),
    dueDate: dueDate ? dueDate.toISOString() : null,
    isOverdue: Boolean(dueDate && dueDate.getTime() < now.getTime() && String(task.status) !== 'done'),
    urgencyScore: computeUrgencyScore(String(task.priority ?? ''), dueDate, now),
    timelineBucket: getTimelineBucket(dueDate, now),
  };
};

const buildTaskScopeQuery = (userId: string | undefined, includeDeleted: boolean): Record<string, unknown> => {
  const base: Record<string, unknown> = { userId };
  if (!includeDeleted) {
    base.isDeleted = { $ne: true };
  }
  return base;
};

const buildPagination = (total: number, page: number, limit: number, count: number) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    total,
    count,
    page,
    limit,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  };
};

const toUserObjectId = (userId?: string): Types.ObjectId | null => {
  if (!userId || !Types.ObjectId.isValid(userId)) return null;
  return new Types.ObjectId(userId);
};

// ─── GET /api/tasks ──────────────────────────────────────────────────────────
export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { status, priority, search, tagsAll, assigneeNamesAll, includeDeleted, sortBy, page, limit, skip } =
      (res.locals.taskQuery as TaskQueryParams | undefined) ?? {
        tagsAll: [],
        assigneeNamesAll: [],
        includeDeleted: false,
        sortBy: '-createdAt',
        page: 1,
        limit: 20,
        skip: 0,
      };
    const query: Record<string, unknown> = buildTaskScopeQuery(req.user?.id, includeDeleted);

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.$text = { $search: search };
    if (tagsAll.length > 0) query.tags = { $all: tagsAll };
    if (assigneeNamesAll.length > 0) query['assignees.name'] = { $all: assigneeNamesAll };

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortBy).skip(skip).limit(limit).lean(),
      Task.countDocuments(query),
    ]);

    const pagination = buildPagination(total, page, limit, tasks.length);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: pagination.count,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      pagination,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/stats ─────────────────────────────────────────────────────
export const getTaskStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userObjectId = toUserObjectId(req.user?.id);
    if (!userObjectId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Authentication required' });
      return;
    }

    const [statusAgg, priorityAgg, total] = await Promise.all([
      Task.aggregate<{ _id: string; count: number }>([
        { $match: { userId: userObjectId, isDeleted: { $ne: true } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate<{ _id: string; count: number }>([
        { $match: { userId: userObjectId, isDeleted: { $ne: true } } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Task.countDocuments({ userId: userObjectId, isDeleted: { $ne: true } }),
    ]);

    const byStatus = statusAgg.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    const byPriority = priorityAgg.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s._id]: s.count }), {});

    const stats: TaskStats = {
      total,
      byStatus: {
        todo: byStatus['todo'] ?? 0,
        'in-progress': byStatus['in-progress'] ?? 0,
        done: byStatus['done'] ?? 0,
      },
      byPriority: {
        low: byPriority['low'] ?? 0,
        medium: byPriority['medium'] ?? 0,
        high: byPriority['high'] ?? 0,
      },
    };

    res.status(HTTP_STATUS.OK).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/analytics ───────────────────────────────────────────────
export const getTaskAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userObjectId = toUserObjectId(req.user?.id);
    if (!userObjectId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Authentication required' });
      return;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
          isDeleted: { $ne: true },
        },
      },
      {
        $addFields: {
          dueTimelineBucket: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      { $ne: ['$dueDate', null] },
                      { $lt: ['$dueDate', '$$NOW'] },
                    ],
                  },
                  then: 'overdue',
                },
                {
                  case: {
                    $and: [
                      { $ne: ['$dueDate', null] },
                      {
                        $lte: [
                          '$dueDate',
                          {
                            $dateAdd: {
                              startDate: '$$NOW',
                              unit: 'day',
                              amount: 1,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  then: 'today',
                },
                {
                  case: {
                    $and: [
                      { $ne: ['$dueDate', null] },
                      {
                        $lte: [
                          '$dueDate',
                          {
                            $dateAdd: {
                              startDate: '$$NOW',
                              unit: 'day',
                              amount: 7,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  then: 'this-week',
                },
              ],
              default: {
                $cond: [{ $eq: ['$dueDate', null] }, 'no-date', 'later'],
              },
            },
          },
        },
      },
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                done: {
                  $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] },
                },
                inProgress: {
                  $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
                },
                todo: {
                  $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] },
                },
                overdue: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$dueDate', null] },
                          { $lt: ['$dueDate', '$$NOW'] },
                          { $ne: ['$status', 'done'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          byPriority: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          byCategory: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          dueTimeline: [
            {
              $group: {
                _id: '$dueTimelineBucket',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          topTags: [
            { $unwind: { path: '$tags', preserveNullAndEmptyArrays: false } },
            {
              $group: {
                _id: '$tags',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 10 },
          ],
        },
      },
      {
        $project: {
          overview: { $ifNull: [{ $arrayElemAt: ['$overview', 0] }, { total: 0, done: 0, inProgress: 0, todo: 0, overdue: 0 }] },
          byStatus: 1,
          byPriority: 1,
          byCategory: 1,
          dueTimeline: 1,
          topTags: 1,
        },
      },
    ];

    const [analytics] = await Task.aggregate<Record<string, unknown>>(pipeline);
    const overview = (analytics?.overview as Record<string, number> | undefined) ?? {
      total: 0,
      done: 0,
      inProgress: 0,
      todo: 0,
      overdue: 0,
    };

    const completionRate = overview.total > 0 ? Number(((overview.done / overview.total) * 100).toFixed(2)) : 0;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        overview: {
          ...overview,
          completionRate,
        },
        byStatus: analytics?.byStatus ?? [],
        byPriority: analytics?.byPriority ?? [],
        byCategory: analytics?.byCategory ?? [],
        dueTimeline: analytics?.dueTimeline ?? [],
        topTags: analytics?.topTags ?? [],
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/insights ───────────────────────────────────────────────
export const getTaskInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const { status, priority, search, tagsAll, assigneeNamesAll, includeDeleted, sortBy, page, limit, skip } =
      (res.locals.taskQuery as TaskQueryParams | undefined) ?? {
        tagsAll: [],
        assigneeNamesAll: [],
        includeDeleted: false,
        sortBy: '-createdAt',
        page: 1,
        limit: 20,
        skip: 0,
      };

    const query: Record<string, unknown> = buildTaskScopeQuery(req.user?.id, includeDeleted);
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.$text = { $search: search };
    if (tagsAll.length > 0) query.tags = { $all: tagsAll };
    if (assigneeNamesAll.length > 0) query['assignees.name'] = { $all: assigneeNamesAll };

    const [tasks, total, externalAdvice] = await Promise.all([
      Task.find(query).sort(sortBy).skip(skip).limit(limit).lean(),
      Task.countDocuments(query),
      fetchExternalAdvice(),
    ]);

    const now = new Date();
    const insights = (tasks as Array<Record<string, unknown>>).map((task) => transformTaskToInsight(task, now));

    const transformedSummary = {
      totalInsights: insights.length,
      overdueCount: insights.filter((item) => item.isOverdue).length,
      highUrgencyCount: insights.filter((item) => item.urgencyScore >= 70).length,
      bucketCount: {
        overdue: insights.filter((item) => item.timelineBucket === 'overdue').length,
        today: insights.filter((item) => item.timelineBucket === 'today').length,
        thisWeek: insights.filter((item) => item.timelineBucket === 'this-week').length,
        later: insights.filter((item) => item.timelineBucket === 'later').length,
        noDate: insights.filter((item) => item.timelineBucket === 'no-date').length,
      },
    };

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        pagination: {
          ...buildPagination(total, page, limit, insights.length),
        },
        advice: externalAdvice,
        summary: transformedSummary,
        insights,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/deleted ───────────────────────────────────────────────
export const getDeletedTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const { status, priority, search, tagsAll, assigneeNamesAll, sortBy, page, limit, skip } =
      (res.locals.taskQuery as TaskQueryParams | undefined) ?? {
        tagsAll: [],
        assigneeNamesAll: [],
        includeDeleted: true,
        sortBy: '-deletedAt',
        page: 1,
        limit: 20,
        skip: 0,
      };

    const query: Record<string, unknown> = {
      userId: req.user?.id,
      isDeleted: true,
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.$text = { $search: search };
    if (tagsAll.length > 0) query.tags = { $all: tagsAll };
    if (assigneeNamesAll.length > 0) query['assignees.name'] = { $all: assigneeNamesAll };

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortBy).skip(skip).limit(limit).lean(),
      Task.countDocuments(query),
    ]);

    const pagination = buildPagination(total, page, limit, tasks.length);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: pagination.count,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      pagination,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user?.id,
      isDeleted: { $ne: true },
    });
    if (!task) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(HTTP_STATUS.OK).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const task = await Task.create({ ...req.body, userId: req.user?.id });
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user?.id, isDeleted: { $ne: true } }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(HTTP_STATUS.OK).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const hardDelete = req.query.hard === 'true' || req.query.hard === '1';

    if (hardDelete) {
      const hardDeleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
      if (!hardDeleted) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Task not found' });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Task permanently deleted',
        mode: 'hard',
        data: {},
      });
      return;
    }

    const softDeleted = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );

    if (!softDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Task soft deleted',
      mode: 'soft',
      data: {
        id: softDeleted.id,
        isDeleted: true,
        deletedAt: softDeleted.deletedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/tasks/:id/restore ───────────────────────────────────────────
export const restoreTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const restored = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true },
    ).lean();

    if (!restored) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Deleted task not found' });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Task restored successfully',
      data: restored,
    });
  } catch (err) {
    next(err);
  }
};
