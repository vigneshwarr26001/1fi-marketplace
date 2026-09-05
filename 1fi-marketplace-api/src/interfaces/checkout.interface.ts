// region Imports

// Import Package
import { Document, Types } from 'mongoose';

// endregion

export type CheckoutStatus = 'INITIATED' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface ISelectedVariant {
    groupKey: string;
    optionValue: string;
}

export interface ISelectedEmiPlan {
    planId: string;
    tenureMonths: number;
    interestRate: number;
    isNoCostEmi: boolean;
}

export interface ICheckoutDocument extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    selectedVariants: ISelectedVariant[];
    selectedEmiPlan: ISelectedEmiPlan;
    productPrice: number;
    monthlyEmi: number;
    totalPayable: number;
    status: CheckoutStatus;
    createdAt: Date;
    updatedAt: Date;
}
