// region Imports

// Import Package
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Import Providers
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';

// endregion

// App-wide metadata used by Next.js for the document head
export const metadata: Metadata = {
    title: '1Fi Marketplace',
    description: 'A financing-first shopping experience with EMI-friendly checkout by 1Fi.',
};

interface RootLayoutProps {
    children: ReactNode;
}

// Root layout that wraps every page with the query and auth providers
export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    <AuthProvider>{children}</AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
