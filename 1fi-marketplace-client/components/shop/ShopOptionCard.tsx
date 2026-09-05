// region Imports

// Import Package
import Link from 'next/link';
import type { ReactNode } from 'react';

// Import Icons
import { ChevronRight, type LucideIcon } from 'lucide-react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface ShopOptionCardProps {
    href: string;
    icon: LucideIcon;
    title: string;
    subtitle: string;
    className?: string;
}

// Renders a tappable shop-option row card linking to a destination, with an icon,
// title, subtitle, and trailing chevron
export function ShopOptionCard({
    href,
    icon: Icon,
    title,
    subtitle,
    className,
}: ShopOptionCardProps): ReactNode {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-150',
                'hover:border-indigo-200 hover:shadow-md active:scale-[0.99]',
                className,
            )}
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                <Icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                    {title}
                </p>
                <p className="truncate text-xs text-slate-500 sm:text-sm">{subtitle}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
        </Link>
    );
}
