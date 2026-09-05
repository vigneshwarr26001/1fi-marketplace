'use client';

// region Imports

// Import Package
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

// Import Icons
import { CheckCircle2, Pencil } from 'lucide-react';

// Import Components
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageContainer } from '@/components/common/PageContainer';
import { PriceSummary } from '@/components/marketplace/PriceSummary';

// Import Hooks
import { useAuth } from '@/hooks/useAuth';
import { useProduct } from '@/hooks/useProduct';
import { useEmiPlans } from '@/hooks/useEmiPlans';
import { useCheckout } from '@/hooks/useCheckout';

// Import Utils
import { formatCurrency } from '@/utils/format';
import { getSelection, clearSelection, type IStoredSelection } from '@/utils/storage';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// endregion

// Checkout page: confirms the stored product/plan selection and submits the order
export default function CheckoutPage(): ReactNode {
    const router = useRouter();
    const auth = useAuth();
    // Mutation that submits the checkout order for the selected product and EMI plan
    const checkoutMutation = useCheckout();

    const [selection, setSelection] = useState<IStoredSelection | null | undefined>(undefined);

    // Loads the previously saved product/variant/plan selection from local storage
    useEffect(() => {
        setSelection(getSelection());
    }, []);

    // Redirects away if there is no saved selection, or to login if the user isn't authenticated
    useEffect(() => {
        if (selection === undefined) {
            return;
        }
        if (selection === null) {
            router.replace(ROUTES.MARKETPLACE);
            return;
        }
        if (!auth.isLoading && !auth.isAuthenticated) {
            router.replace(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`);
        }
    }, [selection, auth.isLoading, auth.isAuthenticated, router]);

    // Fetches the product referenced by the saved selection
    const productQuery = useProduct(selection?.productSlug);
    // Fetches EMI plans priced for the saved selection's variants
    const emiPlansQuery = useEmiPlans(productQuery.data?.id, selection?.selectedVariants ?? []);

    // Submits the checkout order for the selected product and EMI plan, then clears the saved selection
    function handleConfirm(): void {
        const product = productQuery.data;
        const plan = emiPlansQuery.data?.emiPlans.find(
            (candidate) => candidate.planId === selection?.selectedPlanId,
        );
        if (!product || !plan || !selection) {
            return;
        }
        checkoutMutation.mutate(
            {
                productId: product.id,
                selectedVariants: selection.selectedVariants,
                selectedEmiPlan: { planId: plan.planId, tenureMonths: plan.tenureMonths },
            },
            {
                onSuccess: () => {
                    clearSelection();
                },
            },
        );
    }

    if (selection === undefined || selection === null) {
        return (
            <>
                <Header title="Checkout" />
                <PageContainer size="sm">
                    <LoadingState label="Loading your selection…" />
                </PageContainer>
            </>
        );
    }

    if (auth.isLoading || !auth.isAuthenticated) {
        return (
            <>
                <Header title="Checkout" />
                <PageContainer size="sm">
                    <LoadingState label="Checking your session…" />
                </PageContainer>
            </>
        );
    }

    if (checkoutMutation.isSuccess && checkoutMutation.data) {
        const { checkout } = checkoutMutation.data;
        return (
            <>
                <Header title="Checkout" />
                <PageContainer
                    size="sm"
                    className="flex flex-col items-center gap-5 py-16 text-center"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-9 w-9 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-lg font-semibold text-slate-900">Checkout confirmed</h1>
                        <p className="text-sm text-slate-500">Checkout ID: {checkout.id}</p>
                    </div>
                    <div className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Status</span>
                            <Badge variant="success">{checkout.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Monthly EMI</span>
                            <span className="font-semibold text-slate-900">
                                {formatCurrency(checkout.monthlyEmi)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Total payable</span>
                            <span className="font-semibold text-slate-900">
                                {formatCurrency(checkout.totalPayable)}
                            </span>
                        </div>
                    </div>
                    <Button fullWidth onClick={() => router.push(ROUTES.MARKETPLACE)}>
                        Back to Marketplace
                    </Button>
                </PageContainer>
            </>
        );
    }

    if (checkoutMutation.isError) {
        return (
            <>
                <Header title="Checkout" />
                <PageContainer size="sm">
                    <ErrorState
                        title="Checkout failed"
                        description={checkoutMutation.error.message}
                        onRetry={handleConfirm}
                    />
                </PageContainer>
            </>
        );
    }

    if (productQuery.isLoading || emiPlansQuery.isLoading) {
        return (
            <>
                <Header title="Checkout" />
                <PageContainer size="sm">
                    <LoadingState label="Loading your order…" />
                </PageContainer>
            </>
        );
    }

    if (productQuery.isError || !productQuery.data) {
        return (
            <>
                <Header title="Checkout" />
                <PageContainer size="sm">
                    <ErrorState
                        title="Couldn't load product"
                        description={
                            productQuery.error?.message ?? 'This product is unavailable right now.'
                        }
                        onRetry={() => productQuery.refetch()}
                    />
                </PageContainer>
            </>
        );
    }

    if (emiPlansQuery.isError || !emiPlansQuery.data) {
        return (
            <>
                <Header title="Checkout" />
                <PageContainer size="sm">
                    <ErrorState
                        title="Couldn't load EMI plan"
                        description={
                            emiPlansQuery.error?.message ?? 'EMI details are unavailable right now.'
                        }
                        onRetry={() => emiPlansQuery.refetch()}
                    />
                </PageContainer>
            </>
        );
    }

    const product = productQuery.data;
    const plan = emiPlansQuery.data.emiPlans.find(
        (candidate) => candidate.planId === selection.selectedPlanId,
    );

    if (!plan) {
        return (
            <>
                <Header title="Checkout" />
                <PageContainer size="sm">
                    <ErrorState
                        title="Selected plan is no longer available"
                        description="Please go back to the product page and choose an EMI plan again."
                        onRetry={() => router.push(ROUTES.productDetail(product.slug))}
                    />
                </PageContainer>
            </>
        );
    }

    const variantTags = selection.selectedVariants
        .map((selected) => {
            const group = product.variants.find((candidate) => candidate.key === selected.groupKey);
            const option = group?.options.find(
                (candidate) => candidate.value === selected.optionValue,
            );
            return group && option ? `${group.name}: ${option.label}` : null;
        })
        .filter((tag): tag is string => tag !== null);

    return (
        <>
            <Header title="Checkout" />
            <PageContainer size="sm" className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            {product.brand}
                        </p>
                        <h1 className="text-lg font-semibold text-slate-900">{product.name}</h1>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(ROUTES.productDetail(product.slug))}
                    >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Change selection
                    </Button>
                </div>
                <PriceSummary
                    productName={product.name}
                    variantTags={variantTags}
                    monthlyEmi={plan.monthlyAmount}
                    tenureMonths={plan.tenureMonths}
                    totalPayable={plan.totalAmount}
                    ctaLabel="Confirm Selection"
                    onCtaClick={handleConfirm}
                    isLoading={checkoutMutation.isPending}
                    ctaDisabled={checkoutMutation.isPending}
                />
            </PageContainer>
        </>
    );
}
