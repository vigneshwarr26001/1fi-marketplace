// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Utils
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

// Import Components
import { Button } from '@/components/ui/Button';

// endregion

export interface PriceSummaryProps {
    productName: string;
    variantTags?: string[];
    monthlyEmi: number;
    tenureMonths: number;
    totalPayable: number;
    ctaLabel: string;
    onCtaClick: () => void;
    isLoading?: boolean;
    ctaDisabled?: boolean;
    className?: string;
}

// Renders the sticky bottom price/EMI summary bar with product name, variant tags,
// monthly EMI, total payable, and a primary call-to-action button
export function PriceSummary({
    productName,
    variantTags = [],
    monthlyEmi,
    tenureMonths,
    totalPayable,
    ctaLabel,
    onCtaClick,
    isLoading = false,
    ctaDisabled = false,
    className,
}: PriceSummaryProps): ReactNode {
    return (
        <div
            className={cn(
                'sticky bottom-0 flex flex-col gap-3 rounded-t-2xl border border-slate-200 bg-white p-4 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] sm:rounded-2xl sm:shadow-sm',
                className,
            )}
        >
            <div className="flex flex-col gap-1">
                <p className="truncate text-sm font-semibold text-slate-900">{productName}</p>
                {variantTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {variantTags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex flex-col gap-0.5">
                    <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(monthlyEmi)}
                        <span className="text-xs font-medium text-slate-500">/mo</span>
                    </p>
                    <p className="text-xs text-slate-500">
                        for {tenureMonths} months &middot; total {formatCurrency(totalPayable)}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={onCtaClick}
                    isLoading={isLoading}
                    disabled={ctaDisabled}
                    size="lg"
                    className="shrink-0"
                >
                    {ctaLabel}
                </Button>
            </div>
        </div>
    );
}
