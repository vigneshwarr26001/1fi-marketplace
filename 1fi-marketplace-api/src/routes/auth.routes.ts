// region Imports

// Import Package
import { Router } from 'express';

// Import Controllers
import { login, logout, me } from '@/controllers/auth.controller';

// Import Middlewares
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';
import { loginLimiter } from '@/middlewares/rate-limit.middleware';

// Import Validators
import { loginSchema } from '@/validators/auth.validator';

// endregion

const router = Router();

// POST /login — rate-limited, validated login that returns an access token
router.post('/login', loginLimiter, validate(loginSchema), login);
// GET /me — returns the authenticated user's profile
router.get('/me', authenticate, me);
// POST /logout — logs out the authenticated user
router.post('/logout', authenticate, logout);

export default router;
