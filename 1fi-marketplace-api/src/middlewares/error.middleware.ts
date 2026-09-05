// region Imports

// Import Package
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Import Utils
import { logger } from '@/utils/logger';
import { ApiError } from '@/utils/api-error';

// Import Constants
import { ERROR_CODES } from '@/constants/error-code.constants';
import { HTTP_STATUS } from '@/constants/http-status.constants';

// Import Types
import { IApiErrorField, IApiErrorResponse } from '@/types/api-response.types';

// endregion

interface IMongoDuplicateKeyError extends Error {
    code: number;
    keyValue?: Record<string, unknown>;
}

// Checks whether an unknown error is a MongoDB duplicate-key (E11000) error
function isDuplicateKeyError(err: unknown): err is IMongoDuplicateKeyError {
    return (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code?: unknown }).code === 11000
    );
}

// Maps a thrown error to the appropriate HTTP status and JSON error response
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof ApiError) {
        const body: IApiErrorResponse = {
            success: false,
            message: err.message,
            errorCode: err.errorCode,
            errors: err.errors,
        };
        res.status(err.statusCode).json(body);
        return;
    }

    if (err instanceof mongoose.Error.ValidationError) {
        const errors: IApiErrorField[] = Object.values(err.errors).map((fieldError) => ({
            path: fieldError.path,
            message: fieldError.message,
        }));

        const body: IApiErrorResponse = {
            success: false,
            message: 'Validation failed',
            errorCode: ERROR_CODES.VALIDATION_ERROR,
            errors,
        };
        res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(body);
        return;
    }

    if (err instanceof mongoose.Error.CastError) {
        const body: IApiErrorResponse = {
            success: false,
            message: `Invalid value for field '${err.path}'`,
            errorCode: ERROR_CODES.BAD_REQUEST,
        };
        res.status(HTTP_STATUS.BAD_REQUEST).json(body);
        return;
    }

    if (isDuplicateKeyError(err)) {
        const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
        const body: IApiErrorResponse = {
            success: false,
            message: `Duplicate value for '${field}'`,
            errorCode: ERROR_CODES.CONFLICT,
        };
        res.status(HTTP_STATUS.CONFLICT).json(body);
        return;
    }

    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
        const body: IApiErrorResponse = {
            success: false,
            message: 'Invalid or expired authentication token',
            errorCode: ERROR_CODES.UNAUTHORIZED,
        };
        res.status(HTTP_STATUS.UNAUTHORIZED).json(body);
        return;
    }

    const message = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : undefined;
    logger.error(`Unhandled error on ${req.method} ${req.originalUrl}: ${message}`, stack);

    const body: IApiErrorResponse = {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    };
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(body);
}
