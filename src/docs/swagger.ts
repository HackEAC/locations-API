import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Tanzania Location API',
    version: '2.0.0',
    description:
      'Compatibility-first API for Tanzania and East Africa location data with dual base paths.',
    contact: {
      name: 'HackEAC',
      url: 'https://maotora.com',
      email: 'maotoramm@gmail.com',
    },
  },
  servers: [
    {
      url: '/v1',
      description: 'Canonical API base path',
    },
    {
      url: '/api',
      description: 'Compatibility alias',
    },
  ],
  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
        },
        required: ['error'],
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          pages: { type: 'integer' },
        },
        required: ['page', 'limit', 'total', 'pages'],
      },
    },
  },
  paths: {
    '/countries': {
      get: {
        summary: 'List countries',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Countries list' },
        },
      },
    },
    '/countries/{id}': {
      get: {
        summary: 'Get a country by id',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Country details' },
          '404': { description: 'Country not found' },
        },
      },
    },
    '/countries/{countryCode}/regions': {
      get: {
        summary: 'List country regions',
        parameters: [{ in: 'path', name: 'countryCode', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Country regions' },
          '404': { description: 'Country not found' },
        },
      },
    },
    '/regions': {
      get: {
        summary: 'List regions',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'countryId', schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          '200': { description: 'Regions list' },
        },
      },
    },
    '/regions/{regionCode}': {
      get: {
        summary: 'Get a region by code',
        parameters: [{ in: 'path', name: 'regionCode', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Region details' },
          '404': { description: 'Region not found' },
        },
      },
    },
    '/regions/{regionCode}/districts': {
      get: {
        summary: 'List region districts',
        parameters: [
          { in: 'path', name: 'regionCode', required: true, schema: { type: 'integer' } },
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 } },
        ],
        responses: {
          '200': { description: 'District list for the region' },
          '404': { description: 'Region not found' },
        },
      },
    },
    '/districts': {
      get: {
        summary: 'List districts',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'countryId', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'regionCode', schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          '200': { description: 'Districts list' },
        },
      },
    },
    '/districts/{districtCode}': {
      get: {
        summary: 'Get a district by code',
        parameters: [{ in: 'path', name: 'districtCode', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'District details' },
          '404': { description: 'District not found' },
        },
      },
    },
    '/districts/{districtCode}/wards': {
      get: {
        summary: 'List district wards',
        parameters: [{ in: 'path', name: 'districtCode', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Wards for the district' },
          '404': { description: 'District not found' },
        },
      },
    },
    '/wards': {
      get: {
        summary: 'List wards',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'countryId', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'regionCode', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'districtCode', schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          '200': { description: 'Wards list' },
        },
      },
    },
    '/wards/{wardCode}': {
      get: {
        summary: 'Get a ward by code',
        parameters: [{ in: 'path', name: 'wardCode', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Ward details' },
          '404': { description: 'Ward not found' },
        },
      },
    },
    '/wards/{wardCode}/places': {
      get: {
        summary: 'List ward places',
        parameters: [{ in: 'path', name: 'wardCode', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Places for the ward' },
          '404': { description: 'Ward not found' },
        },
      },
    },
    '/places': {
      get: {
        summary: 'List places',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'countryId', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'regionCode', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'districtCode', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'wardCode', schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          '200': { description: 'Places list' },
        },
      },
    },
    '/places/{id}': {
      get: {
        summary: 'Get a place by id',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Place details' },
          '404': { description: 'Place not found' },
        },
      },
    },
    '/search': {
      get: {
        summary: 'Full-text search across the general locations view',
        parameters: [{ in: 'query', name: 'q', required: true, schema: { type: 'string', minLength: 2 } }],
        responses: {
          '200': { description: 'Search results' },
          '400': { description: 'Invalid query', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.get('/openapi.json', (_, res) => {
    res.json(openApiSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
}
