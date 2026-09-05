export interface IProductListQuery {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
}
