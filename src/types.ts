import { z } from 'zod';
import type { ZodIssue } from 'zod';

const positiveInt = z.coerce.number().int().positive();

export const paginationSchema = z.object({
  page: positiveInt.optional().default(1),
  limit: positiveInt.max(100).optional().default(10),
  search: z.string().trim().min(1).optional(),
});

export const idParamSchema = z.object({
  id: positiveInt,
});

export const codeParamSchema = z.object({
  regionCode: positiveInt,
  districtCode: positiveInt,
  wardCode: positiveInt,
});

export const countryCodeParamSchema = z.object({
  countryCode: positiveInt,
});

export const regionsQuerySchema = paginationSchema.extend({
  countryId: positiveInt.optional(),
});

export const districtsQuerySchema = paginationSchema.extend({
  countryId: positiveInt.optional(),
  regionCode: positiveInt.optional(),
});

export const wardsQuerySchema = paginationSchema.extend({
  countryId: positiveInt.optional(),
  districtCode: positiveInt.optional(),
  regionCode: positiveInt.optional(),
});

export const placesQuerySchema = paginationSchema.extend({
  countryId: positiveInt.optional(),
  districtCode: positiveInt.optional(),
  regionCode: positiveInt.optional(),
  wardCode: positiveInt.optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(2, 'Query must be at least 2 characters long'),
});

export type IdParam = z.infer<typeof idParamSchema>;
export type CodeParam = z.infer<typeof codeParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: {
    message: string;
    stack?: string;
    details?: unknown;
    validationErrors?: ZodIssue[];
  };
}

declare global {
  namespace Express {
    interface Request<
      Params = any,
      ReqBody = any,
      ReqQuery = any
    > {
      requestId?: string;
      validatedQuery?: ReqQuery;
      validatedParams?: Params;
      validatedBody?: ReqBody;
    }
  }
}
