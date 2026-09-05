// region Imports

// Import Package
import { Request, Response, NextFunction } from 'express';

// Import Utils
import { ApiError } from '@/utils/api-error';
import { sendSuccess } from '@/utils/api-response';

// Import Constants
import { HTTP_STATUS } from '@/constants/http-status.constants';

// Import Services
import * as authService from '@/services/auth.service';

// Import Validators
import { LoginInput } from '@/validators/auth.validator';

// endregion

// Authenticates a user with email/password and returns a signed access token
export async function login(
    req: Request<Record<string, string>, unknown, LoginInput>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        sendSuccess(res, HTTP_STATUS.OK, 'Login successful', result);
    } catch (error) {
        next(error);
    }
}

// Fetches the current authenticated user's profile
export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }

        const user = await authService.me(req.user.id);
        sendSuccess(res, HTTP_STATUS.OK, 'User fetched successfully', { user });
    } catch (error) {
        next(error);
    }
}

// Logs out the current user
export async function logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        sendSuccess(res, HTTP_STATUS.OK, 'Logout successful', {
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
}
