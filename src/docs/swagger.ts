import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tanzania Location API',
      version: '2.0.0',
      description: 'API for retrieving location data in Tanzania including countries, regions, districts, and wards.',
      contact: {
        name: 'HackEAC',
        url: 'https://maotora.com',
        email: 'maotoramm@gmail.com'
      },
      license: {
        name: 'copyleft',
        url: 'https://opensource.org/licenses/GNU'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Local development server'
      }
    ]
  },
  apis: ['./src/routes.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
