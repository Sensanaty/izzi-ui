import {
  array,
  coerce,
  date,
  object,
  string,
  type infer as ZodInfer,
} from "zod";

export const CompanySchema = object({
  id: coerce.number().int().readonly(),
  name: string().min(1, { message: "Company Name is required" }),
  address: string().optional(),
  city: string().optional(),
  country: string().optional(),
  website: string().url().optional(),
  subscription: string().optional(),
  parts_count: coerce.number().int().readonly(),
  created_at: date().default(() => new Date()),
  updated_at: date().default(() => new Date()),
});
export type Company = ZodInfer<typeof CompanySchema>;

export const CompaniesArraySchema = array(CompanySchema);

export const parseCompany = (data: unknown): Company => CompanySchema.parse(data);

export const parseCompanies = (data: unknown): Company[] => CompaniesArraySchema.parse(data);

export const CreateOrUpdateCompanySchema = CompanySchema.omit({ id: true, created_at: true, updated_at: true });
export type CreateOrUpdateCompany = ZodInfer<typeof CreateOrUpdateCompanySchema>;
