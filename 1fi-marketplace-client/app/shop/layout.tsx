// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Components
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/common/PageContainer';

// endregion

interface ShopLayoutProps {
    children: ReactNode;
}

// Shared layout for all Shop routes: renders the header and wraps content in a page container
export default function ShopLayout({ children }: ShopLayoutProps): ReactNode {
    return (
        <>
            <Header title="Shop" />
            <PageContainer>{children}</PageContainer>
        </>
    );
}
