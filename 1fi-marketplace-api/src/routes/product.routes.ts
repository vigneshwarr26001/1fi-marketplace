// region Imports

// Import Package
import { Router } from 'express';

// Import Controllers
import { getBySlug, getEmiPlans, list } from '@/controllers/product.controller';

// Import Middlewares
import { validate } from '@/middlewares/validation.middleware';

// Import Validators
import { productListQuerySchema } from '@/validators/product.validator';

// endregion

const router = Router();

// GET / — lists products with optional filters/pagination
router.get('/', validate(productListQuerySchema, 'query'), list);
// GET /:slug — fetches a single product by slug
router.get('/:slug', getBySlug);
// GET /:productId/emi-plans — fetches EMI plans available for a product
router.get('/:productId/emi-plans', getEmiPlans);

export default router;
