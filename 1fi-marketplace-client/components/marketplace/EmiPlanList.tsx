// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Types
import type { IEmiPlan } from '@/types/emi.types';

// Import Utils
import { cn } from '@/utils/cn';

// Import Components
import { Skeleton } from '@/components/common/Skeleton';
import { EmiPlanCard } from '@/components/marketplace/EmiPlanCard';

// endregion

export interface EmiPlanListProps {
    plans: IEmiPlan[];
    selectedPlanId: string | null;
    onSelect: (planId: string) => void;
    isLoading?: boolean;
    skeletonCount?: number;
    className?: string;
}

// Renders a list of selectable EMI plan cards as a radio group, or skeleton
// placeholders while plans are still loading
export function EmiPlanList({
    plans,
    selectedPlanId,
    onSelect,
    isLoading = false,
    skeletonCount = 3,
    className,
}: EmiPlanListProps): ReactNode {
    if (isLoading) {
        return (
            <div className={cn('flex flex-col gap-3', className)}>
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div key={index} className="rounded-2xl border-2 border-slate-200 bg-white p-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton height={22} width="45%" />
                            <Skeleton height={12} width="30%" />
                            <Skeleton height={12} width="55%" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div role="radiogroup" className={cn('flex flex-col gap-3', className)}>
            {plans.map((plan) => (
                <EmiPlanCard
                    key={plan.planId}
                    plan={plan}
                    isSelected={plan.planId === selectedPlanId}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
