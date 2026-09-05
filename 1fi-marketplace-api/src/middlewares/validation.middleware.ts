// region Imports

// Import Package
import { ZodSchema } from 'zod';
import { NextFunction, Request, RequestHandler, Response } from 'express';

// Import Utils
import { ApiError } from '@/utils/api-error';

// Import Constants
import { ERROR_CODES } from '@/constants/error-code.constants';

// Import Types
import { IApiErrorField } from '@/types/api-response.types';

// endregion

export type ValidationSource = 'body' | 'query' | 'params';

// Validates a request's body/query/params against a Zod schema, replacing it with the parsed data
export function validate(schema: ZodSchema, source: ValidationSource = 'body'): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const errors: IApiErrorField[] = result.error.issues.map((issue) => ({
                path: issue.path.length > 0 ? issue.path.join('.') : source,
                message: issue.message,
            }));

            next(new ApiError(422, 'Validation failed', ERROR_CODES.VALIDATION_ERROR, errors));
            return;
        }

        (req as unknown as Record<ValidationSource, unknown>)[source] = result.data;
        next();
    };
}
