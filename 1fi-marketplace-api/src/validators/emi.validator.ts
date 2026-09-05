// region Imports

// Import Package
import { z } from 'zod';

// Import Validators
import { selectedVariantSchema } from '@/validators/checkout.validator';

// endregion

// Validates the EMI calculation request body: product, selected variants, and tenure
export const emiCalculateBodySchema = z.object({
    productId: z.string().min(1, 'productId is required'),
    selectedVariants: z.array(selectedVariantSchema).default([]),
    tenureMonths: z.coerce.number().int().positive('tenureMonths must be a positive integer'),
});

export type EmiCalculateBodyInput = z.infer<typeof emiCalculateBodySchema>;
