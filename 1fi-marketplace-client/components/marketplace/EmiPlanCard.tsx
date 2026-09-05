// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Icons
import { CheckCircle2, Circle } from 'lucide-react';

// Import Types
import type { IEmiPlan } from '@/types/emi.types';

// Import Utils
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

// Import Components
import { Badge } from '@/components/ui/Badge';

// endregion

export interface EmiPlanCardProps {
    plan: IEmiPlan;
    isSelected: boolean;
    onSelect: (planId: string) => void;
    className?: string;
}

// Renders a selectable radio-style card summarizing one EMI plan (monthly amount,
// tenure, total payable, and any cashback/badges) and reports selection via onSelect
export function EmiPlanCard({
    plan,
    isSelected,
    onSelect,
    className,
}: EmiPlanCardProps): ReactNode {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(plan.planId)}
            className={cn(
                'flex w-full items-start justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-150',
                isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-indigo-200',
                className,
            )}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(plan.monthlyAmount)}
                        <span className="text-xs font-medium text-slate-500">/mo</span>
                    </span>
                    {plan.isNoCostEmi ? (
                        <Badge variant="success">No Cost EMI</Badge>
                    ) : (
                        <span className="text-xs text-slate-500">{plan.interestRate}% p.a.</span>
                    )}
                    {plan.recommended ? <Badge variant="warning">Recommended</Badge> : null}
                </div>
                <p className="text-sm text-slate-600">{plan.tenureMonths} months</p>
                <p className="text-xs text-slate-500">
                    Total payable:{' '}
                    <span className="font-medium text-slate-700">
                        {formatCurrency(plan.totalAmount)}
                    </span>
                </p>
                {plan.cashback > 0 ? (
                    <p className="text-xs font-medium text-emerald-600">
                        {formatCurrency(plan.cashback)} cashback
                    </p>
                ) : null}
            </div>
            {isSelected ? (
                <CheckCircle2
                    className="mt-0.5 h-6 w-6 shrink-0 text-indigo-600"
                    aria-hidden="true"
                />
            ) : (
                <Circle className="mt-0.5 h-6 w-6 shrink-0 text-slate-300" aria-hidden="true" />
            )}
        </button>
    );
}
