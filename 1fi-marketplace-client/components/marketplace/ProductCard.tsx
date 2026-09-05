// region Imports

// Import Package
import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';

// Import Types
import type { IProduct } from '@/types/product.types';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// Import Utils
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

// Import Components
import { Badge } from '@/components/ui/Badge';

// endregion

export interface ProductCardProps {
    product: IProduct;
    className?: string;
}

// Returns the lowest monthly EMI amount across a product's EMI plans, or null if
// the product has no EMI plans
function getCheapestMonthlyEmi(product: IProduct): number | null {
    if (product.emiPlans.length === 0) {
        return null;
    }

    return product.emiPlans.reduce(
        (cheapest, plan) => Math.min(cheapest, plan.monthlyAmount),
        product.emiPlans[0].monthlyAmount,
    );
}

// Renders a product tile linking to its detail page, showing image, discount badge,
// brand, name, price, and the cheapest available monthly EMI
export function ProductCard({ product, className }: ProductCardProps): ReactNode {
    const cheapestMonthlyEmi = getCheapestMonthlyEmi(product);
    const primaryImage = product.images[0];
    const hasDiscount = product.discountPercentage > 0;

    return (
        <Link
            href={ROUTES.productDetail(product.slug)}
            className={cn(
                'group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md',
                className,
            )}
        >
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                {primaryImage ? (
                    <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                ) : null}
                {hasDiscount ? (
                    <Badge variant="success" className="absolute left-2 top-2">
                        {product.discountPercentage}% OFF
                    </Badge>
                ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
                    {product.brand}
                </p>
                <p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p>
                <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-base font-bold text-slate-900">
                        {formatCurrency(product.price)}
                    </span>
                    {hasDiscount ? (
                        <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(product.originalPrice)}
                        </span>
                    ) : null}
                </div>
                {cheapestMonthlyEmi !== null ? (
                    <p className="mt-0.5 text-xs font-medium text-indigo-600">
                        from {formatCurrency(cheapestMonthlyEmi)}/mo
                    </p>
                ) : null}
            </div>
        </Link>
    );
}
