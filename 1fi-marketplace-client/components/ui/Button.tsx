// region Imports

// Import Package
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    children?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:
        'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300',
    secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400',
    outline:
        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:text-slate-300 disabled:bg-white',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
};

const SPINNER_SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};

// Renders a small spinning loader icon sized to match the button
function Spinner({ size }: { size: ButtonSize }): ReactNode {
    return (
        <svg
            className={cn('animate-spin', SPINNER_SIZE_CLASSES[size])}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
            />
        </svg>
    );
}

// Renders a styled button with variant/size options and an optional loading state
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        variant = 'primary',
        size = 'md',
        isLoading = false,
        fullWidth = false,
        disabled,
        className,
        children,
        ...rest
    },
    ref,
) {
    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed',
                VARIANT_CLASSES[variant],
                SIZE_CLASSES[size],
                fullWidth && 'w-full',
                className,
            )}
            {...rest}
        >
            {isLoading ? <Spinner size={size} /> : null}
            {children}
        </button>
    );
});
