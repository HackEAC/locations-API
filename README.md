# Location Data API

Compatibility-first REST API for Tanzania location data backed by PostgreSQL and Prisma ORM 7.

## What Changed

- Prisma ORM 7 with a generated client in `src/generated/prisma`
- Dual API base paths: `/v1` is canonical and `/api` remains as a compatibility alias
- Reproducible Prisma migration + seed flow for local development and CI
- Request IDs, structured HTTP logs, cache headers, and safer full-text search
- Dependabot and GitHub Actions for ongoing dependency updates and verification

## Requirements

- Node.js `>=20.19.0`
- pnpm `10.7.0+`
- PostgreSQL `16+` recommended

## Quick Start

1. Install dependencies.

   ```bash
   pnpm install
   ```

2. Create your environment file.

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and update `DATABASE_URL` if needed.

4. Apply the checked-in schema and seed deterministic fixture data.

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. Start the development server.

   ```bash
   pnpm dev
   ```

## Useful Scripts

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm openapi:json
```

## API Base Paths

- `/v1`: canonical path for current integrations
- `/api`: compatibility alias for older consumers

Both base paths return the same payload shapes.

## Main Endpoints

### Collections

- `GET /v1/countries`
- `GET /v1/regions`
- `GET /v1/districts`
- `GET /v1/wards`
- `GET /v1/places`

### Detail Routes

- `GET /v1/countries/:id`
- `GET /v1/regions/:regionCode`
- `GET /v1/districts/:districtCode`
- `GET /v1/wards/:wardCode`
- `GET /v1/places/:id`

### Nested Routes

- `GET /v1/countries/:countryCode/regions`
- `GET /v1/regions/:regionCode/districts`
- `GET /v1/districts/:districtCode/wards`
- `GET /v1/wards/:wardCode/places`

### Search

- `GET /v1/search?q=nzuguni`

## Collection Query Parameters

All collection endpoints support:

- `page`
- `limit`
- `search`

Additional filters:

- `/regions`: `countryId`
- `/districts`: `countryId`, `regionCode`
- `/wards`: `countryId`, `regionCode`, `districtCode`
- `/places`: `countryId`, `regionCode`, `districtCode`, `wardCode`

## Docs

- Swagger UI: `http://localhost:8080/api-docs`
- OpenAPI JSON: `http://localhost:8080/openapi.json`

## Database Notes

- Prisma configuration lives in [prisma.config.ts](./prisma.config.ts)
- The baseline migration now creates the `general.search_vector` column and GIN index used by `/search`
- Seed data is intentionally small and deterministic so CI and tests can assert exact results

## Dependency Automation

- `.github/dependabot.yml` opens weekly update PRs for npm packages and GitHub Actions
- `.github/workflows/ci.yml` validates every PR against Postgres on Node `20.19.0` and `22`

## License

This project is licensed under the CopyLeft License. See [LICENSE](./LICENSE).
