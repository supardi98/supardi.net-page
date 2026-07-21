# Link in Bio (Vue 3 + Cloudflare Pages + D1)

A fast, mobile-responsive "link in bio" page designed for Instagram, built with Vue 3, Vite, and Tailwind CSS. It features a Cloudflare Pages backend (Functions) to track clicks using a D1 database.

## Prerequisites
- Node.js (v18+)
- Cloudflare account
- Wrangler CLI installed globally (`npm i -g wrangler`)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize local D1 database:
   ```bash
   npx wrangler d1 execute supardi-db --local --file=./schema.sql
   ```

3. Run locally:
   ```bash
   npm run dev
   ```
   > Note: To test the backend functions locally alongside the Vue frontend, use Wrangler:
   > ```bash
   > npx wrangler pages dev dist
   > ```
   > Make sure to build the frontend first (`npm run build`).

## Deployment

1. Create a D1 database on Cloudflare:
   ```bash
   npx wrangler d1 create supardi-db
   ```
2. Update the `database_id` in `wrangler.toml` with the ID from the previous step.
3. Apply the schema to the production database:
   ```bash
   npx wrangler d1 execute supardi-db --remote --file=./schema.sql
   ```
4. Deploy to Cloudflare Pages:
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```
