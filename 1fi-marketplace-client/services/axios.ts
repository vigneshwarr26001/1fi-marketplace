// region Imports

// Import Package
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// Import Utils
import { clearAccessToken, clearStoredUser, getAccessToken } from '@/utils/storage';

// Import Types
import type { ApiErrorCode, ApiErrorResponse, IApiErrorDetail } from '@/types/api.types';

// endregion

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1';

// Normalizes API/network failures into a typed error carrying the API's error code and details
export class ApiError extends Error {
    public readonly errorCode?: ApiErrorCode;
    public readonly errors?: IApiErrorDetail[];

    constructor(message: string, errorCode?: ApiErrorCode, errors?: IApiErrorDetail[]) {
        super(message);
        this.name = 'ApiError';
        this.errorCode = errorCode;
        this.errors = errors;
    }
}

// Shared axios instance used by all frontend services to call the backend API
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                clearAccessToken();
                clearStoredUser();
                if (typeof window !== 'undefined' && window.location.pathname !== ROUTES.LOGIN) {
                    window.location.assign(ROUTES.LOGIN);
                }
            }

            if (data && typeof data === 'object' && 'message' in data) {
                return Promise.reject(new ApiError(data.message, data.errorCode, data.errors));
            }

            return Promise.reject(
                new ApiError('Something went wrong. Please try again.', 'INTERNAL_SERVER_ERROR'),
            );
        }

        return Promise.reject(
            new ApiError('Network error. Please check your connection and try again.'),
        );
    },
);

export default apiClient;
