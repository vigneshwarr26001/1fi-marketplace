'use client';

// region Imports

// Import Package
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

// Import Services
import { getProductBySlug } from '@/services/product.service';

// Import Types
import type { IProduct } from '@/types/product.types';

// endregion

// Fetches a single product's details by its slug
export function useProduct(slug: string | undefined): UseQueryResult<IProduct, Error> {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            if (!slug) {
                throw new Error('Product slug is required');
            }
            // Fetches the product matching the given slug from the API
            const response = await getProductBySlug(slug);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        },
        enabled: !!slug,
    });
}
