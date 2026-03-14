import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

interface MongoError extends Error {
  code?: number;
  statusCode?: number;
}

export const errorHandler = (
  err: MongoError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values((err as unknown as { errors: Record<string, { message: string }> }).errors).map(
      (e) => e.message,
    );
    res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Validation Error', errors });
    return;
  }

  if (err.name === 'CastError') {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Invalid ID format' });
    return;
  }

  if (err.code === 11000) {
    res.status(HTTP_STATUS.CONFLICT).json({ success: false, message: 'Duplicate field value' });
    return;
  }

  res.status(err.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || 'Server Error',
  });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Route not found' });
};
