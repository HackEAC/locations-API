import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorResponse } from '../types';

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
  _: Request, 
  res: Response<ErrorResponse>, 
) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  
  let statusCode = 500;
  let message = 'Something went wrong';
  
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  
  if (err instanceof ZodError) {
    statusCode = 400;
    message = `Validation error: ${err.errors.map(e => e.message).join(', ')}`;
  }
  
  if ('code' in err && err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested resource not found';
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
        details: err instanceof ZodError ? err.errors : err
      })
    }
  });
};
