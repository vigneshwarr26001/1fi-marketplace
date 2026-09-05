// region Imports

// Import Constants
import { HTTP_STATUS } from '@/constants/http-status.constants';
import { ERROR_CODES, ErrorCode } from '@/constants/error-code.constants';

// Import Types
import { IApiErrorField } from '@/types/api-response.types';

// endregion

// Custom error carrying an HTTP status code, an app error code, and optional field errors
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: ErrorCode;
    public readonly errors?: IApiErrorField[];

    constructor(
        statusCode: number,
        message: string,
        errorCode: ErrorCode,
        errors?: IApiErrorField[],
    ) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }

    // Builds a 400 Bad Request ApiError
    static badRequest(
        message = 'Bad request',
        errorCode: ErrorCode = ERROR_CODES.VALIDATION_ERROR,
        errors?: IApiErrorField[],
    ): ApiError {
        return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errorCode, errors);
    }

    // Builds a 401 Unauthorized ApiError
    static unauthorized(
        message = 'Unauthorized',
        errorCode: ErrorCode = ERROR_CODES.UNAUTHORIZED,
        errors?: IApiErrorField[],
    ): ApiError {
        return new ApiError(HTTP_STATUS.UNAUTHORIZED, message, errorCode, errors);
    }

    // Builds a 403 Forbidden ApiError
    static forbidden(
        message = 'Forbidden',
        errorCode: ErrorCode = ERROR_CODES.FORBIDDEN,
        errors?: IApiErrorField[],
    ): ApiError {
        return new ApiError(HTTP_STATUS.FORBIDDEN, message, errorCode, errors);
    }

    // Builds a 404 Not Found ApiError
    static notFound(
        message = 'Resource not found',
        errorCode: ErrorCode = ERROR_CODES.NOT_FOUND,
        errors?: IApiErrorField[],
    ): ApiError {
        return new ApiError(HTTP_STATUS.NOT_FOUND, message, errorCode, errors);
    }

    // Builds a 409 Conflict ApiError
    static conflict(
        message = 'Conflict',
        errorCode: ErrorCode = ERROR_CODES.CONFLICT,
        errors?: IApiErrorField[],
    ): ApiError {
        return new ApiError(HTTP_STATUS.CONFLICT, message, errorCode, errors);
    }

    // Builds a 422 Unprocessable Entity ApiError, used for validation failures
    static unprocessable(
        message = 'Validation failed',
        errorCode: ErrorCode = ERROR_CODES.VALIDATION_ERROR,
        errors?: IApiErrorField[],
    ): ApiError {
        return new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, errorCode, errors);
    }

    // Builds a 500 Internal Server Error ApiError
    static internal(
        message = 'Internal server error',
        errorCode: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
        errors?: IApiErrorField[],
    ): ApiError {
        return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, errorCode, errors);
    }
}
