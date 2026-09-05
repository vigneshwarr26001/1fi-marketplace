// region Imports

// Import Package
import { NextFunction, Request, Response } from 'express';

// Import Utils
import { ApiError } from '@/utils/api-error';

// endregion

// Passes a 404 error down the chain for any unmatched route
export function notFound(req: Request, _res: Response, next: NextFunction): void {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`));
}
