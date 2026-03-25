import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import type { Request, Response } from 'express';
import config from './config.js';
import { checkDatabaseConnection } from './db/prisma.js';
import { setupSwagger } from './docs/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createRateLimiter } from './middleware/rateLimit.js';
import {
  apiCompatibilityHeaders,
  attachRequestContext,
} from './middleware/requestContext.js';
import routes from './routes.js';

const app = express();
const apiRateLimiter = createRateLimiter({
  ...config.rateLimit,
  name: 'api',
});
const searchRateLimiter = createRateLimiter({
  ...config.searchRateLimit,
  name: 'search',
});

app.set('trust proxy', config.trustProxy);

morgan.token('request-id', (req) => (req as Request).requestId ?? '-');

const logFormatter: morgan.FormatFn = (tokens, req, res) => {
  return JSON.stringify({
    contentLength: tokens.res(req, res, 'content-length') ?? '0',
    method: tokens.method(req, res),
    path: tokens.url(req, res),
    requestId: tokens['request-id'](req, res),
    responseTimeMs: Number(tokens['response-time'](req, res)),
    status: Number(tokens.status(req, res)),
  });
};

app.use(helmet());
app.use(cors());
app.disable('x-powered-by');
app.use(attachRequestContext);
app.use(morgan(logFormatter));

app.use(express.json({ limit: config.requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: config.requestBodyLimit }));

app.use(['/v1', '/api', '/openapi.json', '/api-docs'], apiRateLimiter);
app.use(['/v1/search', '/api/search'], searchRateLimiter);

app.get('/health', async (_: Request, res: Response) => {
  const database = await checkDatabaseConnection({ logErrors: false });

  res.status(database.ok ? 200 : 503).json({
    database: database.ok ? 'UP' : 'DOWN',
    environment: config.nodeEnv,
    status: database.ok ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

app.get('/', (_: Request, res: Response) => {
  res.send('Its alive!');
});

app.use('/v1', routes);
app.use('/api', apiCompatibilityHeaders, routes);

setupSwagger(app);

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      path: req.originalUrl,
    },
  });
});

app.use(errorHandler);

export default app;
