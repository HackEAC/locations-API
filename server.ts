import app from './src/app.js';
import config from './src/config.js';
import { checkDatabaseConnection, disconnectPrisma } from './src/db/prisma.js';

let server: ReturnType<typeof app.listen> | undefined;

async function startServer() {
  const database = await checkDatabaseConnection();

  if (!database.ok) {
    console.error(
      JSON.stringify({
        error: database.error,
        message: 'Database readiness check failed. Refusing to start server.',
      }),
    );
    process.exit(1);
  }

  server = app.listen(config.port, () => {
    console.log(
      JSON.stringify({
        environment: config.nodeEnv,
        message: 'Server started',
        openApiUrl: `http://localhost:${config.port}/openapi.json`,
        port: config.port,
        swaggerUrl: `http://localhost:${config.port}/api-docs`,
      }),
    );
  });
}

async function shutdown(signal: NodeJS.Signals) {
  console.log(JSON.stringify({ message: 'Graceful shutdown requested', signal }));

  if (!server) {
    void disconnectPrisma()
      .then(() => {
        process.exit(0);
      })
      .catch((error: unknown) => {
        console.error(JSON.stringify({ error, message: 'Failed to disconnect Prisma cleanly' }));
        process.exit(1);
      });
    return;
  }

  server.close(() => {
    void disconnectPrisma()
      .then(() => {
        process.exit(0);
      })
      .catch((error: unknown) => {
        console.error(JSON.stringify({ error, message: 'Failed to disconnect Prisma cleanly' }));
        process.exit(1);
      });
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

await startServer();
