import { z } from "zod";

const nullableMoney = z.string().nullable().optional();

export const partSchema = z.object({
  id: z.number(),
  part_number: z.string(),
  description: z.string().nullable().optional(),
  available: z.number(),
  reserved: z.number(),
  sold: z.number(),
  condition: z.string().nullable().optional(),
  min_cost: nullableMoney,
  min_price: nullableMoney,
  min_order: z.number().nullable().optional(),
  med_cost: nullableMoney,
  med_price: nullableMoney,
  med_order: z.number().nullable().optional(),
  max_cost: nullableMoney,
  max_price: nullableMoney,
  max_order: z.number().nullable().optional(),
  lead_time: z.string().nullable().optional(),
  quote_type: z.string(),
  tag: z.string().nullable().optional(),
  internal_note: z.string().nullable().optional(),
  added: z.string().nullable().optional(),
  company_id: z.number().nullable().optional(),
  company_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const partResponseSchema = z.object({
  data: partSchema,
});

export const partsResponseSchema = z.object({
  data: z.array(partSchema),
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

export type Part = z.infer<typeof partSchema>;
export type PartField = keyof Part;
export type PartResponse = z.infer<typeof partResponseSchema>;
export type PartsResponse = z.infer<typeof partsResponseSchema>;

export const partFields = Object.keys(partSchema.shape) as PartField[];
