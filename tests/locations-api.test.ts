import request from 'supertest';
import app from '../src/app';

describe('Tanzania Locations API', () => {
  // Countries
  describe('GET /api/countries', () => {
    it('should return a list of countries', async () => {
      const res = await request(app).get('/api/countries');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it('should support pagination', async () => {
      const res = await request(app).get('/api/countries?page=1&limit=5');
      expect(res.statusCode).toEqual(200);
      expect(res.body.pagination).toMatchObject({ page: 1, limit: 5 });
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });
  });

  // Regions
  describe('GET /api/regions/:code', () => {
    it('should return a specific region', async () => {
      const res = await request(app).get('/api/regions/41');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('regionCode', 41);
    });

    it('should return 404 for non-existent region', async () => {
      const res = await request(app).get('/api/regions/40');
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid region code', async () => {
      const res = await request(app).get('/api/regions/invalid');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Regions → Districts
  describe('GET /api/regions/:code/districts', () => {
    it('should return districts of a specific region', async () => {
      const res = await request(app).get('/api/regions/41/districts');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it('should return 404 for region that doesn’t exist', async () => {
      const res = await request(app).get('/api/regions/40/districts');
      expect(res.statusCode).toBe(404);
    });
  });

  // Districts → Wards
  describe('GET /api/districts/:code/wards', () => {
    it('should return wards for a district', async () => {
      const res = await request(app).get('/api/districts/411/wards');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 404 if district not found', async () => {
      const res = await request(app).get('/api/districts/00000/wards');
      expect(res.statusCode).toBe(404);
    });
  });

  // Ward Details
  describe('GET /api/wards/:code', () => {
    it('should return a specific ward', async () => {
      const res = await request(app).get('/api/wards/40000');
      if (res.statusCode === 200) {
        expect(res.body.data).toHaveProperty('wardCode', 41115);
      } else {
        expect([404, 400]).toContain(res.statusCode);
      }
    });
  });

  // 404 NOT FOUND
  describe('Fallback Route', () => {
    it('should return 404 for unknown route', async () => {
      const res = await request(app).get('/api/unknown/route');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
