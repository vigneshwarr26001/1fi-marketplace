// region Imports

// Import Package
import { NextFunction, Request, Response } from 'express';

// Import Utils
import { ApiError } from '@/utils/api-error';
import { verifyAccessToken } from '@/utils/jwt';

// Import Interfaces
import { UserRole } from '@/interfaces/user.interface';

// endregion

const BEARER_PREFIX = 'Bearer ';

// Verifies the Bearer token on the request and attaches the decoded user to req.user
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        next(ApiError.unauthorized('Authorization header is missing'));
        return;
    }

    const token = authHeader.startsWith(BEARER_PREFIX)
        ? authHeader.slice(BEARER_PREFIX.length).trim()
        : '';

    if (!token) {
        next(ApiError.unauthorized('Authorization header must be in the format "Bearer <token>"'));
        return;
    }

    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.id, email: payload.email, role: payload.role };
        next();
    } catch (err) {
        next(err);
    }
}

// Restricts access to requests whose authenticated user has one of the given roles
export function authorize(...roles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(ApiError.unauthorized('Authentication required'));
            return;
        }

        if (!roles.includes(req.user.role)) {
            next(ApiError.forbidden('You do not have permission to perform this action'));
            return;
        }

        next();
    };
}
