import {
  object,
  string,
  number,
  date,
  array,
  nullable,
  type infer as ZodInfer,
} from "zod";

export const PartSchema = object({
  id: number().int(),
  part_number: string(),
  description: string().optional(),
  available: number().int().default(0),
  reserved: number().int().default(0),
  sold: number().int().default(0),
  condition: string().optional(),
  min_cost: number().multipleOf(0.01).default(0.0).optional(),
  min_price: number().multipleOf(0.01).default(0.0).optional(),
  min_order: number().int().default(0).optional(),
  med_cost: number().multipleOf(0.01).default(0.0).optional(),
  med_price: number().multipleOf(0.01).default(0.0).optional(),
  med_order: number().int().default(0).optional(),
  max_cost: number().multipleOf(0.01).default(0.0).optional(),
  max_price: number().multipleOf(0.01).default(0.0).optional(),
  max_order: number().int().default(0).optional(),
  lead_time: string().optional(),
  quote_type: string().optional(),
  tag: string().optional(),
  internal_note: nullable(string()).optional(),
  added: date().default(() => new Date()),
  created_at: date().default(() => new Date()),
  updated_at: date().default(() => new Date()),
  company_id: number().int(),
});

export type Part = ZodInfer<typeof PartSchema>;

// Array schema for multiple parts
export const PartsArraySchema = array(PartSchema);

// Helper function to parse a single part
export const parsePart = (data: unknown): Part => {
  return PartSchema.parse(data);
};

// Helper function to parse an array of parts
export const parseParts = (data: unknown): Part[] => {
  return PartsArraySchema.parse(data);
};

// Partial schema for updates (all fields optional)
export const PartUpdateSchema = PartSchema.partial().required({ id: true });
export type UpdatePart = ZodInfer<typeof PartUpdateSchema>;

// Schema for creating new parts (id & Rails-generated timestamps omitted)
export const CreatePartSchema = PartSchema.omit({ id: true, created_at: true, updated_at: true }).extend({
  added: date().default(() => new Date()),
});
export type CreatePart = ZodInfer<typeof CreatePartSchema>;
