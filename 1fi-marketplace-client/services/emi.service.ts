// region Imports

// Import Services
import { apiClient } from '@/services/axios';

// Import Constants
import { API_ENDPOINTS } from '@/constants/api-endpoints.constants';

// Import Types
import type { ApiResponse } from '@/types/api.types';
import type { IEmiCalculateData, IEmiCalculateRequest } from '@/types/emi.types';

// endregion

// Sends the product, selected variants, and tenure to the API to compute EMI figures
export async function calculateEmi(
    payload: IEmiCalculateRequest,
): Promise<ApiResponse<IEmiCalculateData>> {
    const response = await apiClient.post<ApiResponse<IEmiCalculateData>>(
        API_ENDPOINTS.EMI.CALCULATE,
        payload,
    );
    return response.data;
}
