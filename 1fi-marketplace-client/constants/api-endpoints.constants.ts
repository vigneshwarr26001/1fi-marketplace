export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },
    CATEGORIES: {
        LIST: '/categories',
    },
    PRODUCTS: {
        LIST: '/products',
        // Builds the endpoint path for fetching a single product by its slug
        DETAIL: (slug: string): string => `/products/${slug}`,
        // Builds the endpoint path for fetching a product's available EMI plans
        EMI_PLANS: (productId: string): string => `/products/${productId}/emi-plans`,
    },
    EMI: {
        CALCULATE: '/emi/calculate',
    },
    CHECKOUT: {
        CREATE: '/checkout',
    },
} as const;
