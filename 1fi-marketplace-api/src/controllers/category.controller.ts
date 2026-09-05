// region Imports

// Import Package
import { Request, Response, NextFunction } from 'express';

// Import Utils
import { sendSuccess } from '@/utils/api-response';

// Import Constants
import { HTTP_STATUS } from '@/constants/http-status.constants';

// Import Services
import * as categoryService from '@/services/category.service';

// endregion

// Fetches all active categories
export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const items = await categoryService.listActive();
        sendSuccess(res, HTTP_STATUS.OK, 'Categories fetched successfully', { items });
    } catch (error) {
        next(error);
    }
}
