// region Imports

// Import Services
import { apiClient } from '@/services/axios';

// Import Constants
import { API_ENDPOINTS } from '@/constants/api-endpoints.constants';

// Import Types
import type { ApiResponse } from '@/types/api.types';
import type { ICheckoutData, ICheckoutRequest } from '@/types/checkout.types';

// endregion

// Submits the selected product, variants, and EMI plan to create a new checkout on the API
export async function createCheckout(
    payload: ICheckoutRequest,
): Promise<ApiResponse<ICheckoutData>> {
    const response = await apiClient.post<ApiResponse<ICheckoutData>>(
        API_ENDPOINTS.CHECKOUT.CREATE,
        payload,
    );
    return response.data;
}
