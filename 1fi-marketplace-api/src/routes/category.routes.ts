// region Imports

// Import Package
import { Router } from 'express';

// Import Controllers
import { list } from '@/controllers/category.controller';

// endregion

const router = Router();

// GET / — lists all active categories
router.get('/', list);

export default router;
