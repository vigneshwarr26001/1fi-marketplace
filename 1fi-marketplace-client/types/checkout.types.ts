// region Imports

// Import Types
import type { ISelectedVariant } from '@/types/emi.types';

// endregion

export type CheckoutStatus = 'INITIATED' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface ISelectedEmiPlan {
    planId: string;
    tenureMonths: number;
    interestRate: number;
    isNoCostEmi: boolean;
}

export interface ICheckout {
    id: string;
    userId: string;
    productId: string;
    selectedVariants: ISelectedVariant[];
    selectedEmiPlan: ISelectedEmiPlan;
    productPrice: number;
    monthlyEmi: number;
    totalPayable: number;
    status: CheckoutStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ICheckoutProductSummary {
    id: string;
    name: string;
    brand: string;
    slug: string;
    image: string;
}

export interface ICheckoutRequestSelectedEmiPlan {
    planId: string;
    tenureMonths: number;
}

export interface ICheckoutRequest {
    productId: string;
    selectedVariants: ISelectedVariant[];
    selectedEmiPlan: ICheckoutRequestSelectedEmiPlan;
}

export interface ICheckoutData {
    checkout: ICheckout;
    product: ICheckoutProductSummary;
}
