import { api } from "@/lib/api";
import { companiesResponseSchema, companySchema } from "@/lib/schemas/company";

import type { Company } from "@/lib/schemas/company";

export type CompanyPayload = {
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  type: string | null;
  subscription: string | null;
};

export async function getCompanies(): Promise<Company[]> {
  const response = await api.get("/companies", companiesResponseSchema);

  return response.data;
}

export async function createCompany(payload: CompanyPayload): Promise<Company> {
  return api.post("/companies", payload, companySchema);
}
