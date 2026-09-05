// region Imports

// Import Services
import { apiClient } from '@/services/axios';

// Import Constants
import { API_ENDPOINTS } from '@/constants/api-endpoints.constants';

// Import Types
import type { ApiResponse } from '@/types/api.types';
import type { ILoginData, ILoginRequest, ILogoutData, IMeData } from '@/types/auth.types';

// endregion

// Sends email/password credentials to the API and returns the signed access token and user
export async function loginApi(payload: ILoginRequest): Promise<ApiResponse<ILoginData>> {
    const response = await apiClient.post<ApiResponse<ILoginData>>(
        API_ENDPOINTS.AUTH.LOGIN,
        payload,
    );
    return response.data;
}

// Fetches the currently authenticated user's profile from the API
export async function meApi(): Promise<ApiResponse<IMeData>> {
    const response = await apiClient.get<ApiResponse<IMeData>>(API_ENDPOINTS.AUTH.ME);
    return response.data;
}

// Notifies the API to invalidate the current session/access token
export async function logoutApi(): Promise<ApiResponse<ILogoutData>> {
    const response = await apiClient.post<ApiResponse<ILogoutData>>(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
}
