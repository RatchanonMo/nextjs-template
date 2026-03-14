import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getAdminUserOverview,
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
} from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { authorizeRole } from '../middleware/authorizeRole';

const router = Router();

router.use(protect, authorizeRole('admin'));

router.get(
  '/users',
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50'),
  query('search').optional().trim().isLength({ max: 120 }).withMessage('search query is too long'),
  query('role').optional().isIn(['admin', 'user']).withMessage('role must be admin or user'),
  query('status').optional().isIn(['active', 'suspended', 'deactivated']).withMessage('invalid account status'),
  getAdminUsers,
);

router.get(
  '/users/:userId/overview',
  param('userId').isMongoId().withMessage('Invalid user id'),
  query('taskPage').optional().isInt({ min: 1 }).withMessage('taskPage must be a positive integer'),
  query('taskLimit').optional().isInt({ min: 1, max: 50 }).withMessage('taskLimit must be between 1 and 50'),
  query('taskStatus').optional().isIn(['todo', 'in-progress', 'done']).withMessage('taskStatus is invalid'),
  query('taskSearch').optional().trim().isLength({ max: 120 }).withMessage('taskSearch query is too long'),
  getAdminUserOverview,
);

router.patch(
  '/users/:userId/role',
  param('userId').isMongoId().withMessage('Invalid user id'),
  body('role').isIn(['admin', 'user']).withMessage('role must be admin or user'),
  updateUserRole,
);

router.patch(
  '/users/:userId/status',
  param('userId').isMongoId().withMessage('Invalid user id'),
  body('accountStatus').isIn(['active', 'suspended', 'deactivated']).withMessage('invalid account status'),
  updateUserStatus,
);

export default router;
