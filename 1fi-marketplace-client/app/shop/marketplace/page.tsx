'use client';

// region Imports

// Import Package
import { useState, type ReactNode } from 'react';

// Import Icons
import { PackageSearch } from 'lucide-react';

// Import Components
import { Button } from '@/components/ui/Button';
import { BackLink } from '@/components/layout/BackLink';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';

// Import Hooks
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// endregion

const PAGE_LIMIT = 12;

// Marketplace listing page with search, category filtering, and paginated product results
export default function MarketplacePage(): ReactNode {
    const [search, setSearch] = useState<string>('');
    const [category, setCategory] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);

    // Fetches the list of available product categories for the filter bar
    const categoriesQuery = useCategories();
    // Fetches the current page of products matching the active search/category/page filters
    const productsQuery = useProducts({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        category: category ?? undefined,
    });

    // Updates the search term and resets pagination to the first page
    function handleSearchChange(value: string): void {
        setSearch(value);
        setPage(1);
    }

    // Updates the selected category filter and resets pagination to the first page
    function handleCategorySelect(slug: string | null): void {
        setCategory(slug);
        setPage(1);
    }

    const products = productsQuery.data?.items ?? [];
    const pagination = productsQuery.data?.pagination;

    return (
        <div className="flex flex-col gap-5">
            <BackLink href={ROUTES.SHOP} label="Back to Shop" />
            <SectionHeader
                title="1Fi Marketplace"
                subtitle="Shop top products with EMI-friendly, financing-first checkout"
            />

            <div className="flex flex-col gap-3">
                <SearchBar value={search} onChange={handleSearchChange} />
                <CategoryFilter
                    categories={categoriesQuery.data ?? []}
                    activeSlug={category}
                    onSelect={handleCategorySelect}
                />
            </div>

            {productsQuery.isLoading ? (
                <ProductGrid products={[]} isLoading skeletonCount={PAGE_LIMIT} />
            ) : productsQuery.isError ? (
                <ErrorState
                    title="Couldn't load products"
                    description={productsQuery.error.message}
                    onRetry={() => productsQuery.refetch()}
                />
            ) : products.length === 0 ? (
                <EmptyState
                    icon={PackageSearch}
                    title="No products found"
                    description="Try adjusting your search or category filter."
                />
            ) : (
                <>
                    <ProductGrid products={products} />
                    {pagination && pagination.totalPages > 1 ? (
                        <div className="flex items-center justify-between gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            >
                                Prev
                            </Button>
                            <p className="text-sm text-slate-500">
                                Page {pagination.page} of {pagination.totalPages}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= pagination.totalPages}
                                onClick={() =>
                                    setPage((prev) => Math.min(pagination.totalPages, prev + 1))
                                }
                            >
                                Next
                            </Button>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}
