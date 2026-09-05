// region Imports

// Import Package
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Import Config
import { env } from '@/config/env';

// Import Utils
import { ApiError } from '@/utils/api-error';

// endregion

export interface IJwtPayload {
    id: string;
    email: string;
    role: 'user' | 'admin';
}

interface IJwtTokenClaims {
    sub: string;
    email: string;
    role: 'user' | 'admin';
}

// Signs and returns a JWT access token encoding the user's id, email, and role
export function signAccessToken(payload: IJwtPayload): string {
    const claims: IJwtTokenClaims = {
        sub: payload.id,
        email: payload.email,
        role: payload.role,
    };

    return jwt.sign(claims, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
}

// Verifies a JWT access token and returns its decoded payload, throwing ApiError on failure
export function verifyAccessToken(token: string): IJwtPayload {
    if (!token) {
        throw ApiError.unauthorized('Access token is missing');
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as IJwtTokenClaims;

        return {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw ApiError.unauthorized('Access token has expired');
        }
        if (err instanceof JsonWebTokenError) {
            throw ApiError.unauthorized('Access token is malformed or invalid');
        }
        throw ApiError.unauthorized('Failed to authenticate access token');
    }
}
