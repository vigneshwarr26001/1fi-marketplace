// region Imports

// Import Package
import Link from 'next/link';
import type { ReactNode } from 'react';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface HeaderProps {
    title?: string;
    action?: ReactNode;
    className?: string;
}

// Renders the sticky top header bar with the app logo, an optional page title,
// and an optional action element on the right
export function Header({ title, action, className }: HeaderProps): ReactNode {
    return (
        <header
            className={cn(
                'sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6',
                className,
            )}
        >
            <div className="flex items-center gap-3 min-w-0">
                <Link
                    href={ROUTES.HOME}
                    className="shrink-0 text-lg font-extrabold tracking-tight text-indigo-600"
                >
                    1Fi
                </Link>
                {title ? (
                    <>
                        <span className="h-4 w-px shrink-0 bg-slate-200" aria-hidden="true" />
                        <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                            {title}
                        </h1>
                    </>
                ) : null}
            </div>
            {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
        </header>
    );
}
