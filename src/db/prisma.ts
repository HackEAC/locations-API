import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';
import config from '../config.js';

const globalForPrisma = globalThis as typeof globalThis & {
  pgPool?: Pool;
  prisma?: PrismaClient;
};

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: config.databaseUrl,
  });

const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (config.nodeEnv !== 'production') {
  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = prisma;
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
  await pool.end();
}
