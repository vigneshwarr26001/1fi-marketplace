// region Imports

// Import Package
import { FilterQuery, Types } from 'mongoose';

// Import Models
import { ProductModel } from '@/models/product.model';
import { CategoryModel } from '@/models/category.model';

// Import Interfaces
import { ISelectedVariant } from '@/interfaces/checkout.interface';
import { IProductDocument, IEmiPlan } from '@/interfaces/product.interface';

// Import Types
import { IProductListQuery } from '@/types/product-query.types';

// Import Utils
import { ApiError } from '@/utils/api-error';

// Import Services
import { getEffectivePrice, recalculatePlans } from '@/services/emi.service';

// endregion

export interface IPagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface IProductListResult {
    items: IProductDocument[];
    pagination: IPagination;
}

export interface IProductEmiPlansResult {
    productId: string;
    productPrice: number;
    emiPlans: IEmiPlan[];
}

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
};

// Escapes regex special characters so a search string can be used safely in a RegExp
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Fetches a paginated, filtered, and sorted list of active products
export async function list(query: IProductListQuery): Promise<IProductListResult> {
    const filter: FilterQuery<IProductDocument> = { isActive: true };

    if (query.search) {
        const searchRegex = new RegExp(escapeRegExp(query.search), 'i');
        filter.$or = [
            { name: searchRegex },
            { brand: searchRegex },
            { shortDescription: searchRegex },
        ];
    }

    if (query.brand) {
        filter.brand = new RegExp(`^${escapeRegExp(query.brand)}$`, 'i');
    }

    if (query.category) {
        // Looks up the active category matching the requested slug filter
        const category = await CategoryModel.findOne({
            slug: query.category.toLowerCase(),
            isActive: true,
        });

        if (!category) {
            return {
                items: [],
                pagination: {
                    page: query.page,
                    limit: query.limit,
                    totalItems: 0,
                    totalPages: 0,
                },
            };
        }

        filter.category = category._id as Types.ObjectId;
    }

    const sort = (query.sort && SORT_MAP[query.sort]) ?? SORT_MAP.newest;
    const skip = (query.page - 1) * query.limit;

    // Fetches the current page of matching products and the total matching count in parallel
    const [items, totalItems] = await Promise.all([
        ProductModel.find(filter)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(query.limit),
        ProductModel.countDocuments(filter),
    ]);

    return {
        items,
        pagination: {
            page: query.page,
            limit: query.limit,
            totalItems,
            totalPages: Math.ceil(totalItems / query.limit) || 0,
        },
    };
}

// Fetches a single active product by its slug, with EMI plans recalculated against its price
export async function getBySlug(slug: string): Promise<IProductDocument> {
    // Looks up the active product by slug, populating its category
    const product = await ProductModel.findOne({
        slug: slug.toLowerCase(),
        isActive: true,
    }).populate('category', 'name slug');

    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    product.emiPlans = recalculatePlans(product.price, product.emiPlans);

    return product;
}

// Recomputes the available EMI plans for a product given the buyer's selected variants
export async function getEmiPlansForProduct(
    productId: string,
    selectedVariants: ISelectedVariant[],
): Promise<IProductEmiPlansResult> {
    if (!Types.ObjectId.isValid(productId)) {
        throw ApiError.notFound('Product not found');
    }

    // Looks up the active product for which EMI plans are being calculated
    const product = await ProductModel.findOne({ _id: productId, isActive: true });

    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    const productPrice = getEffectivePrice(product, selectedVariants);
    const emiPlans = recalculatePlans(productPrice, product.emiPlans);

    return {
        productId: (product._id as Types.ObjectId).toString(),
        productPrice,
        emiPlans,
    };
}
