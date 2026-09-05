// region Imports

// Import Package
import { Router } from 'express';

// Import Controllers
import { create } from '@/controllers/checkout.controller';

// Import Middlewares
import { authenticate } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';

// Import Validators
import { checkoutBodySchema } from '@/validators/checkout.validator';

// endregion

const router = Router();

// POST / — creates a checkout/order for the authenticated user
router.post('/', authenticate, validate(checkoutBodySchema), create);

export default router;
