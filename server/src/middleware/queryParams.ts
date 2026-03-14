import { NextFunction, Request, Response } from 'express';

export interface TaskQueryParams {
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  tagsAll: string[];
  assigneeNamesAll: string[];
  includeDeleted: boolean;
  sortBy: string;
  page: number;
  limit: number;
  skip: number;
}

export interface WorkspaceQueryParams {
  projectSearch?: string;
  category?: 'MARKETING' | 'DESIGN' | 'DEVELOPMENT' | 'OPERATIONS' | 'PRODUCT' | 'PERSONAL';
  sortBy: 'name' | '-name' | 'created';
  page: number;
  limit: number;
  skip: number;
}

const toPositiveInt = (value: unknown, fallback: number) => {
  if (typeof value !== 'string') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
};

const toArrayValues = (value: unknown): string[] => {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];

  return values
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export const normalizeTaskQuery = (req: Request, res: Response, next: NextFunction): void => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const priority = typeof req.query.priority === 'string' ? req.query.priority : undefined;
  const search = typeof req.query.search === 'string' && req.query.search.trim().length > 0
    ? req.query.search.trim()
    : undefined;
  const tagsAll = toArrayValues(req.query.tagsAll);
  const assigneeNamesAll = toArrayValues(req.query.assigneeNamesAll);

  const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : '-createdAt';
  const includeDeleted = req.query.includeDeleted === 'true' || req.query.includeDeleted === '1';
  const page = toPositiveInt(req.query.page, 1);
  const requestedLimit = toPositiveInt(req.query.limit, 20);
  const limit = Math.min(requestedLimit, 100);

  const normalized: TaskQueryParams = {
    status: status as TaskQueryParams['status'],
    priority: priority as TaskQueryParams['priority'],
    search,
    tagsAll,
    assigneeNamesAll,
    includeDeleted,
    sortBy,
    page,
    limit,
    skip: (page - 1) * limit,
  };

  res.locals.taskQuery = normalized;
  next();
};

export const normalizeWorkspaceQuery = (req: Request, res: Response, next: NextFunction): void => {
  const projectSearch =
    typeof req.query.projectSearch === 'string' && req.query.projectSearch.trim().length > 0
      ? req.query.projectSearch.trim()
      : undefined;

  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const sortByRaw = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'created';
  const sortBy: WorkspaceQueryParams['sortBy'] =
    sortByRaw === 'name' || sortByRaw === '-name' || sortByRaw === 'created' ? sortByRaw : 'created';

  const page = toPositiveInt(req.query.page, 1);
  const requestedLimit = toPositiveInt(req.query.limit, 20);
  const limit = Math.min(requestedLimit, 100);

  const normalized: WorkspaceQueryParams = {
    projectSearch,
    category: category as WorkspaceQueryParams['category'],
    sortBy,
    page,
    limit,
    skip: (page - 1) * limit,
  };

  res.locals.workspaceQuery = normalized;
  next();
};
