export interface IApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export interface IApiErrorField {
    path: string;
    message: string;
}

export interface IApiErrorResponse {
    success: false;
    message: string;
    errorCode: string;
    errors?: IApiErrorField[];
}

export type IApiResponse<T> = IApiSuccessResponse<T> | IApiErrorResponse;
