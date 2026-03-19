import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import config from '../src/config.js';

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const directDatabaseUrl = config.directDatabaseUrl;

if (!directDatabaseUrl) {
  throw new Error('db:migrate requires DIRECT_DATABASE_URL when DATABASE_URL uses Prisma Accelerate.');
}

function runPrisma(args: string[]) {
  const result = spawnSync(
    pnpmCommand,
    ['exec', 'prisma', ...args],
    {
      env: process.env,
      stdio: 'inherit',
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function bootstrapIfNeeded() {
  const pool = new Pool({
    connectionString: directDatabaseUrl,
  });

  try {
    const [{ migrationsTableExists, countriesTableExists }] = (
      await pool.query<{
        migrationsTableExists: string | null;
        countriesTableExists: string | null;
      }>(
        `
          SELECT
            to_regclass('public._prisma_migrations') AS "migrationsTableExists",
            to_regclass('public.countries') AS "countriesTableExists"
        `,
      )
    ).rows;

    const initApplied = migrationsTableExists
      ? (
          await pool.query<{ exists: boolean }>(
            `SELECT EXISTS(
              SELECT 1
              FROM "_prisma_migrations"
              WHERE migration_name = 'init'
            ) AS "exists"`,
          )
        ).rows[0]?.exists ?? false
      : false;

    if (!initApplied) {
      if (!countriesTableExists) {
        runPrisma([
          'db',
          'execute',
          '--file',
          'prisma/migrations/init/migration.sql',
        ]);
      }

      runPrisma(['migrate', 'resolve', '--applied', 'init']);
    }
  } finally {
    await pool.end();
  }
}

await bootstrapIfNeeded();
runPrisma(['migrate', 'deploy']);
