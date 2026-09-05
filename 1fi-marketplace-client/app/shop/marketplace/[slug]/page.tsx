'use client';

// region Imports

// Import Package
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

// Import Icons
import { PackageX } from 'lucide-react';

// Import Components
import { Badge } from '@/components/ui/Badge';
import { BackLink } from '@/components/layout/BackLink';
import { Skeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmiPlanList } from '@/components/marketplace/EmiPlanList';
import { ProductSpecs } from '@/components/marketplace/ProductSpecs';
import { PriceSummary } from '@/components/marketplace/PriceSummary';
import { VariantSelector } from '@/components/marketplace/VariantSelector';
import { ProductImageGallery } from '@/components/marketplace/ProductImageGallery';

// Import Hooks
import { useAuth } from '@/hooks/useAuth';
import { useProduct } from '@/hooks/useProduct';
import { useEmiPlans } from '@/hooks/useEmiPlans';

// Import Utils
import { saveSelection } from '@/utils/storage';
import { formatCurrency } from '@/utils/format';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// Import Types
import type { ISelectedVariant } from '@/types/emi.types';

// endregion

interface ProductDetailPageProps {
    params: { slug: string };
}

// Skeleton placeholder shown while the product detail data is loading
function ProductDetailSkeleton(): ReactNode {
    return (
        <div className="flex flex-col gap-6 pb-32">
            <Skeleton height={16} width={90} />
            <Skeleton className="aspect-square w-full" />
            <div className="flex flex-col gap-2">
                <Skeleton height={11} width="30%" />
                <Skeleton height={22} width="70%" />
                <Skeleton height={14} width="95%" />
                <Skeleton height={14} width="80%" />
            </div>
            <Skeleton height={32} width="40%" />
            <div className="flex flex-col gap-2">
                <Skeleton height={16} width="25%" />
                <div className="flex gap-2">
                    <Skeleton height={38} width={80} />
                    <Skeleton height={38} width={80} />
                    <Skeleton height={38} width={80} />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <Skeleton height={16} width="35%" />
                <Skeleton height={92} />
                <Skeleton height={92} />
            </div>
        </div>
    );
}

