'use client';

// region Imports

// Import Package
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

// Import Services
import { getCategories } from '@/services/category.service';

// Import Types
import type { ICategory } from '@/types/product.types';

// endregion

// Fetches the list of product categories for use in filters/navigation
export function useCategories(): UseQueryResult<ICategory[], Error> {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            // Fetches all categories from the API
            const response = await getCategories();
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data.items;
        },
    });
}
