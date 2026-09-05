# 1Fi Marketplace Client

A financing-first shopping experience for 1Fi. Shoppers browse a product catalog, pick a variant, choose an EMI (installment) plan, log in, and confirm checkout — all against the `1fi-marketplace-api` backend.

This is the Next.js (App Router) frontend. It renders the Shop hub, the 1Fi Marketplace catalog, product detail pages with live EMI pricing, authentication, and a checkout confirmation flow.

## Prerequisites

- Node.js 18 or later
- The `1fi-marketplace-api` backend running locally on port 3000

## Setup

```bash
cd 1fi-marketplace-client
npm install
cp .env.example .env.local
npm run dev
```

The app runs at [http://localhost:3001](http://localhost:3001) (the `dev`/`start` scripts pin Next.js to port 3001 so it doesn't collide with the API's port 3000).

`.env.local` sets `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:3000/api/v1`), which the frontend uses for every API call. Make sure the backend is running on that port before using any data-driven page.

## Demo login

- **Email:** `demo@1fi.app`
- **Password:** `Demo@1234`

## User flow

1. **Shop** (`/shop`) — landing hub with three options: Top Brands, Nearby Stores, and 1Fi Marketplace.
2. **1Fi Marketplace** (`/shop/marketplace`) — browse the product catalog, search, and filter by category.
3. **Product page** (`/shop/marketplace/[slug]`) — view details, images, and specifications for a product.
4. **Variant** — pick options (e.g. color, storage) from the variant selector; price and EMI plans update live.
5. **EMI plan** — choose a monthly installment plan from the EMI plan list (interest rate, tenure, no-cost EMI, cashback).
6. **Proceed** — tapping Proceed saves the selection and moves to checkout.
7. **Login if needed** (`/login`) — unauthenticated users are redirected to log in (with the credentials above) before checkout; on success they're returned to checkout.
8. **Checkout confirmation** (`/checkout`) — review the order summary and confirm; a success screen shows the checkout ID, status, monthly EMI, and total payable.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Tech stack

Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, TanStack React Query, React Hook Form + Zod, Axios.
