// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Types
import type { IProduct } from '@/types/product.types';

// Import Utils
import { cn } from '@/utils/cn';

// Import Components
import { Skeleton } from '@/components/common/Skeleton';
import { ProductCard } from '@/components/marketplace/ProductCard';

// endregion

const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export interface ProductGridProps {
    products: IProduct[];
    isLoading?: boolean;
    skeletonCount?: number;
    className?: string;
}

// Renders a responsive grid of product cards, or a skeleton grid while products
// are still loading
export function ProductGrid({
    products,
    isLoading = false,
    skeletonCount = 8,
    className,
}: ProductGridProps): ReactNode {
    if (isLoading) {
        return <ProductGridSkeleton count={skeletonCount} className={className} />;
    }

    return (
        <div className={cn(GRID_CLASSES, className)}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export interface ProductGridSkeletonProps {
    count?: number;
    className?: string;
}

// Renders a grid of placeholder skeleton cards matching the product grid layout
export function ProductGridSkeleton({ count = 8, className }: ProductGridSkeletonProps): ReactNode {
    return (
        <div className={cn(GRID_CLASSES, className)}>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    <Skeleton className="aspect-square w-full" rounded="rounded-none" />
                    <div className="flex flex-col gap-2 p-3">
                        <Skeleton height={10} width="40%" />
                        <Skeleton height={14} width="90%" />
                        <Skeleton height={16} width="60%" />
                        <Skeleton height={10} width="50%" />
                    </div>
                </div>
            ))}
        </div>
    );
}
