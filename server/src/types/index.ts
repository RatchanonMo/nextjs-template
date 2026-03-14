import { Request, Response, NextFunction } from 'express';

/** Typed async request handler shorthand */
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export interface TaskStats {
  total: number;
  byStatus: { todo: number; 'in-progress': number; done: number };
  byPriority: { low: number; medium: number; high: number };
}
