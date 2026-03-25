import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

function isAccelerateUrl(url: string) {
  return url.startsWith('prisma://') || url.startsWith('prisma+postgres://');
}

function parseTrustProxy(value?: string) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (trimmed.includes(',')) {
    return trimmed
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return trimmed;
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_DATABASE_URL: z.string().min(1, 'DIRECT_DATABASE_URL cannot be empty').optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PAGE_SIZE: z.coerce.number().int().positive().max(100).default(10),
  PORT: z.coerce.number().int().positive().default(8080),
  REQUEST_BODY_LIMIT: z.string().trim().min(1).default('16kb'),
  TRUST_PROXY: z.string().trim().min(1).optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),
  RATE_LIMIT_BURST_WINDOW_MS: z.coerce.number().int().positive().default(10_000),
  RATE_LIMIT_BURST_MAX_REQUESTS: z.coerce.number().int().positive().default(30),
  SEARCH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  SEARCH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(30),
  SEARCH_RATE_LIMIT_BURST_WINDOW_MS: z.coerce.number().int().positive().default(10_000),
  SEARCH_RATE_LIMIT_BURST_MAX_REQUESTS: z.coerce.number().int().positive().default(10),
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
  requestBodyLimit: env.REQUEST_BODY_LIMIT,
  trustProxy: parseTrustProxy(env.TRUST_PROXY),
  rateLimit: {
    burstMaxRequests: env.RATE_LIMIT_BURST_MAX_REQUESTS,
    burstWindowMs: env.RATE_LIMIT_BURST_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  },
  searchRateLimit: {
    burstMaxRequests: env.SEARCH_RATE_LIMIT_BURST_MAX_REQUESTS,
    burstWindowMs: env.SEARCH_RATE_LIMIT_BURST_WINDOW_MS,
    maxRequests: env.SEARCH_RATE_LIMIT_MAX_REQUESTS,
    windowMs: env.SEARCH_RATE_LIMIT_WINDOW_MS,
  },
  usesAccelerate,
};

export default config;
