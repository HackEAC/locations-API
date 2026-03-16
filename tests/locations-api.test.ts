import request from 'supertest';
import app from '../src/app.js';
import { disconnectPrisma, prisma } from '../src/db/prisma.js';

afterAll(async () => {
  await disconnectPrisma();
});

describe.each(['/v1', '/api'])('Tanzania Locations API (%s)', (basePath) => {
  it('lists countries with pagination metadata', async () => {
    const res = await request(app).get(`${basePath}/countries?page=1&limit=1`);

    expect(res.statusCode).toBe(200);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 1, total: 2, pages: 2 });
    expect(res.body.data).toHaveLength(1);
  });

  it('gets a specific region', async () => {
    const res = await request(app).get(`${basePath}/regions/12`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      regionCode: 12,
      regionName: 'Dodoma',
      countryId: 1,
    });
  });

  it('supports collection filters without changing response envelopes', async () => {
    const res = await request(app).get(`${basePath}/places?countryId=1&regionCode=12&districtCode=1201&wardCode=120101`);

    expect(res.statusCode).toBe(200);
    expect(res.body.pagination.total).toBe(1);
    expect(res.body.data[0]).toMatchObject({
      id: 2,
      placeName: 'Nzuguni Center',
    });
  });

  it('returns region districts with pagination', async () => {
    const res = await request(app).get(`${basePath}/regions/12/districts?page=1&limit=10`);

    expect(res.statusCode).toBe(200);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 10, total: 1, pages: 1 });
    expect(res.body.data[0]).toMatchObject({
      districtCode: 1201,
      districtName: 'Dodoma Urban',
    });
  });

  it('returns district wards', async () => {
    const res = await request(app).get(`${basePath}/districts/1201/wards`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([
      expect.objectContaining({
        wardCode: 120101,
        wardName: 'Nzuguni',
      }),
    ]);
  });

  it('returns ward places', async () => {
    const res = await request(app).get(`${basePath}/wards/120101/places`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([
      expect.objectContaining({
        id: 2,
        placeName: 'Nzuguni Center',
      }),
    ]);
  });

  it('returns 400 for invalid region code', async () => {
    const res = await request(app).get(`${basePath}/regions/invalid`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('Shared API behavior', () => {
  it('keeps the /api alias active', async () => {
    const res = await request(app).get('/api/countries');

    expect(res.statusCode).toBe(200);
    expect(res.headers['x-api-base-path']).toBe('compatibility');
  });

  it('searches safely when the query contains quotes', async () => {
    const res = await request(app).get('/v1/search').query({ q: "nzuguni's" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns seeded matches for a normal search query', async () => {
    const res = await request(app).get('/v1/search').query({ q: 'nzuguni' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data[0]).toMatchObject({
      ward: 'Nzuguni',
      places: 'Nzuguni Center',
      regioncode: 12,
    });
  });

  it('returns 404 for an unknown route', async () => {
    const res = await request(app).get('/v1/unknown/route');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('reuses the Prisma singleton', async () => {
    const imported = await import('../src/db/prisma.js');

    expect(imported.prisma).toBe(prisma);
  });
});
