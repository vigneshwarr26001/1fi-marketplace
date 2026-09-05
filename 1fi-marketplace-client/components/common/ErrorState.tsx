// region Imports

// Import Package
import type { HTMLAttributes, ReactNode } from 'react';

// Import Icons
import { AlertTriangle, type LucideIcon } from 'lucide-react';

// Import Utils
import { cn } from '@/utils/cn';

// Import Components
import { Button } from '@/components/ui/Button';

// endregion

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon;
    title: string;
    description?: string;
    onRetry?: () => void;
}

// Renders a placeholder panel showing an error message with an optional retry action
export function ErrorState({
    icon: Icon = AlertTriangle,
    title,
    description,
    onRetry,
    className,
    ...rest
}: ErrorStateProps): ReactNode {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-6 py-12 text-center',
                className,
            )}
            {...rest}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Icon className="h-6 w-6 text-red-500" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                {description ? <p className="text-sm text-slate-500">{description}</p> : null}
            </div>
            {onRetry ? (
                <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
                    Try again
                </Button>
            ) : null}
        </div>
    );
}
