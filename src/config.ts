import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

function isAccelerateUrl(url: string) {
  return url.startsWith('prisma://') || url.startsWith('prisma+postgres://');
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_DATABASE_URL: z.string().min(1, 'DIRECT_DATABASE_URL cannot be empty').optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PAGE_SIZE: z.coerce.number().int().positive().max(100).default(10),
  PORT: z.coerce.number().int().positive().default(8080),
});

const env = envSchema.parse(process.env);
const usesAccelerate = isAccelerateUrl(env.DATABASE_URL);
const directDatabaseUrl = env.DIRECT_DATABASE_URL ?? (usesAccelerate ? undefined : env.DATABASE_URL);

if (env.NODE_ENV !== 'production' && !directDatabaseUrl) {
  throw new Error('Non-production requires a direct PostgreSQL URL via DIRECT_DATABASE_URL or DATABASE_URL.');
}

const config = {
  databaseUrl: env.DATABASE_URL,
  directDatabaseUrl,
  nodeEnv: env.NODE_ENV,
  pageSize: env.PAGE_SIZE,
  port: env.PORT,
  usesAccelerate,
};

export default config;
