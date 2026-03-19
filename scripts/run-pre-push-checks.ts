import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

function resolveDirectDatabaseUrl() {
  const candidate = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!candidate) {
    throw new Error('Set DIRECT_DATABASE_URL to a direct PostgreSQL connection before pushing.');
  }

  if (candidate.startsWith('prisma://') || candidate.startsWith('prisma+postgres://')) {
    throw new Error('Pre-push checks require DIRECT_DATABASE_URL to point at direct PostgreSQL, not Prisma Accelerate.');
  }

  return new URL(candidate);
}

function toMaintenanceEnv(url: URL) {
  return {
    PGDATABASE: 'postgres',
    PGHOST: url.hostname,
    PGPASSWORD: decodeURIComponent(url.password),
    PGPORT: url.port || '5432',
    PGUSER: decodeURIComponent(url.username),
  };
}

function tempDatabaseUrl(baseUrl: URL, databaseName: string) {
  const next = new URL(baseUrl.toString());
  next.pathname = `/${databaseName}`;

  return next.toString();
}

const directUrl = resolveDirectDatabaseUrl();
const originalDatabase = directUrl.pathname.replace(/^\//, '') || 'locations_api';
const tempDatabaseName = `${originalDatabase}_prepush_${randomUUID().replace(/-/g, '').slice(0, 8)}`;
const maintenanceEnv = {
  ...process.env,
  ...toMaintenanceEnv(directUrl),
};
const isolatedDatabaseUrl = tempDatabaseUrl(directUrl, tempDatabaseName);

try {
  execFileSync('createdb', [tempDatabaseName], {
    env: maintenanceEnv,
    stdio: 'inherit',
  });

  execFileSync('pnpm', ['test:ci'], {
    env: {
      ...process.env,
      DATABASE_URL: isolatedDatabaseUrl,
      DIRECT_DATABASE_URL: isolatedDatabaseUrl,
      NODE_ENV: 'test',
    },
    stdio: 'inherit',
  });
} finally {
  execFileSync('dropdb', ['--if-exists', tempDatabaseName], {
    env: maintenanceEnv,
    stdio: 'inherit',
  });
}
