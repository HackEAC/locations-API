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
  // Log error
  console.error(`[${new Date().toISOString()}] Error:`, err);
  
  // Default error values
  let statusCode = 500;
  let message = 'Something went wrong';
  
  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = `Validation error: ${err.errors.map(e => e.message).join(', ')}`;
  }
  
  // Handle Prisma errors
  if ('code' in err && err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested resource not found';
  }
  
  // Type conversion errors
  if (err instanceof SyntaxError || err instanceof TypeError) {
    statusCode = 400;
    message = 'Invalid request data';
  }
  
  // Environment based response
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Send error response
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
