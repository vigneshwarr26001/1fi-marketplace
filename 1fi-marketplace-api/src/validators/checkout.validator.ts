// region Imports

// Import Package
import { z } from 'zod';

// endregion

// Validates a single selected product variant (group key + chosen option value)
export const selectedVariantSchema = z.object({
    groupKey: z.string().min(1, 'groupKey is required'),
    optionValue: z.string().min(1, 'optionValue is required'),
});

// Validates a selected EMI plan reference (plan id + tenure in months)
export const selectedEmiPlanSchema = z.object({
    planId: z.string().min(1, 'planId is required'),
    tenureMonths: z.coerce.number().int().positive('tenureMonths must be a positive integer'),
});

// Validates the checkout request body: product, selected variants, and chosen EMI plan
export const checkoutBodySchema = z.object({
    productId: z.string().min(1, 'productId is required'),
    selectedVariants: z.array(selectedVariantSchema).default([]),
    selectedEmiPlan: selectedEmiPlanSchema,
});

export type SelectedVariantInput = z.infer<typeof selectedVariantSchema>;
export type SelectedEmiPlanInput = z.infer<typeof selectedEmiPlanSchema>;
export type CheckoutBodyInput = z.infer<typeof checkoutBodySchema>;
