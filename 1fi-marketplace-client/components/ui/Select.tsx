// region Imports

// Import Package
import { forwardRef, useId, type SelectHTMLAttributes } from 'react';

// Import Icons
import { ChevronDown } from 'lucide-react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    containerClassName?: string;
}

// Renders a labeled dropdown select built from a list of options
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { label, options, placeholder, containerClassName, className, id, ...rest },
    ref,
) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
        <div className={cn('flex flex-col gap-1.5', containerClassName)}>
            {label ? (
                <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            ) : null}
            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        'h-10 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-3 pr-9 text-sm text-slate-900 transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                        'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
                        className,
                    )}
                    {...rest}
                >
                    {placeholder ? (
                        <option value="" disabled hidden>
                            {placeholder}
                        </option>
                    ) : null}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
});
