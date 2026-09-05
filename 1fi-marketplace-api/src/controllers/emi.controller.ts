// region Imports

// Import Package
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Import Utils
import { ApiError } from '@/utils/api-error';
import { sendSuccess } from '@/utils/api-response';

// Import Constants
import { HTTP_STATUS } from '@/constants/http-status.constants';

// Import Models
import { ProductModel } from '@/models/product.model';

// Import Services
import { computeEmi, getEffectivePrice } from '@/services/emi.service';

// Import Validators
import { EmiCalculateBodyInput } from '@/validators/emi.validator';

// endregion

// Calculates the EMI breakdown (monthly amount, interest, cashback) for a product and tenure
export async function calculate(
    req: Request<Record<string, string>, unknown, EmiCalculateBodyInput>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const { productId, selectedVariants, tenureMonths } = req.body;

        if (!Types.ObjectId.isValid(productId)) {
            throw ApiError.notFound('Product not found');
        }

        // Fetches the active product to price the EMI plan against
        const product = await ProductModel.findOne({ _id: productId, isActive: true });

        if (!product) {
            throw ApiError.notFound('Product not found');
        }

        const productPrice = getEffectivePrice(product, selectedVariants);

        const planTemplate = product.emiPlans.find((plan) => plan.tenureMonths === tenureMonths);

        if (!planTemplate) {
            throw ApiError.notFound('No EMI plan available for the requested tenure');
        }

        const computed = computeEmi(productPrice, planTemplate);

        sendSuccess(res, HTTP_STATUS.OK, 'EMI calculated successfully', {
            productPrice,
            monthlyAmount: computed.monthlyAmount,
            interestRate: computed.interestRate,
            totalAmount: computed.totalAmount,
            cashback: computed.cashback,
            isNoCostEmi: computed.isNoCostEmi,
            tenureMonths: computed.tenureMonths,
        });
    } catch (error) {
        next(error);
    }
}
