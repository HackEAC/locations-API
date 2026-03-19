import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import type { ErrorResponse } from '../types.js';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | ApiError | ZodError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  void next;

  console.error(
    JSON.stringify({
      level: 'error',
      message: err.message,
      name: err.name,
      requestId: req.requestId,
      stack: err.stack,
    }),
  );

  let statusCode = 500;
  let message = 'Something went wrong';
  const errorWithCode = err as Error & { code?: string };
  const databaseUnavailableCodes = new Set(['P1000', 'P1001', 'P1002', 'P1017']);
  const databaseUnavailablePatterns = [
    /Unable to connect to the Accelerate API/i,
    /Connection terminated due to connection timeout/i,
    /connect ECONN/i,
    /ECONNREFUSED/i,
    /ENOTFOUND/i,
    /timeout/i,
  ];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    message = `Validation error: ${err.issues.map(issue => issue.message).join(', ')}`;
  }

  if ('code' in err && err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested resource not found';
  }

  if (
    errorWithCode.name === 'PrismaClientInitializationError' ||
    databaseUnavailableCodes.has(errorWithCode.code ?? '') ||
    databaseUnavailablePatterns.some((pattern) => pattern.test(err.message))
  ) {
    statusCode = 503;
    message = 'Database unavailable';
  }

  if (err instanceof SyntaxError || err instanceof TypeError) {
    statusCode = 400;
    message = 'Invalid request data';
  }

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    error: {
      message,
      ...(isProduction ? {} : {
        stack: err.stack,
        details: err instanceof ZodError ? err.issues : err,
      }),
    },
  });
};
