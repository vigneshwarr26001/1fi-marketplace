// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Types
import type { ICategory } from '@/types/product.types';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface CategoryFilterProps {
    categories: ICategory[];
    activeSlug: string | null;
    onSelect: (slug: string | null) => void;
    allLabel?: string;
    className?: string;
}

// Renders a horizontally scrollable row of category filter pills, including an
// "All" pill, and reports the selected category slug via onSelect
export function CategoryFilter({
    categories,
    activeSlug,
    onSelect,
    allLabel = 'All',
    className,
}: CategoryFilterProps): ReactNode {
    return (
        <div
            className={cn(
                'flex w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                className,
            )}
        >
            <CategoryPill
                label={allLabel}
                isActive={activeSlug === null}
                onClick={() => onSelect(null)}
            />
            {categories.map((category) => (
                <CategoryPill
                    key={category.id}
                    label={category.name}
                    isActive={activeSlug === category.slug}
                    onClick={() => onSelect(category.slug)}
                />
            ))}
        </div>
    );
}

interface CategoryPillProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

// Renders a single selectable filter pill button used inside CategoryFilter
function CategoryPill({ label, isActive, onClick }: CategoryPillProps): ReactNode {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={isActive}
            className={cn(
                'shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150',
                isActive
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600',
            )}
        >
            {label}
        </button>
    );
}
