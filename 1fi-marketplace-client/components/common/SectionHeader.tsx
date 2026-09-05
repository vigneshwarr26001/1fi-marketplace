// region Imports

// Import Package
import type { HTMLAttributes, ReactNode } from 'react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

// Renders a section title with an optional subtitle and trailing action
export function SectionHeader({
    title,
    subtitle,
    action,
    className,
    ...rest
}: SectionHeaderProps): ReactNode {
    return (
        <div className={cn('flex items-start justify-between gap-3', className)} {...rest}>
            <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h2>
                {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
            </div>
            {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
        </div>
    );
}
