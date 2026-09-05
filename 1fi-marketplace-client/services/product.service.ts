// region Imports

// Import Services
import { apiClient } from '@/services/axios';

// Import Constants
import { API_ENDPOINTS } from '@/constants/api-endpoints.constants';

// Import Utils
import { serializeSelectedVariants } from '@/utils/variant';

// Import Types
import type { ApiResponse } from '@/types/api.types';
import type { IProductEmiPlansData, ISelectedVariant } from '@/types/emi.types';
import type { IProduct, IProductListData, IProductListQuery } from '@/types/product.types';

// endregion

// Fetches a paginated, filterable list of products from the API
export async function getProducts(
    params?: IProductListQuery,
): Promise<ApiResponse<IProductListData>> {
    const response = await apiClient.get<ApiResponse<IProductListData>>(
        API_ENDPOINTS.PRODUCTS.LIST,
        { params },
    );
    return response.data;
}

// Fetches a single product's full details by its slug from the API
export async function getProductBySlug(slug: string): Promise<ApiResponse<IProduct>> {
    const response = await apiClient.get<ApiResponse<IProduct>>(
        API_ENDPOINTS.PRODUCTS.DETAIL(slug),
    );
    return response.data;
}

// Fetches the available EMI plans for a product given its selected variants from the API
export async function getEmiPlans(
    productId: string,
    selectedVariants: ISelectedVariant[],
): Promise<ApiResponse<IProductEmiPlansData>> {
    const variants = serializeSelectedVariants(selectedVariants);
    const response = await apiClient.get<ApiResponse<IProductEmiPlansData>>(
        API_ENDPOINTS.PRODUCTS.EMI_PLANS(productId),
        { params: variants ? { variants } : undefined },
    );
    return response.data;
}
