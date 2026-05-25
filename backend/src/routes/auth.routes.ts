// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = Router();

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
  body('phone').optional().isMobilePhone('any'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post('/register', validate(registerValidation), AuthController.register);
router.post('/login', validate(loginValidation), AuthController.login);
router.get('/me', authenticate, AuthController.getMe);

export default router;