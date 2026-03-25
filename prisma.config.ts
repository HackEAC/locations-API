import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url:
      process.env.DIRECT_DATABASE_URL ??
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/locations_api',
  },
});
