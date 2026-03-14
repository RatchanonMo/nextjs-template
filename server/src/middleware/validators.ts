import { body, param, query } from 'express-validator';

export const validateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot be more than 1000 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done']).withMessage('Status must be todo, in-progress, or done'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('category')
    .optional()
    .isIn(['MARKETING', 'DESIGN', 'DEVELOPMENT', 'OPERATIONS', 'PRODUCT', 'PERSONAL'])
    .withMessage('Invalid category'),

  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('Tags must be an array with maximum 10 items'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),

  body('assignees')
    .optional()
    .isArray().withMessage('Assignees must be an array'),

  body('assignees.*.name')
    .optional()
    .isString().withMessage('Assignee name must be a string'),

  body('assignees.*.color')
    .optional()
    .isString().withMessage('Assignee color must be a string'),
];

export const validateTaskUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot be more than 1000 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done']).withMessage('Status must be todo, in-progress, or done'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('category')
    .optional()
    .isIn(['MARKETING', 'DESIGN', 'DEVELOPMENT', 'OPERATIONS', 'PRODUCT', 'PERSONAL'])
    .withMessage('Invalid category'),

  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('Tags must be an array with maximum 10 items'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),

  body('assignees')
    .optional()
    .isArray().withMessage('Assignees must be an array'),
];

export const validateTaskId = [
  param('id').isMongoId().withMessage('Invalid task ID'),
];

export const validateQueryParams = [
  query('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done']).withMessage('Status must be todo, in-progress, or done'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long'),

  query('tagsAll')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') return true;
      if (Array.isArray(value) && value.every((item) => typeof item === 'string')) return true;
      throw new Error('tagsAll must be a comma-separated string or an array of strings');
    }),

  query('assigneeNamesAll')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') return true;
      if (Array.isArray(value) && value.every((item) => typeof item === 'string')) return true;
      throw new Error('assigneeNamesAll must be a comma-separated string or an array of strings');
    }),

  query('includeDeleted')
    .optional()
    .isBoolean().withMessage('includeDeleted must be a boolean'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'dueDate', '-dueDate', 'deletedAt', '-deletedAt', 'priority', '-priority'])
    .withMessage('sortBy must be one of: createdAt, -createdAt, updatedAt, -updatedAt, dueDate, -dueDate, deletedAt, -deletedAt, priority, -priority'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
];

export const validateWorkspaceQueryParams = [
  query('projectSearch')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('projectSearch too long'),

  query('category')
    .optional()
    .isIn(['MARKETING', 'DESIGN', 'DEVELOPMENT', 'OPERATIONS', 'PRODUCT', 'PERSONAL'])
    .withMessage('Invalid project category'),

  query('sortBy')
    .optional()
    .isIn(['name', '-name', 'created']).withMessage('sortBy must be one of: name, -name, created'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
];
