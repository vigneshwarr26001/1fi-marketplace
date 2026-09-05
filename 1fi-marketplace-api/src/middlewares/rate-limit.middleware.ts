// region Imports

// Import Package
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Import Constants
import { ERROR_CODES } from '@/constants/error-code.constants';
import { HTTP_STATUS } from '@/constants/http-status.constants';

// Import Types
import { IApiErrorResponse } from '@/types/api-response.types';

// endregion

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 20;

// Limits repeated login attempts per client within a time window
export const loginLimiter = rateLimit({
    windowMs: LOGIN_WINDOW_MS,
    max: LOGIN_MAX_ATTEMPTS,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response): void => {
        const body: IApiErrorResponse = {
            success: false,
            message: 'Too many login attempts. Please try again later.',
            errorCode: ERROR_CODES.RATE_LIMITED,
        };
        res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(body);
    },
});
