// region Imports

// Import Types
import type { IEmiPlan } from '@/types/emi.types';
import type { IPagination } from '@/types/api.types';

// endregion

export interface IVariantOption {
    label: string;
    value: string;
    priceModifier: number;
}

export interface IVariantGroup {
    name: string;
    key: string;
    options: IVariantOption[];
}

export interface ISpecification {
    group: string;
    label: string;
    value: string;
}

export interface IProductImage {
    url: string;
    alt: string;
}

export interface ICategory {
    id: string;
    name: string;
    slug: string;
    image: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IProductCategoryRef {
    id: string;
    name: string;
    slug: string;
}

export interface IProduct {
    id: string;
    name: string;
    slug: string;
    brand: string;
    category: IProductCategoryRef;
    description: string;
    shortDescription: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    images: IProductImage[];
    variants: IVariantGroup[];
    specifications: ISpecification[];
    emiPlans: IEmiPlan[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type ProductSortOption = 'price_asc' | 'price_desc' | 'newest';

export interface IProductListQuery {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    sort?: ProductSortOption;
}

export interface IProductListData {
    items: IProduct[];
    pagination: IPagination;
}

export interface ICategoryListData {
    items: ICategory[];
}
