// region Imports

// Import Package
import { redirect } from 'next/navigation';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// endregion

// Redirects the root URL straight to the Shop landing page
export default function HomePage(): never {
    redirect(ROUTES.SHOP);
}
