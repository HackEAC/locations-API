import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PAGE_SIZE: z.coerce.number().int().positive().max(100).default(10),
  PORT: z.coerce.number().int().positive().default(8080),
});

const env = envSchema.parse(process.env);

const config = {
  databaseUrl: env.DATABASE_URL,
  nodeEnv: env.NODE_ENV,
  pageSize: env.PAGE_SIZE,
  port: env.PORT,
};

export default config;
