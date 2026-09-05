// region Imports

// Import Package
import { Types } from 'mongoose';

// Import Models
import { ProductModel } from '@/models/product.model';
import { CheckoutModel } from '@/models/checkout.model';

// Import Interfaces
import { ICheckoutDocument } from '@/interfaces/checkout.interface';

// Import Utils
import { ApiError } from '@/utils/api-error';

// Import Services
import { computeEmi, getEffectivePrice } from '@/services/emi.service';

// Import Validators
import { CheckoutBodyInput } from '@/validators/checkout.validator';

// endregion

export interface ICheckoutProductSummary {
    id: string;
    name: string;
    brand: string;
    slug: string;
    image: string;
}

export interface ICheckoutCreateResult {
    checkout: ICheckoutDocument;
    product: ICheckoutProductSummary;
}

// Creates a checkout record for a user, recomputing the EMI plan and prices server-side
export async function create(
    userId: string,
    body: CheckoutBodyInput,
): Promise<ICheckoutCreateResult> {
    if (!Types.ObjectId.isValid(body.productId)) {
        throw ApiError.notFound('Product not found');
    }

    // Looks up the active product being checked out
    const product = await ProductModel.findOne({ _id: body.productId, isActive: true });

    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    const effectivePrice = getEffectivePrice(product, body.selectedVariants);

    const planTemplate = product.emiPlans.find(
        (plan) => plan.planId === body.selectedEmiPlan.planId,
    );

    if (!planTemplate) {
        throw ApiError.unprocessable('Invalid EMI plan selected');
    }

    const recomputedPlan = computeEmi(effectivePrice, planTemplate);

    // Persists the new checkout record with the recomputed price and EMI plan
    const checkout = await CheckoutModel.create({
        userId,
        productId: product._id,
        selectedVariants: body.selectedVariants,
        selectedEmiPlan: {
            planId: recomputedPlan.planId,
            tenureMonths: recomputedPlan.tenureMonths,
            interestRate: recomputedPlan.interestRate,
            isNoCostEmi: recomputedPlan.isNoCostEmi,
        },
        productPrice: effectivePrice,
        monthlyEmi: recomputedPlan.monthlyAmount,
        totalPayable: recomputedPlan.totalAmount,
        status: 'INITIATED',
    });

    return {
        checkout,
        product: {
            id: (product._id as Types.ObjectId).toString(),
            name: product.name,
            brand: product.brand,
            slug: product.slug,
            image: product.images[0]?.url ?? '',
        },
    };
}
