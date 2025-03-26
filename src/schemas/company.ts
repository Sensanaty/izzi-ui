import {
  array,
  coerce,
  date,
  literal,
  object,
  string,
  type infer as ZodInfer,
} from "zod";

export const CompanySchema = object({
  id: coerce.number().int().readonly().catch(0),
  name: string().min(1, { message: "Name is required" }),
  address: string().optional().catch(""),
  city: string().optional().catch(""),
  country: string().optional().catch(""),
  website: string().url().optional().catch(""),
  subscription: string().optional().catch(""),
  parts_count: coerce.number().int().readonly().catch(0),
  created_at: date().default(() => new Date()),
  updated_at: date().default(() => new Date()),
});
export type Company = ZodInfer<typeof CompanySchema>;

export const CompaniesArraySchema = array(CompanySchema);

export const parseCompany = (data: unknown): Company => CompanySchema.parse(data);

export const parseCompanies = (data: unknown): Company[] => CompaniesArraySchema.parse(data);

export const CreateOrUpdateCompanySchema = CompanySchema.omit({ id: true, created_at: true, updated_at: true });
export type CreateOrUpdateCompany = ZodInfer<typeof CreateOrUpdateCompanySchema>;
