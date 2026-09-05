// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Icons
import { Landmark } from 'lucide-react';

// Import Components
import { BackLink } from '@/components/layout/BackLink';
import { EmptyState } from '@/components/common/EmptyState';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// endregion

// Placeholder page shown until the Top Brands feature is available
export default function TopBrandsPage(): ReactNode {
    return (
        <div className="flex flex-col gap-5">
            <BackLink href={ROUTES.SHOP} label="Back to Shop" />
            <EmptyState
                icon={Landmark}
                title="Coming soon"
                description="Top Brands is on its way. Check back shortly for curated brand collections with EMI-friendly pricing."
            />
        </div>
    );
}
