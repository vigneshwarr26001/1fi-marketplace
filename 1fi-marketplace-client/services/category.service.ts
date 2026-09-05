// region Imports

// Import Services
import { apiClient } from '@/services/axios';

// Import Constants
import { API_ENDPOINTS } from '@/constants/api-endpoints.constants';

// Import Types
import type { ApiResponse } from '@/types/api.types';
import type { ICategoryListData } from '@/types/product.types';

// endregion

// Fetches the list of product categories from the API
export async function getCategories(): Promise<ApiResponse<ICategoryListData>> {
    const response = await apiClient.get<ApiResponse<ICategoryListData>>(
        API_ENDPOINTS.CATEGORIES.LIST,
    );
    return response.data;
}
