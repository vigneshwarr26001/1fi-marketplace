// region Imports

// Import Utils
import { ApiError } from '@/utils/api-error';

// Import Interfaces
import { ISelectedVariant } from '@/interfaces/checkout.interface';
import { IEmiPlan, IVariantGroup } from '@/interfaces/product.interface';

// Import Constants
import { IEmiPlanTemplate } from '@/constants/emi-plan-templates.constants';

// endregion

export interface IPricedProduct {
    price: number;
    variants: IVariantGroup[];
}

// Computes the monthly installment and total payable for a plan, using the reducing-balance
// EMI formula for interest-bearing plans, or a flat split for no-cost/zero-interest plans
export function computeEmi(productPrice: number, plan: IEmiPlanTemplate): IEmiPlan {
    let monthlyAmount: number;
    let totalAmount: number;

    if (plan.isNoCostEmi || plan.interestRate === 0) {
        totalAmount = productPrice;
        monthlyAmount = Math.round(productPrice / plan.tenureMonths);
    } else {
        const r = plan.interestRate / 12 / 100;
        const n = plan.tenureMonths;
        const factor = Math.pow(1 + r, n);
        monthlyAmount = Math.round((productPrice * r * factor) / (factor - 1));
        totalAmount = monthlyAmount * n;
    }

    return {
        planId: plan.planId,
        tenureMonths: plan.tenureMonths,
        interestRate: plan.interestRate,
        isNoCostEmi: plan.isNoCostEmi,
        monthlyAmount,
        totalAmount,
        cashback: plan.cashback,
        recommended: plan.recommended,
    };
}

// Computes the final product price after applying the price modifiers of selected variants
export function getEffectivePrice(
    product: IPricedProduct,
    selectedVariants: ISelectedVariant[],
): number {
    let effectivePrice = product.price;

    for (const selected of selectedVariants) {
        const group = product.variants.find((candidate) => candidate.key === selected.groupKey);
        const option = group?.options.find((candidate) => candidate.value === selected.optionValue);

        if (!group || !option) {
            throw ApiError.unprocessable('Invalid variant selection');
        }

        effectivePrice += option.priceModifier;
    }

    return effectivePrice;
}

// Recomputes every EMI plan template against a given product price
export function recalculatePlans(
    productPrice: number,
    planTemplates: IEmiPlanTemplate[],
): IEmiPlan[] {
    return planTemplates.map((template) => computeEmi(productPrice, template));
}
