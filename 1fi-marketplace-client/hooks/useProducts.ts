'use client';

// region Imports

// Import Package
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

// Import Services
import { getProducts } from '@/services/product.service';

// Import Types
import type { IProductListData, IProductListQuery } from '@/types/product.types';

// endregion

// Fetches a paginated/filtered list of products
export function useProducts(params?: IProductListQuery): UseQueryResult<IProductListData, Error> {
    return useQuery({
        queryKey: ['products', params ?? {}],
        queryFn: async () => {
            // Fetches products matching the given query params from the API
            const response = await getProducts(params);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        },
    });
}
