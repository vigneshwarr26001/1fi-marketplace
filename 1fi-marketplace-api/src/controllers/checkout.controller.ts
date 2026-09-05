// region Imports

// Import Package
import { Request, Response, NextFunction } from 'express';

// Import Utils
import { ApiError } from '@/utils/api-error';
import { sendSuccess } from '@/utils/api-response';

// Import Constants
import { HTTP_STATUS } from '@/constants/http-status.constants';

// Import Services
import * as checkoutService from '@/services/checkout.service';

// Import Validators
import { CheckoutBodyInput } from '@/validators/checkout.validator';

// endregion

// Creates a checkout/order for the authenticated user
export async function create(
    req: Request<Record<string, string>, unknown, CheckoutBodyInput>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }

        const result = await checkoutService.create(req.user.id, req.body);
        sendSuccess(res, HTTP_STATUS.CREATED, 'Checkout created successfully', result);
    } catch (error) {
        next(error);
    }
}
