'use client';

// region Imports

// Import Package
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Import Icons
import { ChevronLeft } from 'lucide-react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface BackLinkProps {
    label?: string;
    href?: string;
    className?: string;
}

// Renders a back-navigation link: a plain <Link> when an href is given, otherwise a
// button that navigates back using the router history
export function BackLink({ label = 'Back', href, className }: BackLinkProps): ReactNode {
    const router = useRouter();

    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    'inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-indigo-600',
                    className,
                )}
            >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                {label}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={() => router.back()}
            className={cn(
                'inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-indigo-600',
                className,
            )}
        >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {label}
        </button>
    );
}
