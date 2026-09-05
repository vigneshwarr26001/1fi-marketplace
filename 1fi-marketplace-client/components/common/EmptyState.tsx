// region Imports

// Import Package
import type { HTMLAttributes, ReactNode } from 'react';

// Import Icons
import type { LucideIcon } from 'lucide-react';

// Import Utils
import { cn } from '@/utils/cn';

// Import Components
import { Button } from '@/components/ui/Button';

// endregion

export interface EmptyStateAction {
    label: string;
    onClick: () => void;
}

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: EmptyStateAction;
}

// Renders a placeholder panel with an icon, message, and optional action for empty lists
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    ...rest
}: EmptyStateProps): ReactNode {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center',
                className,
            )}
            {...rest}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Icon className="h-6 w-6 text-slate-400" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                {description ? <p className="text-sm text-slate-500">{description}</p> : null}
            </div>
            {action ? (
                <Button variant="outline" size="sm" onClick={action.onClick} className="mt-1">
                    {action.label}
                </Button>
            ) : null}
        </div>
    );
}
