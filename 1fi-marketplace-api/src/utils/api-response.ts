// region Imports

// Import Package
import { Response } from 'express';

// Import Types
import { IApiSuccessResponse } from '@/types/api-response.types';

// endregion

// Sends a standardized JSON success response with a status code, message, and payload
export function sendSuccess<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T,
): Response<IApiSuccessResponse<T>> {
    const body: IApiSuccessResponse<T> = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(body);
}
