// region Imports

// Import Package
import { Router } from 'express';

// Import Controllers
import { calculate } from '@/controllers/emi.controller';

// Import Middlewares
import { validate } from '@/middlewares/validation.middleware';

// Import Validators
import { emiCalculateBodySchema } from '@/validators/emi.validator';

// endregion

const router = Router();

// POST /calculate — calculates the EMI breakdown for a product/tenure
router.post('/calculate', validate(emiCalculateBodySchema), calculate);

export default router;
