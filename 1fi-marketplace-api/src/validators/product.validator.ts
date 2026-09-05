// region Imports

// Import Package
import { z } from 'zod';

// endregion

// Enumerates the allowed product listing sort options
export const productSortSchema = z.enum(['price_asc', 'price_desc', 'newest']);

// Validates and coerces the product listing query params (pagination, search, filters, sort)
export const productListQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
    search: z.string().trim().min(1).optional(),
    category: z.string().trim().min(1).optional(),
    brand: z.string().trim().min(1).optional(),
    sort: productSortSchema.optional(),
});

export type ProductSortInput = z.infer<typeof productSortSchema>;
export type ProductListQueryInput = z.infer<typeof productListQuerySchema>;
