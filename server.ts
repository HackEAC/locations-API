import app from './src/app.js';
import config from './src/config.js';
import { disconnectPrisma } from './src/db/prisma.js';

const server = app.listen(config.port, () => {
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

async function shutdown(signal: NodeJS.Signals) {
  console.log(JSON.stringify({ message: 'Graceful shutdown requested', signal }));

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
