import { Router } from 'express';
import { body, query } from 'express-validator';
import { changePassword, checkEmailAvailability, getMe, login, logout, register } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { loginBruteForceGuard } from '../middleware/authBruteForce';

const router = Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const emailAvailabilityValidation = [
  query('email').isEmail().withMessage('A valid email is required'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('newPassword').custom((value, { req }) => {
    if (value === req.body.currentPassword) {
      throw new Error('New password must be different from current password');
    }
    return true;
  }),
];

router.post('/register', registerValidation, register);
router.get('/check-email', emailAvailabilityValidation, checkEmailAvailability);
router.post('/login', loginBruteForceGuard, loginValidation, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/change-password', protect, changePasswordValidation, changePassword);

export default router;
