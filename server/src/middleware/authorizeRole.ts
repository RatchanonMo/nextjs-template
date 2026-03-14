import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

type AllowedRole = 'admin' | 'user';

export const authorizeRole = (...allowedRoles: AllowedRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const currentRole = req.user?.role;

    if (!req.user || !currentRole) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(currentRole)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: 'Insufficient role permissions' });
      return;
    }

    next();
  };
};
