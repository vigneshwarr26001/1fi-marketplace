// region Imports

// Import Types
import type { ISelectedVariant } from '@/types/emi.types';

// endregion

// Serializes selected product variants into a "groupKey:optionValue" comma-joined string
export function serializeSelectedVariants(selectedVariants: ISelectedVariant[]): string {
    return selectedVariants
        .map((variant) => `${variant.groupKey}:${variant.optionValue}`)
        .join(',');
}
