export interface IPagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface IApiErrorDetail {
    path: string;
    message: string;
}

export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errorCode: ApiErrorCode;
    errors?: IApiErrorDetail[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiErrorCode =
    | 'VALIDATION_ERROR'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'INTERNAL_SERVER_ERROR';
