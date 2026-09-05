// region Imports

// Import Package
import type { HTMLAttributes, ReactNode } from 'react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    children: ReactNode;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-indigo-100 text-indigo-700',
};

// Renders a small pill-shaped label used to tag status/category info
export function Badge({
    variant = 'neutral',
    className,
    children,
    ...rest
}: BadgeProps): ReactNode {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                VARIANT_CLASSES[variant],
                className,
            )}
            {...rest}
        >
            {children}
        </span>
    );
}
