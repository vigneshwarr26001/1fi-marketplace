// region Imports

// Import Package
import { Document, Types } from 'mongoose';

// endregion

export interface IVariantOption {
    label: string;
    value: string;
    priceModifier: number;
}

export interface IVariantGroup {
    name: string;
    key: string;
    options: IVariantOption[];
}

export interface ISpecification {
    group: string;
    label: string;
    value: string;
}

export interface IEmiPlan {
    planId: string;
    tenureMonths: number;
    interestRate: number;
    isNoCostEmi: boolean;
    monthlyAmount: number;
    totalAmount: number;
    cashback: number;
    recommended: boolean;
}

export interface IProductImage {
    url: string;
    alt: string;
}

export interface IProductDocument extends Document {
    name: string;
    slug: string;
    brand: string;
    category: Types.ObjectId;
    description: string;
    shortDescription: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    images: IProductImage[];
    variants: IVariantGroup[];
    specifications: ISpecification[];
    emiPlans: IEmiPlan[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
