import { Router } from 'express';
import { body, param } from 'express-validator';
import { protect } from '../middleware/auth';
import { createLabel, createProject, deleteProject, getWorkspace, updateProject } from '../controllers/workspaceController';
import { validateWorkspaceQueryParams } from '../middleware/validators';
import { normalizeWorkspaceQuery } from '../middleware/queryParams';

const router = Router();

router.use(protect);

router.get('/', validateWorkspaceQueryParams, normalizeWorkspaceQuery, getWorkspace);

router.post(
  '/projects',
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('category')
    .isIn(['MARKETING', 'DESIGN', 'DEVELOPMENT', 'OPERATIONS', 'PRODUCT', 'PERSONAL'])
    .withMessage('Invalid project category'),
  createProject,
);

router.post(
  '/labels',
  body('name').trim().notEmpty().withMessage('Label name is required'),
  body('color').trim().notEmpty().withMessage('Label color is required'),
  createLabel,
);

router.put(
  '/projects/:projectId',
  param('projectId').trim().notEmpty().withMessage('Project id is required'),
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
  body('category')
    .optional()
    .isIn(['MARKETING', 'DESIGN', 'DEVELOPMENT', 'OPERATIONS', 'PRODUCT', 'PERSONAL'])
    .withMessage('Invalid project category'),
  updateProject,
);

router.delete(
  '/projects/:projectId',
  param('projectId').trim().notEmpty().withMessage('Project id is required'),
  deleteProject,
);

export default router;
