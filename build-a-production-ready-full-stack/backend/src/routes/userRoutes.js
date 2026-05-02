import express from 'express';
import { body } from 'express-validator';
import { getUsers, inviteUser } from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/', asyncHandler(getUsers));
router.post(
  '/invite',
  authorize('admin'),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('role').optional().isIn(['admin', 'member']).withMessage('Invalid role')
  ],
  validate,
  asyncHandler(inviteUser)
);

export default router;
