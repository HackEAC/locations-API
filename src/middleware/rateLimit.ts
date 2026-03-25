import type { Request, RequestHandler, Response } from 'express';

const CLEANUP_INTERVAL = 200;

interface ClientState {
  burstTimestamps: number[];
  count: number;
  lastSeenAt: number;
  resetAt: number;
}

interface RateLimitOptions {
  burstMaxRequests?: number;
  burstWindowMs?: number;
  maxRequests: number;
  name: string;
  skip?: (req: Request) => boolean;
  windowMs: number;
}

function clientAddress(req: Request) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function cleanupStaleEntries(entries: Map<string, ClientState>, ttlMs: number, now: number) {
  for (const [key, state] of entries.entries()) {
    if (state.lastSeenAt + ttlMs < now) {
      entries.delete(key);
    }
  }
}

function setRateLimitHeaders(res: Response, options: RateLimitOptions, remaining: number, resetAt: number) {
  const windowSeconds = Math.ceil(options.windowMs / 1000);
  const burstPolicy = options.burstWindowMs && options.burstMaxRequests
    ? `, burst=${options.burstMaxRequests}/${Math.ceil(options.burstWindowMs / 1000)}s`
    : '';

  res.setHeader('X-RateLimit-Limit', String(options.maxRequests));
  res.setHeader('X-RateLimit-Remaining', String(remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
  res.setHeader('X-RateLimit-Policy', `${options.name}; window=${windowSeconds}s; limit=${options.maxRequests}${burstPolicy}`);
}

export function createRateLimiter(options: RateLimitOptions): RequestHandler {
  const entries = new Map<string, ClientState>();
  const ttlMs = Math.max(options.windowMs, options.burstWindowMs ?? 0) * 2;
  let requestCounter = 0;

  return (req, res, next) => {
    if (req.method === 'OPTIONS' || options.skip?.(req)) {
      next();
      return;
    }

    const now = Date.now();
    requestCounter += 1;

    if (requestCounter % CLEANUP_INTERVAL === 0) {
      cleanupStaleEntries(entries, ttlMs, now);
    }

    const key = clientAddress(req);
    const state = entries.get(key) ?? {
      burstTimestamps: [],
      count: 0,
      lastSeenAt: now,
      resetAt: now + options.windowMs,
    };

    if (now >= state.resetAt) {
      state.count = 0;
      state.resetAt = now + options.windowMs;
    }

    state.count += 1;
    state.lastSeenAt = now;

    let remaining = Math.max(0, options.maxRequests - state.count);
    const windowLimited = state.count > options.maxRequests;
    const windowRetryAfterMs = state.resetAt - now;

    let burstLimited = false;
    let burstRetryAfterMs = 0;

    if (options.burstWindowMs && options.burstMaxRequests) {
      const burstWindowStart = now - options.burstWindowMs;
      state.burstTimestamps = state.burstTimestamps.filter((timestamp) => timestamp > burstWindowStart);
      state.burstTimestamps.push(now);

      remaining = Math.min(remaining, Math.max(0, options.burstMaxRequests - state.burstTimestamps.length));
      burstLimited = state.burstTimestamps.length > options.burstMaxRequests;

      if (burstLimited) {
        const oldestTimestamp = state.burstTimestamps[0];
        burstRetryAfterMs = oldestTimestamp + options.burstWindowMs - now;
      }
    }

    entries.set(key, state);
    const resetAt = windowLimited || burstLimited
      ? now + Math.max(windowLimited ? windowRetryAfterMs : 0, burstLimited ? burstRetryAfterMs : 0)
      : state.resetAt;

    setRateLimitHeaders(res, options, remaining, resetAt);

    if (windowLimited || burstLimited) {
      const retryAfterMs = Math.max(windowLimited ? windowRetryAfterMs : 0, burstLimited ? burstRetryAfterMs : 0);
      const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

      res.setHeader('Retry-After', String(retryAfterSeconds));
      res.status(429).json({
        error: {
          message: 'Rate limit exceeded. Please slow down and try again later.',
        },
      });
      return;
    }

    next();
  };
}
