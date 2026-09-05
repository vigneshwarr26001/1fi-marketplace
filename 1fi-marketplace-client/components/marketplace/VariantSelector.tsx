// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Types
import type { IVariantGroup } from '@/types/product.types';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface VariantSelectorProps {
    group: IVariantGroup;
    selectedValue: string | null;
    onSelect: (groupKey: string, optionValue: string) => void;
    className?: string;
}

// Renders one variant group (e.g. color/size) as a row of selectable option buttons,
// showing any price modifier, and reports the chosen option via onSelect
export function VariantSelector({
    group,
    selectedValue,
    onSelect,
    className,
}: VariantSelectorProps): ReactNode {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <p className="text-sm font-semibold text-slate-900">{group.name}</p>
            <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                    const isSelected = option.value === selectedValue;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onSelect(group.key, option.value)}
                            aria-pressed={isSelected}
                            className={cn(
                                'rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors duration-150',
                                isSelected
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-600',
                            )}
                        >
                            {option.label}
                            {option.priceModifier !== 0 ? (
                                <span
                                    className={cn(
                                        'ml-1.5 text-xs font-normal',
                                        isSelected ? 'text-indigo-500' : 'text-slate-400',
                                    )}
                                >
                                    {option.priceModifier > 0 ? '+' : ''}
                                    {option.priceModifier}
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
