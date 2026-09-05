// region Imports

// Import Package
import { Router } from 'express';

// Import Routes
import emiRoutes from '@/routes/emi.routes';
import authRoutes from '@/routes/auth.routes';
import productRoutes from '@/routes/product.routes';
import categoryRoutes from '@/routes/category.routes';
import checkoutRoutes from '@/routes/checkout.routes';

// endregion

const router = Router();

// Mounts the auth routes under /auth
router.use('/auth', authRoutes);
// Mounts the category routes under /categories
router.use('/categories', categoryRoutes);
// Mounts the product routes under /products
router.use('/products', productRoutes);
// Mounts the EMI routes under /emi
router.use('/emi', emiRoutes);
// Mounts the checkout routes under /checkout
router.use('/checkout', checkoutRoutes);

export default router;
