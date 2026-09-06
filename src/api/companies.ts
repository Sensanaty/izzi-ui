import { api } from "@/lib/api";
import { emptyResponseSchema } from "@/lib/schemas/common";
import {
  companiesResponseSchema,
  companySchema,
  paginatedCompaniesResponseSchema,
} from "@/lib/schemas/company";

import type { Company } from "@/lib/schemas/company";

export type CompanyPayload = {
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  subscription: string | null;
  needs_cleanup?: boolean;
};

export const companiesSortFields = [
  "id",
  "name",
  "address",
  "city",
  "country",
  "website",
  "subscription",
  "parts_count",
] as const;

export type CompaniesSortField = (typeof companiesSortFields)[number];
export type CompaniesSort = {
  field: CompaniesSortField;
  direction: "asc" | "desc";
};

export function isCompaniesSortField(value: string): value is CompaniesSortField {
  return companiesSortFields.some((field) => field === value);
}

export async function getCompanies(): Promise<Company[]> {
  const response = await api.get("/companies/options", companiesResponseSchema);

  return response.data;
}

export type CompaniesQuery = {
  page?: number;
  count?: number;
  query?: string;
  needsCleanup?: boolean;
  sort?: CompaniesSort[];
};

export async function getCompaniesPage(query: CompaniesQuery = {}) {
  const searchParams = new URLSearchParams();

  if (query.page !== undefined) searchParams.set("page", String(query.page));
  if (query.count !== undefined) searchParams.set("count", String(query.count));
  if (query.query) searchParams.set("query", query.query);
  if (query.needsCleanup) searchParams.set("needs_cleanup", "true");

  query.sort?.forEach((sort, index) => {
    searchParams.set(`sort[${index}][field]`, sort.field);
    searchParams.set(`sort[${index}][direction]`, sort.direction);
  });

  const queryString = searchParams.toString();
  const path = queryString ? `/companies?${queryString}` : "/companies";

  return api.get(path, paginatedCompaniesResponseSchema);
}

export async function getCompany(id: number): Promise<Company> {
  return api.get(`/companies/${id}`, companySchema);
}

export async function createCompany(payload: CompanyPayload): Promise<Company> {
  return api.post("/companies", payload, companySchema);
}

export async function updateCompany(id: number, payload: CompanyPayload): Promise<Company> {
  return api.patch(`/companies/${id}`, payload, companySchema);
}

export async function deleteCompany(id: number): Promise<void> {
  await api.delete(`/companies/${id}`, emptyResponseSchema);
}
