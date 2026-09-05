'use client';

// region Imports

// Import Package
import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// endregion

interface QueryProviderProps {
    children: ReactNode;
}

// Wraps the app with a React Query client instance configured with sensible caching defaults
export function QueryProvider({ children }: QueryProviderProps): JSX.Element {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                        staleTime: 30_000,
                    },
                },
            }),
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
