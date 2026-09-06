import { z } from "zod";

export const companySchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  subscription: z.string().nullable().optional(),
  needs_cleanup: z.boolean().default(false),
  parts_count: z.number().optional(),
  clients_count: z.number().optional(),
});

export const companiesResponseSchema = z.object({
  data: z.array(companySchema),
});

export const paginatedCompaniesResponseSchema = z.object({
  data: z.array(companySchema),
  metadata: z
    .object({
      count: z.number(),
      total: z.number(),
      page: z.number(),
      last: z.number(),
      next: z.number().nullable(),
      prev: z.number().nullable(),
    })
    .passthrough(),
});

export const companyMergePreviewSchema = z.object({
  data: z.object({
    source_company_id: z.number(),
    target_company_id: z.number(),
    parts_count: z.number(),
    clients_count: z.number(),
  }),
});

export const companyMergeResponseSchema = z.object({
  data: companySchema,
  meta: z.object({
    merged_company_id: z.number(),
    parts_moved: z.number(),
    clients_moved: z.number(),
  }),
});

export type Company = z.infer<typeof companySchema>;
export type PaginatedCompaniesResponse = z.infer<typeof paginatedCompaniesResponseSchema>;
