import express from 'express';
import request from 'supertest';
import { createRateLimiter } from '../src/middleware/rateLimit.js';

function createTestApp(limiter = createRateLimiter({
  burstMaxRequests: 2,
  burstWindowMs: 1_000,
  maxRequests: 3,
  name: 'test',
  windowMs: 60_000,
})) {
  const app = express();

  app.use(limiter);
  app.get('/limited', (_req, res) => {
    res.json({ ok: true });
  });
  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}

describe('rate limiting middleware', () => {
  it('returns rate limit headers for allowed requests', async () => {
    const app = createTestApp();
    const res = await request(app).get('/limited');

    expect(res.statusCode).toBe(200);
    expect(res.headers['x-ratelimit-limit']).toBe('3');
    expect(res.headers['x-ratelimit-remaining']).toBe('1');
    expect(res.headers['x-ratelimit-policy']).toContain('test');
  });

  it('blocks bursts before the sustained limit is reached', async () => {
    const app = createTestApp(createRateLimiter({
      burstMaxRequests: 2,
      burstWindowMs: 60_000,
      maxRequests: 10,
      name: 'burst-test',
      windowMs: 60_000,
    }));

    await request(app).get('/limited');
    await request(app).get('/limited');
    const res = await request(app).get('/limited');

    expect(res.statusCode).toBe(429);
    expect(res.headers['retry-after']).toBeDefined();
    expect(res.body.error.message).toMatch(/Rate limit exceeded/i);
  });

  it('blocks requests after the sustained limit is reached', async () => {
    const app = createTestApp(createRateLimiter({
      maxRequests: 2,
      name: 'window-test',
      windowMs: 60_000,
    }));

    await request(app).get('/limited');
    await request(app).get('/limited');
    const res = await request(app).get('/limited');

    expect(res.statusCode).toBe(429);
    expect(res.headers['retry-after']).toBeDefined();
  });

  it('supports skipping selected routes', async () => {
    const app = createTestApp(createRateLimiter({
      maxRequests: 1,
      name: 'skip-test',
      skip: (req) => req.path === '/health',
      windowMs: 60_000,
    }));

    await request(app).get('/health');
    const healthRes = await request(app).get('/health');
    await request(app).get('/limited');
    const limitedRes = await request(app).get('/limited');

    expect(healthRes.statusCode).toBe(200);
    expect(limitedRes.statusCode).toBe(429);
  });

  it('does not trust spoofed forwarded headers by default', async () => {
    const app = createTestApp(createRateLimiter({
      maxRequests: 1,
      name: 'spoof-test',
      windowMs: 60_000,
    }));

    await request(app).get('/limited').set('x-forwarded-for', '203.0.113.10');
    const res = await request(app).get('/limited').set('x-forwarded-for', '198.51.100.25');

    expect(res.statusCode).toBe(429);
  });

  it('uses forwarded client IPs when Express trust proxy is enabled', async () => {
    const app = express();

    app.set('trust proxy', true);
    app.use(createRateLimiter({
      maxRequests: 1,
      name: 'trusted-proxy-test',
      windowMs: 60_000,
    }));
    app.get('/limited', (_req, res) => {
      res.json({ ok: true });
    });

    const first = await request(app).get('/limited').set('x-forwarded-for', '203.0.113.10');
    const second = await request(app).get('/limited').set('x-forwarded-for', '198.51.100.25');

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
  });
});
