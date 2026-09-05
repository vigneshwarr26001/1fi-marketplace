export interface IEmiPlanTemplate {
    planId: string;
    tenureMonths: number;
    interestRate: number;
    isNoCostEmi: boolean;
    cashback: number;
    recommended: boolean;
}

export const EMI_PLAN_TEMPLATES: IEmiPlanTemplate[] = [
    {
        planId: 'emi-3m',
        tenureMonths: 3,
        interestRate: 0,
        isNoCostEmi: true,
        cashback: 0,
        recommended: false,
    },
    {
        planId: 'emi-6m',
        tenureMonths: 6,
        interestRate: 0,
        isNoCostEmi: true,
        cashback: 0,
        recommended: true,
    },
    {
        planId: 'emi-9m',
        tenureMonths: 9,
        interestRate: 12,
        isNoCostEmi: false,
        cashback: 100,
        recommended: false,
    },
    {
        planId: 'emi-12m',
        tenureMonths: 12,
        interestRate: 14,
        isNoCostEmi: false,
        cashback: 200,
        recommended: false,
    },
];
