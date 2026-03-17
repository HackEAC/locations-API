import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

export const attachRequestContext: RequestHandler = (req, res, next) => {
  const requestId = req.header('x-request-id')?.trim() || randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  next();
};

export const apiCompatibilityHeaders: RequestHandler = (_, res, next) => {
  res.setHeader('X-API-Base-Path', 'compatibility');
  res.setHeader('Link', '</v1>; rel="canonical"');
  next();
};

export const cacheControl = (value: string): RequestHandler => {
  return (_, res, next) => {
    res.setHeader('Cache-Control', value);
    next();
  };
};
