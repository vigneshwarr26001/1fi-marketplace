// region Imports

// Import Package
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    rounded?: string;
}

// Renders a pulsing placeholder block used while content is loading
export function Skeleton({
    width,
    height,
    rounded = 'rounded-lg',
    className,
    style,
    ...rest
}: SkeletonProps): ReactNode {
    const mergedStyle: CSSProperties = {
        width,
        height,
        ...style,
    };

    return (
        <div
            className={cn('animate-pulse bg-slate-200', rounded, className)}
            style={mergedStyle}
            {...rest}
        />
    );
}
