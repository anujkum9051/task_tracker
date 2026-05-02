import express from 'express';
import { body, param } from 'express-validator';
import {
  createProject,
  getProject,
  getProjects,
  updateProjectMembers
} from '../controllers/projectController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(asyncHandler(getProjects))
  .post(
    authorize('admin'),
    [
      body('name').trim().isLength({ min: 2 }).withMessage('Project name is required'),
      body('description').optional().trim().isLength({ max: 1000 }),
      body('members').optional().isArray().withMessage('Members must be an array')
    ],
    validate,
    asyncHandler(createProject)
  );

router
  .route('/:id')
  .get(param('id').isMongoId().withMessage('Invalid project id'), validate, asyncHandler(getProject));

router.put(
  '/:id/members',
  authorize('admin'),
  [
    param('id').isMongoId().withMessage('Invalid project id'),
    body('members').isArray().withMessage('Members must be an array')
  ],
  validate,
  asyncHandler(updateProjectMembers)
);

export default router;
