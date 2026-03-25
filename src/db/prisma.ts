import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';
import config from '../config.js';

const globalForPrisma = globalThis as typeof globalThis & {
  pgPool?: Pool;
  prismaClient?: PrismaClient;
};

let pool = globalForPrisma.pgPool;
let prismaClient = globalForPrisma.prismaClient;

function databaseHost() {
  try {
    return new URL(config.usesAccelerate ? config.databaseUrl : (config.directDatabaseUrl ?? config.databaseUrl)).hostname;
  } catch {
    return 'unknown';
  }
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    const errorWithCode = error as Error & { code?: string };

    return {
      code: errorWithCode.code,
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
    name: 'UnknownError',
  };
}

function createPool() {
  if (!config.directDatabaseUrl) {
    throw new Error('DIRECT_DATABASE_URL or legacy DIRECT_URL is required for direct PostgreSQL connections.');
  }

  return new Pool({
    connectionString: config.directDatabaseUrl,
  });
}

function createAcceleratedPrismaClient() {
  return new PrismaClient({
    accelerateUrl: config.databaseUrl,
  }).$extends(withAccelerate()) as unknown as PrismaClient;
}

function createPrismaClient(nextPool: Pool) {
  return new PrismaClient({
    adapter: new PrismaPg(nextPool as unknown as ConstructorParameters<typeof PrismaPg>[0]),
  });
}

function cacheInstances() {
  if (config.nodeEnv !== 'production') {
    globalForPrisma.pgPool = pool;
    globalForPrisma.prismaClient = prismaClient;
  }
}

function ensurePrismaClient(): PrismaClient {
  if (!prismaClient) {
    if (config.usesAccelerate) {
      prismaClient = createAcceleratedPrismaClient();
    } else {
      if (!pool) {
        pool = createPool();
      }

      prismaClient = createPrismaClient(pool);
    }

    cacheInstances();
  }

  return prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, property, receiver) {
    return Reflect.get(ensurePrismaClient() as object, property, receiver) as unknown;
  },
  set(_, property, value, receiver) {
    return Reflect.set(ensurePrismaClient() as object, property, value, receiver);
  },
});

if (pool && prismaClient && config.nodeEnv !== 'production') {
  cacheInstances();
}

export async function checkDatabaseConnection(options: { logErrors?: boolean } = {}) {
  const { logErrors = true } = options;

  try {
    await ensurePrismaClient().$queryRawUnsafe('SELECT 1');
    return { ok: true } as const;
  } catch (error) {
    if (logErrors) {
      console.error(
        JSON.stringify({
          databaseHost: databaseHost(),
          error: serializeError(error),
          level: 'error',
          message: 'Database connectivity check failed',
        }),
      );
    }

    return {
      error: serializeError(error),
      ok: false,
    } as const;
  }
}

export async function disconnectPrisma() {
  if (prismaClient) {
    await prismaClient.$disconnect();
  }

  if (pool) {
    await pool.end();
  }

  pool = undefined;
  prismaClient = undefined;

  if (config.nodeEnv !== 'production') {
    delete globalForPrisma.pgPool;
    delete globalForPrisma.prismaClient;
  }
}
