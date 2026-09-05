// region Imports

// Import Package
import type { HTMLAttributes, ReactNode } from 'react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export type PageContainerSize = 'sm' | 'md' | 'lg';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
    size?: PageContainerSize;
    children: ReactNode;
}

const SIZE_CLASSES: Record<PageContainerSize, string> = {
    sm: 'sm:max-w-2xl',
    md: 'sm:max-w-4xl',
    lg: 'sm:max-w-6xl',
};

// Renders a centered, width-constrained page wrapper with standard padding
export function PageContainer({
    size = 'md',
    className,
    children,
    ...rest
}: PageContainerProps): ReactNode {
    return (
        <div
            className={cn(
                'mx-auto w-full px-4 py-4 sm:px-6 sm:py-6',
                SIZE_CLASSES[size],
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
}
