// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Icons
import { MapPin } from 'lucide-react';

// Import Components
import { BackLink } from '@/components/layout/BackLink';
import { EmptyState } from '@/components/common/EmptyState';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// endregion

// Placeholder page shown until the Nearby Stores feature is available
export default function NearbyStoresPage(): ReactNode {
    return (
        <div className="flex flex-col gap-5">
            <BackLink href={ROUTES.SHOP} label="Back to Shop" />
            <EmptyState
                icon={MapPin}
                title="Coming soon"
                description="Nearby Stores is on its way. Check back shortly to find partner stores close to you."
            />
        </div>
    );
}
