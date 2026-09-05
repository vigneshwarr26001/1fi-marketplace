# 1Fi Marketplace API

A financing-first shopping API for the 1Fi Marketplace. It serves product catalog data, EMI plan
calculations, and a lightweight authenticated checkout flow backed by MongoDB.

## Prerequisites

- Node.js 18+
- A MongoDB instance (local install or a MongoDB Atlas connection string)

## Setup

Run the following commands in order from the repository root:

```bash
cd 1fi-marketplace-api
npm install
cp .env.example .env
```

Open `.env` and set `MONGODB_URI` to point at your MongoDB instance, for example:

```
MONGODB_URI=mongodb://localhost:27017/onefi-marketplace
```

Seed the database with demo categories, products, and a demo user:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

The API is available at `http://localhost:3000` (or the `PORT` set in `.env`), with routes
mounted under `/api/v1`.

## Demo login credentials

```
email:    demo@1fi.app
password: Demo@1234
```

Use these against `POST /api/v1/auth/login` to obtain a bearer token for authenticated routes.

## API Endpoints

All routes are mounted at the base path `/api/v1`.

| Method | Path                                    | Auth                  | Description                                                                                         |
| ------ | --------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/auth/login`                    | Public (rate-limited) | Body: `{ email, password }` → `{ accessToken, user }`                                               |
| GET    | `/api/v1/auth/me`                       | Bearer required       | Returns the authenticated user                                                                      |
| POST   | `/api/v1/auth/logout`                   | Bearer required       | Stateless logout confirmation (no token blacklist)                                                  |
| GET    | `/api/v1/categories`                    | Public                | Lists all categories                                                                                |
| GET    | `/api/v1/products`                      | Public                | Query: `page, limit, search, category, brand, sort` → paginated product list                        |
| GET    | `/api/v1/products/:slug`                | Public                | Returns a single product by slug (404 if missing/inactive)                                          |
| GET    | `/api/v1/products/:productId/emi-plans` | Public                | Query: `variants` (e.g. `storage:256gb,color:black`) → EMI plans for the effective price            |
| POST   | `/api/v1/emi/calculate`                 | Public                | Body: `{ productId, selectedVariants, tenureMonths }` → computed EMI breakdown                      |
| POST   | `/api/v1/checkout`                      | Bearer required       | Body: `{ productId, selectedVariants, selectedEmiPlan }` → creates a checkout in `INITIATED` status |

Bearer-required routes expect an `Authorization: Bearer <accessToken>` header, using the token
returned from the login endpoint.

## Production build

```bash
npm run build
npm start
```

`npm run build` compiles TypeScript into `dist/`, and `npm start` runs the compiled
`dist/server.js`. Ensure `.env` (or equivalent environment variables) is present in the
deployment environment before starting.
