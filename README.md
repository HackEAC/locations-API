# Location Data API

A RESTful API for geographical location data including countries, regions, districts, wards, and places.

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

- Node.js (v16+)  
- PostgreSQL  
- npm or yarn  

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/location-data-api.git
cd location-data-api
```

2. Install dependencies

```bash
npm install
```

3. Create .env for your environment 

```bash
cp .env.example .env.local
```

4. Configure your local PostgreSQL database in `.env` (or whereever you
   want to put it)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/location_db"
```

5. Run migrations to set up the database

```bash
npx prisma migrate dev --name init
```
6. Start dev server

```bash
npm run dev
```

## API Endpoints

### Countries
- `GET /api/countries` - Get all countries
- `GET /api/countries/:id` - Get country by ID

### Regions
- `GET /api/regions` - Get all regions
- `GET /api/regions/:regionCode` - Get region by code
- `GET /api/regions/:regionCode/districts` - Get districts in a region

### Districts
- `GET /api/districts` - Get all districts
- `GET /api/districts/:districtCode` - Get district by code
- `GET /api/districts/:districtCode/wards` - Get wards in a district

### Wards
- `GET /api/wards` - Get all wards
- `GET /api/wards/:wardCode` - Get ward by code
- `GET /api/wards/:wardCode/places` - Get places in a ward

### Places
- `GET /api/places` - Get all places
- `GET /api/places/:id` - Get place by ID

## Running Tests
```bash
npm test
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.
