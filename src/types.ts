import { z, ZodIssue } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const codeParamSchema = z.object({
  regionCode: z.coerce.number().int().positive(),
  districtCode: z.coerce.number().int().positive(),
  wardCode: z.coerce.number().int().positive(),
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
    details?: any;
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
      validatedQuery?: ReqQuery;
      validatedParams?: Params;
      validatedBody?: ReqBody;
    }
  }
}
