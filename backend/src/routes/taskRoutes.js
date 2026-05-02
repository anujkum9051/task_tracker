import express from 'express';
import { body, param, query } from 'express-validator';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();
const statuses = ['Todo', 'In Progress', 'Done'];

router.use(protect);

router
  .route('/')
  .get(
    [
      query('status').optional().isIn(statuses).withMessage('Invalid status'),
      query('project').optional().isMongoId().withMessage('Invalid project id'),
      query('assignedTo').optional().isMongoId().withMessage('Invalid user id'),
      query('search').optional().trim().isLength({ max: 120 })
    ],
    validate,
    asyncHandler(getTasks)
  )
  .post(
    authorize('admin'),
    [
      body('title').trim().isLength({ min: 2 }).withMessage('Task title is required'),
      body('description').optional().trim().isLength({ max: 1500 }),
      body('status').optional().isIn(statuses).withMessage('Invalid status'),
      body('dueDate').isISO8601().withMessage('A valid due date is required'),
      body('assignedTo').isMongoId().withMessage('Assigned user is required'),
      body('projectId').isMongoId().withMessage('Project is required')
    ],
    validate,
    asyncHandler(createTask)
  );

router
  .route('/:id')
  .put(
    [
      param('id').isMongoId().withMessage('Invalid task id'),
      body('status').optional().isIn(statuses).withMessage('Invalid status'),
      body('title').optional().trim().isLength({ min: 2 }).withMessage('Task title is required'),
      body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
      body('assignedTo').optional().isMongoId().withMessage('Invalid assigned user'),
      body('projectId').optional().isMongoId().withMessage('Invalid project')
    ],
    validate,
    asyncHandler(updateTask)
  )
  .delete(
    authorize('admin'),
    param('id').isMongoId().withMessage('Invalid task id'),
    validate,
    asyncHandler(deleteTask)
  );

export default router;
