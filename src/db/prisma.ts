import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';
import config from '../config.js';

const globalForPrisma = globalThis as typeof globalThis & {
  pgPool?: Pool;
  prismaClient?: PrismaClient;
};

let pool = globalForPrisma.pgPool;
let prismaClient = globalForPrisma.prismaClient;

function createPool() {
  return new Pool({
    connectionString: config.databaseUrl,
  });
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
  if (!pool) {
    pool = createPool();
  }

  if (!prismaClient) {
    prismaClient = createPrismaClient(pool);
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
