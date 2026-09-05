// region Imports

// Import Package
import type { ReactNode } from 'react';

// Import Icons
import { Landmark, MapPin, Store } from 'lucide-react';

// Import Components
import { Badge } from '@/components/ui/Badge';
import { ShopOptionCard } from '@/components/shop/ShopOptionCard';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// endregion

// Shop landing page listing the available shopping entry points (Top Brands, Nearby Stores, Marketplace)
export default function ShopPage(): ReactNode {
    return (
        <div className="flex flex-col gap-4">
            <ShopOptionCard
                href={ROUTES.TOP_BRANDS}
                icon={Landmark}
                title="Top Brands"
                subtitle="Explore trusted brands and their latest lineups"
            />
            <ShopOptionCard
                href={ROUTES.NEARBY_STORES}
                icon={MapPin}
                title="Nearby Stores"
                subtitle="Find partner stores close to you"
            />
            <div className="relative">
                <Badge variant="warning" className="absolute -top-2 right-4 z-10 shadow-sm">
                    Recommended
                </Badge>
                <ShopOptionCard
                    href={ROUTES.MARKETPLACE}
                    icon={Store}
                    title="1Fi Marketplace"
                    subtitle="Shop top products with flexible, EMI-friendly financing"
                    className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white p-5 shadow-md ring-1 ring-indigo-100 hover:border-indigo-400 hover:shadow-lg"
                />
            </div>
        </div>
    );
}
