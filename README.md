# 1Fi Marketplace

**1Fi SDE Intern Assignment — 1Fi Marketplace.** A financing-first shopping experience: shoppers
browse a product catalog, pick a variant, choose an EMI (installment) plan with pricing computed
live by the server, log in, and confirm checkout.

## Repository layout

This repo holds two independently runnable apps:

| App | Path | Stack |
| --- | --- | --- |
| API | [`1fi-marketplace-api`](./1fi-marketplace-api) | Express + TypeScript + Mongoose (MongoDB) |
| Client | [`1fi-marketplace-client`](./1fi-marketplace-client) | Next.js (App Router) + TypeScript |

Each app has its own `package.json`, `.env.example`, and README with app-specific detail. This
file covers the end-to-end setup and the flow that ties them together.

## Setup order

Run these in order — the client expects the API to already be up and seeded.

### 1. Start MongoDB

Have a MongoDB instance reachable locally (e.g. `mongodb://localhost:27017`) or a MongoDB Atlas
connection string ready.

### 2. Seed and run the API

```bash
cd 1fi-marketplace-api
npm install
cp .env.example .env
# edit .env if your MONGODB_URI differs from the default
npm run seed
npm run dev
```

The API starts on `http://localhost:3000`, with every route mounted under `/api/v1`. The seed
script creates 5 categories, 10 products (with variants, specs, and EMI plan templates), and one
demo user.

### 3. Run the client

In a second terminal:

```bash
cd 1fi-marketplace-client
npm install
cp .env.example .env.local
npm run dev
```

The client starts on `http://localhost:3001` (the `dev`/`start` scripts pin Next.js to port 3001)
and reads `NEXT_PUBLIC_API_BASE_URL` from `.env.local` (defaults to `http://localhost:3000/api/v1`,
matching the API above).

## Demo credentials

```
email:    demo@1fi.app
password: Demo@1234
```

The login page also shows these credentials inline for convenience.

## Architecture

- **API** — an Express + TypeScript REST API behind JWT bearer auth, with Mongoose models backed
  by MongoDB. Every endpoint returns one consistent envelope
  (`{ success, message, data }` / `{ success, message, errorCode, errors? }`), Zod validators
  guard every request body/query, and a Mongoose `toJSON` transform on each schema strips `_id`
  and `__v` in favor of a plain `id` string. EMI math (monthly amount, total payable, cashback)
  is computed entirely server-side from a per-product plan template — the client never
  recalculates it, only displays what the API returns.
- **Client** — a Next.js App Router app using TanStack Query for all server-state (product lists,
  product detail, EMI plans, checkout) and a centralized Axios instance
  (`services/axios.ts`) whose request interceptor attaches the bearer token and whose response
  interceptor normalizes API errors and handles global 401s (clearing the session and redirecting
  to `/login`).

## User flow

1. **Shop** (`/shop`) — landing hub with three options: Top Brands, Nearby Stores, and 1Fi
   Marketplace.
2. **1Fi Marketplace** (`/shop/marketplace`) — browse the catalog, search, and filter by category.
3. **Product detail** (`/shop/marketplace/[slug]`) — view images, description, and specifications.
4. **Pick a variant** — selecting an option (storage, color, size, …) live-updates the effective
   price and refetches EMI plans for that price.
5. **Pick an EMI plan** — choose a tenure (interest rate, no-cost EMI, cashback all shown as
   returned by the API).
6. **Proceed** — the selection is saved and the shopper is routed to checkout.
7. **Login if needed** (`/login`) — unauthenticated shoppers are redirected here first (with the
   credentials above) and returned to checkout on success.
8. **Checkout confirmation** (`/checkout`) — review the order summary and confirm; the API
   recomputes pricing server-side and returns a checkout in `INITIATED` status, shown with its ID,
   status, monthly EMI, and total payable.
