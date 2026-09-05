// region Imports

// Import Package
import { Request, Response, NextFunction } from 'express';

// Import Utils
import { sendSuccess } from '@/utils/api-response';

// Import Constants
import { HTTP_STATUS } from '@/constants/http-status.constants';

// Import Services
import * as productService from '@/services/product.service';

// Import Validators
import { ProductListQueryInput } from '@/validators/product.validator';

// Import Interfaces
import { ISelectedVariant } from '@/interfaces/checkout.interface';

// endregion

// Parses a "group:option,group:option" query string into selected variant pairs
function parseVariantsQuery(variants?: string): ISelectedVariant[] {
    if (!variants) {
        return [];
    }

    return variants
        .split(',')
        .map((pair) => pair.split(':'))
        .filter((parts): parts is [string, string] => parts.length === 2)
        .map(([groupKey, optionValue]) => ({
            groupKey: groupKey.trim(),
            optionValue: optionValue.trim(),
        }))
        .filter((variant) => variant.groupKey.length > 0 && variant.optionValue.length > 0);
}

// Fetches a paginated/filtered list of products
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const query = req.query as unknown as ProductListQueryInput;
        const result = await productService.list(query);
        sendSuccess(res, HTTP_STATUS.OK, 'Products fetched successfully', result);
    } catch (error) {
        next(error);
    }
}

// Fetches a single product by its slug
export async function getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const product = await productService.getBySlug(req.params.slug);
        sendSuccess(res, HTTP_STATUS.OK, 'Product fetched successfully', product);
    } catch (error) {
        next(error);
    }
}

// Fetches the available EMI plans for a product given selected variants
export async function getEmiPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const variantsQuery = req.query.variants;
        const selectedVariants = parseVariantsQuery(
            typeof variantsQuery === 'string' ? variantsQuery : undefined,
        );
        const result = await productService.getEmiPlansForProduct(
            req.params.productId,
            selectedVariants,
        );
        sendSuccess(res, HTTP_STATUS.OK, 'EMI plans fetched successfully', result);
    } catch (error) {
        next(error);
    }
}
