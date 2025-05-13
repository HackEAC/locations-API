# Location Data API

A RESTful API for Tanzania location data including countries, regions, districts, wards, and places.

## Features

- Hierarchical location data with proper relationships  
- RESTful API with clean structure  
- Input validation and error handling  
- Pagination and search support  

## Tech Stack

- Node.js / Express  
- PostgreSQL  
- Prisma ORM  
- Jest & Supertest for testing  

## Getting Started

### Prerequisites

- Node.js LTS  
- [Tanzania Locations Database](https://github.com/HackEAC/tanzania-locations-db) running 🏃🏿‍♂️🏃🏿‍♀️  
- npm or yarn  

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/locations-API.git
   cd locations-API
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create `.env` for your environment

   ```bash
   echo DATABASE_URL="postgresql://postgres:password@localhost:5433/locations" > .env
   ```

   The above `DATABASE_URL` is for the [Tanzania-locations-database](https://github.com/HackEAC/tanzania-locations-db) Docker container provision.

4. Sync up your API with the locations database:

   - **a.** Pull existing DB schema into your Prisma schema

     ```bash
     pnpx prisma db pull
     ```

   - **b.** Create migration init files

     ```bash
     mkdir prisma/migrations/init
     ```

   - **c.** Mark the current schema as baseline

     ```bash
     pnpx prisma migrate diff \
       --from-empty \
       --to-schema-datamodel prisma/schema.prisma \
       --script > prisma/migrations/init/migration.sql
     ```

   - **d.** Create migration history manually

     ```bash
     pnpx prisma migrate resolve --applied init
     ```

   ✅ Now you're synced! Future `prisma migrate dev` or `migrate deploy` will work cleanly.

5. Start development server

   ```bash
   npm run dev
   ```

6. Build application

   ```bash
   npm run build
   ```

7. Start production server

   ```bash
   npm run start
   ```

## API Endpoints

### Countries
- `GET /v1/countries` - Get all countries
- `GET /v1/countries/:id` - Get country by ID

### Regions
- `GET /v1/regions` - Get all regions
- `GET /v1/regions/:regionCode` - Get region by code
- `GET /v1/regions/:regionCode/districts` - Get districts in a region

### Districts
- `GET /v1/districts` - Get all districts
- `GET /v1/districts/:districtCode` - Get district by code
- `GET /v1/districts/:districtCode/wards` - Get wards in a district

### Wards
- `GET /v1/wards` - Get all wards
- `GET /v1/wards/:wardCode` - Get ward by code
- `GET /v1/wards/:wardCode/places` - Get places in a ward

### Places
- `GET /v1/places` - Get all places
- `GET /v1/places/:id` - Get place by ID

### Search
- `GET /v1/search?q=nzuguni` - Fulltext search for locations by name

## Running Tests

```bash
npm test
```

## License

This project is licensed under the CopyLeft License – see the LICENSE file for details.
