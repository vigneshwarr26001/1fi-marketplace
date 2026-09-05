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

export interface ISelectedVariant {
    groupKey: string;
    optionValue: string;
}

export interface IProductEmiPlansQuery {
    variants?: string;
}

export interface IProductEmiPlansData {
    productId: string;
    productPrice: number;
    emiPlans: IEmiPlan[];
}

export interface IEmiCalculateRequest {
    productId: string;
    selectedVariants: ISelectedVariant[];
    tenureMonths: number;
}

export interface IEmiCalculateData {
    productPrice: number;
    monthlyAmount: number;
    interestRate: number;
    totalAmount: number;
    cashback: number;
    isNoCostEmi: boolean;
    tenureMonths: number;
}