// Product detail page: shows a product, lets the user pick variants/EMI plan, and proceeds to checkout
export default function ProductDetailPage({ params }: ProductDetailPageProps): ReactNode {
    const { slug } = params;
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    // Fetches the product details for the current slug
    const productQuery = useProduct(slug);
    const product = productQuery.data;

    const [selectedVariants, setSelectedVariants] = useState<ISelectedVariant[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const initializedProductIdRef = useRef<string | null>(null);

    // Initializes the default variant selection once the product data loads
    useEffect(() => {
        if (product && initializedProductIdRef.current !== product.id) {
            setSelectedVariants(
                product.variants
                    .filter((group) => group.options.length > 0)
                    .map((group) => ({
                        groupKey: group.key,
                        optionValue: group.options[0].value,
                    })),
            );
            setSelectedPlanId(null);
            initializedProductIdRef.current = product.id;
        }
    }, [product]);

    // Fetches EMI plans priced for the currently selected product variants
    const emiPlansQuery = useEmiPlans(product?.id, selectedVariants);

    // Selects the recommended EMI plan (or the first one) whenever the plan list changes
    useEffect(() => {
        const plans = emiPlansQuery.data?.emiPlans;
        if (plans && plans.length > 0 && !plans.some((plan) => plan.planId === selectedPlanId)) {
            const recommendedPlan = plans.find((plan) => plan.recommended);
            setSelectedPlanId(recommendedPlan?.planId ?? plans[0].planId);
        }
    }, [emiPlansQuery.data, selectedPlanId]);

    if (productQuery.isLoading) {
        return <ProductDetailSkeleton />;
    }

    if (productQuery.isError || !product) {
        return (
            <ErrorState
                icon={PackageX}
                title="Product not found"
                description={
                    productQuery.error?.message ?? 'This product is unavailable right now.'
                }
                onRetry={() => productQuery.refetch()}
            />
        );
    }

    // Updates the selected option for a given variant group
    function handleVariantSelect(groupKey: string, optionValue: string): void {
        setSelectedVariants((prev) =>
            prev.map((variant) =>
                variant.groupKey === groupKey ? { ...variant, optionValue } : variant,
            ),
        );
    }

    const selectedPlan =
        emiPlansQuery.data?.emiPlans.find((plan) => plan.planId === selectedPlanId) ?? null;

    const displayPrice = emiPlansQuery.data?.productPrice ?? product.price;
    const hasDiscount = product.discountPercentage > 0;

    const variantTags = selectedVariants
        .map((selected) => {
            const group = product.variants.find((candidate) => candidate.key === selected.groupKey);
            const option = group?.options.find(
                (candidate) => candidate.value === selected.optionValue,
            );
            return group && option ? `${group.name}: ${option.label}` : null;
        })
        .filter((tag): tag is string => tag !== null);

    // Persists the selected variants/plan and routes to checkout, prompting login first if needed
    function handleProceed(): void {
        if (!product || !selectedPlan) {
            return;
        }
        saveSelection({
            productSlug: product.slug,
            selectedVariants,
            selectedPlanId: selectedPlan.planId,
        });
        if (isAuthenticated) {
            router.push(ROUTES.CHECKOUT);
        } else {
            router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`);
        }
    }

    return (
        <div className="flex flex-col gap-6 pb-32">
            <BackLink href={ROUTES.MARKETPLACE} label="Back to Marketplace" />

            <ProductImageGallery images={product.images} />

            <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {product.brand}
                </p>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{product.name}</h1>
                <p className="text-sm text-slate-600">{product.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(displayPrice)}
                </span>
                {hasDiscount ? (
                    <span className="text-sm text-slate-400 line-through">
                        {formatCurrency(product.originalPrice)}
                    </span>
                ) : null}
                {hasDiscount ? (
                    <Badge variant="success">{product.discountPercentage}% OFF</Badge>
                ) : null}
            </div>

            {product.variants.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {product.variants.map((group) => (
                        <VariantSelector
                            key={group.key}
                            group={group}
                            selectedValue={
                                selectedVariants.find((variant) => variant.groupKey === group.key)
                                    ?.optionValue ?? null
                            }
                            onSelect={handleVariantSelect}
                        />
                    ))}
                </div>
            ) : null}

            <div className="flex flex-col gap-3">
                <SectionHeader
                    title="Choose your EMI plan"
                    subtitle="Live pricing recalculated for your selection"
                />
                {emiPlansQuery.isError ? (
                    <ErrorState
                        title="Couldn't load EMI plans"
                        description={emiPlansQuery.error.message}
                        onRetry={() => emiPlansQuery.refetch()}
                    />
                ) : (
                    <EmiPlanList
                        plans={emiPlansQuery.data?.emiPlans ?? []}
                        selectedPlanId={selectedPlanId}
                        onSelect={setSelectedPlanId}
                        isLoading={emiPlansQuery.isLoading}
                    />
                )}
            </div>

            {product.specifications.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <SectionHeader title="Specifications" />
                    <ProductSpecs specifications={product.specifications} />
                </div>
            ) : null}

            <PriceSummary
                productName={product.name}
                variantTags={variantTags}
                monthlyEmi={selectedPlan?.monthlyAmount ?? 0}
                tenureMonths={selectedPlan?.tenureMonths ?? 0}
                totalPayable={selectedPlan?.totalAmount ?? 0}
                ctaLabel="Proceed"
                onCtaClick={handleProceed}
                isLoading={emiPlansQuery.isFetching}
                ctaDisabled={!selectedPlan || emiPlansQuery.isFetching}
            />
        </div>
    );
}
