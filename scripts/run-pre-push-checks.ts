import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import { Pool } from 'pg';

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

dotenv.config();

function resolveDirectDatabaseUrl() {
  const candidate = process.env.DIRECT_DATABASE_URL ?? process.env.DIRECT_URL;

  if (!candidate) {
    throw new Error('Set DIRECT_DATABASE_URL or legacy DIRECT_URL in your shell or .env before pushing.');
  }

  if (candidate.startsWith('prisma://') || candidate.startsWith('prisma+postgres://')) {
    throw new Error('Pre-push checks require DIRECT_DATABASE_URL or DIRECT_URL to point at direct PostgreSQL, not Prisma Accelerate.');
  }

  return new URL(candidate);
}

function tempDatabaseUrl(baseUrl: URL, databaseName: string) {
  const next = new URL(baseUrl.toString());
  next.pathname = `/${databaseName}`;

  return next.toString();
}

function adminDatabaseUrl(baseUrl: URL) {
  const next = new URL(baseUrl.toString());
  next.pathname = '/postgres';

  return next.toString();
}

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function toError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}

function runPnpm(args: string[], env: NodeJS.ProcessEnv) {
  execFileSync(pnpmCommand, args, {
    env,
    stdio: 'inherit',
  });
}

async function dropTemporaryDatabase(pool: Pool, databaseName: string) {
  await pool.query(
    `SELECT pg_terminate_backend(pid)
     FROM pg_stat_activity
     WHERE datname = $1
       AND pid <> pg_backend_pid()`,
    [databaseName],
  );
  await pool.query(`DROP DATABASE IF EXISTS ${quoteIdentifier(databaseName)}`);
}

async function main() {
  const directUrl = resolveDirectDatabaseUrl();
  const originalDatabase = directUrl.pathname.replace(/^\//, '') || 'locations_api';
  const tempDatabaseName = `${originalDatabase}_prepush_${randomUUID().replace(/-/g, '').slice(0, 8)}`;
  const isolatedDatabaseUrl = tempDatabaseUrl(directUrl, tempDatabaseName);
  const adminPool = new Pool({
    connectionString: adminDatabaseUrl(directUrl),
  });

  let primaryError: unknown;

  try {
    await adminPool.query(`CREATE DATABASE ${quoteIdentifier(tempDatabaseName)}`);

    runPnpm(['test:ci'], {
      ...process.env,
      DATABASE_URL: isolatedDatabaseUrl,
      DIRECT_DATABASE_URL: isolatedDatabaseUrl,
      NODE_ENV: 'test',
    });
  } catch (error) {
    primaryError = error;
  }

  try {
    await dropTemporaryDatabase(adminPool, tempDatabaseName);
  } catch (cleanupError) {
    if (primaryError) {
      console.error('Failed to drop temporary pre-push database after the primary failure.');
      console.error(cleanupError);
    } else {
      throw cleanupError;
    }
  } finally {
    await adminPool.end();
  }

  if (primaryError) {
    throw toError(primaryError);
  }
}

await main();
