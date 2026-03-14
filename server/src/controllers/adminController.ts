import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { HTTP_STATUS } from '../constants/httpStatus';
import Task from '../models/Task';
import User, { UserAccountStatus, UserRole } from '../models/User';
import Workspace from '../models/Workspace';

const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildPagination = (total: number, page: number, limit: number) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    total,
    page,
    limit,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

const sanitizeAdminUser = (user: {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: UserAccountStatus;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  accountStatus: user.accountStatus,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getAdminUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const page = toPositiveInt(req.query.page, 1);
    const limit = Math.min(toPositiveInt(req.query.limit, 10), 50);
    const skip = (page - 1) * limit;

    const search = String(req.query.search ?? '').trim();
    const role = req.query.role ? String(req.query.role) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;

    const query: Record<string, unknown> = {};

    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    if (role) query.role = role;
    if (status) query.accountStatus = status;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const userObjectIds = users
      .map((user) => user._id)
      .filter((id): id is Types.ObjectId => Boolean(id));

    const [taskCounts, workspaceCounts] = await Promise.all([
      Task.aggregate<{ _id: Types.ObjectId; count: number }>([
        { $match: { userId: { $in: userObjectIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
      ]),
      Workspace.aggregate<{ _id: Types.ObjectId; projectCount: number }>([
        { $match: { userId: { $in: userObjectIds } } },
        {
          $project: {
            _id: '$userId',
            projectCount: { $size: '$projects' },
          },
        },
      ]),
    ]);

    const taskCountMap = new Map(taskCounts.map((item) => [String(item._id), item.count]));
    const projectCountMap = new Map(workspaceCounts.map((item) => [String(item._id), item.projectCount]));

    const data = users.map((user) => {
      const id = String(user._id);
      return {
        ...sanitizeAdminUser({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
        taskCount: taskCountMap.get(id) ?? 0,
        projectCount: projectCountMap.get(id) ?? 0,
      };
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
      pagination: buildPagination(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUserOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const { userId } = req.params;
    if (!Types.ObjectId.isValid(userId)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Invalid user id' });
      return;
    }

    const taskPage = toPositiveInt(req.query.taskPage, 1);
    const taskLimit = Math.min(toPositiveInt(req.query.taskLimit, 12), 50);
    const taskSkip = (taskPage - 1) * taskLimit;
    const taskStatus = req.query.taskStatus ? String(req.query.taskStatus) : undefined;
    const taskSearch = String(req.query.taskSearch ?? '').trim();

    const [user, workspace] = await Promise.all([
      User.findById(userId).lean(),
      Workspace.findOne({ userId }).lean(),
    ]);

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' });
      return;
    }

    const taskQuery: Record<string, unknown> = { userId: new Types.ObjectId(userId) };

    if (taskStatus) taskQuery.status = taskStatus;
    if (taskSearch) {
      const regex = new RegExp(escapeRegex(taskSearch), 'i');
      taskQuery.$or = [{ title: regex }, { description: regex }];
    }

    const [tasks, totalTasks, statsAgg] = await Promise.all([
      Task.find(taskQuery)
        .sort({ updatedAt: -1 })
        .skip(taskSkip)
        .limit(taskLimit)
        .lean(),
      Task.countDocuments(taskQuery),
      Task.aggregate<{ _id: string; count: number }>([
        { $match: { userId: new Types.ObjectId(userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const byStatus = statsAgg.reduce<Record<string, number>>((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const sanitizedUser = sanitizeAdminUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: sanitizedUser,
        projects: workspace?.projects ?? [],
        labels: workspace?.labels ?? [],
        tasks,
        taskStats: {
          total: totalTasks,
          byStatus: {
            todo: byStatus.todo ?? 0,
            'in-progress': byStatus['in-progress'] ?? 0,
            done: byStatus.done ?? 0,
          },
        },
      },
      taskPagination: buildPagination(totalTasks, taskPage, taskLimit),
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const { userId } = req.params;
    const role = req.body.role as UserRole;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).lean();

    if (!updatedUser) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: sanitizeAdminUser({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        accountStatus: updatedUser.accountStatus,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const { userId } = req.params;
    const accountStatus = req.body.accountStatus as UserAccountStatus;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { accountStatus },
      { new: true },
    ).lean();

    if (!updatedUser) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: sanitizeAdminUser({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        accountStatus: updatedUser.accountStatus,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }),
    });
  } catch (error) {
    next(error);
  }
};
