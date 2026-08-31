import { z } from "zod";

export const clientSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullable().optional(),
  number: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  company_id: z.number(),
  company_name: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const clientResponseSchema = z.object({ data: clientSchema });

export const clientsResponseSchema = z.object({
  data: z.array(clientSchema),
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

export type Client = z.infer<typeof clientSchema>;
export type ClientField = keyof Client;
