import {
  array,
  coerce,
  date,
  number,
  object,
  string,
  enum as ZodEnum,
  type infer as ZodInfer,
} from "zod";
import type { Version } from "@/schemas/version.ts";

export const PartSchema = object({
  id: coerce.number().int().readonly(),
  part_number: string().min(1, { message: "Part Number is required" }),
  description: string().optional(),
  available: coerce.number().int().default(0),
  reserved: coerce.number().int().default(0),
  sold: coerce.number().int().default(0),
  condition: string().optional(),
  min_cost: coerce.number().multipleOf(0.01).default(0.0).optional(),
  min_price: coerce.number().multipleOf(0.01).default(0.0).optional(),
  min_order: coerce.number().int().default(0).optional(),
  med_cost: coerce.number().multipleOf(0.01).default(0.0).optional(),
  med_price: coerce.number().multipleOf(0.01).default(0.0).optional(),
  med_order: coerce.number().int().default(0).optional(),
  max_cost: coerce.number().multipleOf(0.01).default(0.0).optional(),
  max_price: coerce.number().multipleOf(0.01).default(0.0).optional(),
  max_order: coerce.number().int().default(0).optional(),
  lead_time: string().optional(),
  quote_type: ZodEnum(["outright_sale", "flat_rate_exchange", "exchange_plus_cost"]).default("outright_sale"),
  tag: string().optional(),
  internal_note: string().optional(),
  created_at: date().default(() => new Date()),
  updated_at: date().default(() => new Date()),
  company_id: coerce.number().int(),
  company_name: string().readonly(),
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
export const CreatePartSchema = PartSchema.omit({ id: true, created_at: true, updated_at: true });
export type CreatePart = ZodInfer<typeof CreatePartSchema>;

export type PartVersion = Version<Part>;
