import { z } from "zod";

export const companySchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  subscription: z.string().nullable().optional(),
});

export const companiesResponseSchema = z.object({
  data: z.array(companySchema),
});

export type Company = z.infer<typeof companySchema>;
