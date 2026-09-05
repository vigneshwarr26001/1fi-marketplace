'use client';

// region Imports

// Import Package
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

// Import Services
import { getEmiPlans } from '@/services/product.service';

// Import Utils
import { serializeSelectedVariants } from '@/utils/variant';

// Import Types
import type { IProductEmiPlansData, ISelectedVariant } from '@/types/emi.types';

// endregion

// Fetches available EMI plans for a product given its selected variants
export function useEmiPlans(
    productId: string | undefined,
    selectedVariants: ISelectedVariant[],
): UseQueryResult<IProductEmiPlansData, Error> {
    const variantsKey = serializeSelectedVariants(selectedVariants);

    return useQuery({
        queryKey: ['emi-plans', productId, variantsKey],
        queryFn: async () => {
            if (!productId) {
                throw new Error('Product id is required');
            }
            // Fetches EMI plans for the product/variant combination from the API
            const response = await getEmiPlans(productId, selectedVariants);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        },
        enabled: !!productId,
    });
}
