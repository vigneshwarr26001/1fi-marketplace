// region Imports

// Import Package
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

// endregion

// Generates a unique request id and exposes it on the request and response
export function attachRequestId(req: Request, res: Response, next: NextFunction): void {
    req.id = randomUUID();
    res.setHeader('X-Request-Id', req.id);
    next();
}
