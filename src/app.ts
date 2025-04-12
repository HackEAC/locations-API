import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import routes from './routes';
import { ApiError, errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

// Initialize Express app
const app = express();

// Initialize Prisma client
export const prisma = new PrismaClient();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morgan('dev'));

// Log request details in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, _: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Locations API',
      version: '1.0.0',
      description: 'API for countries, regions, districts, wards and places',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}/api`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check endpoint
app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      path: req.originalUrl,
    },
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
