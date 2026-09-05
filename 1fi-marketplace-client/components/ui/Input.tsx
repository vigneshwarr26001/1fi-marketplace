// region Imports

// Import Package
import { forwardRef, useId, type InputHTMLAttributes } from 'react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

// Renders a labeled text input with an optional error message
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, error, containerClassName, className, id, ...rest },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className={cn('flex flex-col gap-1.5', containerClassName)}>
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            ) : null}
            <input
                ref={ref}
                id={inputId}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={cn(
                    'h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                    'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
                    error && 'border-red-400 focus:ring-red-500 focus:border-red-500',
                    className,
                )}
                {...rest}
            />
            {error ? (
                <p id={errorId} className="text-xs font-medium text-red-600">
                    {error}
                </p>
            ) : null}
        </div>
    );
});
