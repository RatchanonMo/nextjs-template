import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  getTaskAnalytics,
  getTaskInsights,
  getDeletedTasks,
  restoreTask,
} from '../controllers/taskController';
import {
  validateTask,
  validateTaskUpdate,
  validateTaskId,
  validateQueryParams,
} from '../middleware/validators';
import { normalizeTaskQuery } from '../middleware/queryParams';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

// Stats route (must be before /:id to avoid conflict)
router.get('/stats', getTaskStats);
router.get('/analytics', getTaskAnalytics);
router.get('/insights', validateQueryParams, normalizeTaskQuery, getTaskInsights);
router.get('/deleted', validateQueryParams, normalizeTaskQuery, getDeletedTasks);

router.route('/')
  .get(validateQueryParams, normalizeTaskQuery, getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .get(validateTaskId, getTask)
  .put(validateTaskId, ...validateTaskUpdate, updateTask)
  .delete(validateTaskId, deleteTask);

router.patch('/:id/restore', validateTaskId, restoreTask);

export default router;
