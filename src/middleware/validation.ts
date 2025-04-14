import { RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schemas: {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}): RequestHandler => {
  return (req, res, next) => {
    try {
      if (schemas.body) req.validatedBody = schemas.body.parse(req.body);
      if (schemas.query) req.validatedQuery = schemas.query.parse(req.query);
      if (schemas.params) req.validatedParams = schemas.params.parse(req.params);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: {
            message: 'Validation error',
            validationErrors: err.errors,
          },
        });
        return;
      }

      res.status(500).json({
        error: {
          message: 'Unexpected error',
          stack: err instanceof Error ? err.stack : undefined,
        },
      });
      return;
    }
  };
};
