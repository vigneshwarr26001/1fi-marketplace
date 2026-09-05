// region Imports

// Import Package
import type { HTMLAttributes, ReactNode } from 'react';

// Import Icons
import { Loader2 } from 'lucide-react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
    label?: string;
    size?: 'sm' | 'md' | 'lg';
}

const ICON_SIZE_CLASSES: Record<NonNullable<LoadingStateProps['size']>, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
};

// Renders a centered spinner with an optional label to indicate loading
export function LoadingState({
    label,
    size = 'md',
    className,
    ...rest
}: LoadingStateProps): ReactNode {
    return (
        <div
            role="status"
            className={cn(
                'flex flex-col items-center justify-center gap-2 py-8 text-slate-500',
                className,
            )}
            {...rest}
        >
            <Loader2
                className={cn('animate-spin text-indigo-600', ICON_SIZE_CLASSES[size])}
                aria-hidden="true"
            />
            {label ? <p className="text-sm font-medium">{label}</p> : null}
        </div>
    );
}
