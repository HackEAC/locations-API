import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './docs/swagger';
import routes from './routes';

const app = express();
export const prisma = new PrismaClient();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, _: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.get('/', (_: Request, res: Response) => {
  res.send('Its alive!');
});

app.use('/v1', routes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      path: req.originalUrl,
    },
  });
});

app.use(errorHandler);

setupSwagger(app);
export default app;
