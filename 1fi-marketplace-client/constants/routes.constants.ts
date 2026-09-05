export const ROUTES = {
    HOME: '/',
    SHOP: '/shop',
    TOP_BRANDS: '/shop/top-brands',
    NEARBY_STORES: '/shop/nearby-stores',
    MARKETPLACE: '/shop/marketplace',
    // Builds the client-side route path for a single product's detail page
    productDetail: (slug: string): string => `/shop/marketplace/${slug}`,
    LOGIN: '/login',
    CHECKOUT: '/checkout',
} as const;
