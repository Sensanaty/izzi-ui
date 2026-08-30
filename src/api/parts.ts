import { api } from "@/lib/api";
import { emptyResponseSchema } from "@/lib/schemas/common";
import {
  partResponseSchema,
  partVersionsResponseSchema,
  partsResponseSchema,
} from "@/lib/schemas/part";

import type { PartField } from "@/lib/schemas/part";

export const partsSortFields = [
  "part_number",
  "description",
  "available",
  "reserved",
  "sold",
  "condition",
  "company_name",
  "min_price",
  "med_price",
  "max_price",
  "lead_time",
  "quote_type",
  "tag",
  "updated_at",
] as const satisfies readonly PartField[];

export type PartsSortField = (typeof partsSortFields)[number];

export function isPartsSortField(value: string): value is PartsSortField {
  return partsSortFields.some((field) => field === value);
}

export type PartsSort = {
  field: PartsSortField;
  direction: "asc" | "desc";
};

export const partsQueryFields = [
  "part_number",
  "description",
  "available",
  "reserved",
  "sold",
  "min_price",
  "med_price",
  "max_price",
  "condition",
  "company_name",
  "quote_type",
  "tag",
  "lead_time",
] as const satisfies readonly PartField[];

export type PartsQueryField = (typeof partsQueryFields)[number];

export type PartsQueryOperator = "contains" | "eq" | "gt" | "gte" | "lt" | "lte" | "between";

export type PartsCondition = {
  field: PartsQueryField;
  operator: PartsQueryOperator;
  value: string;
  secondValue?: string;
  connector?: "and" | "or";
};

export type PartsFilters = {
  partNumberContainsAny?: string[];
  description?: string;
  companyId?: number;
  condition?: string;
  quoteType?: string;
  availableMin?: number;
  availableMax?: number;
  minPriceMin?: string;
  minPriceMax?: string;
};

export type PartsQuery = {
  page?: number;
  count?: number;
  query?: string;
  filters?: PartsFilters;
  conditions?: PartsCondition[];
  sort?: PartsSort[];
};

export async function getParts(query: PartsQuery = {}) {
  const searchParams = new URLSearchParams();

  if (query.page !== undefined) searchParams.set("page", String(query.page));
  if (query.count !== undefined) searchParams.set("count", String(query.count));
  if (query.query) searchParams.set("filter[part_number][contains]", query.query);

  const filterParameterMap: Record<keyof PartsFilters, [string, string]> = {
    partNumberContainsAny: ["part_number", "contains_any"],
    description: ["description", "contains"],
    companyId: ["company_id", "eq"],
    condition: ["condition", "contains"],
    quoteType: ["quote_type", "eq"],
    availableMin: ["available", "gte"],
    availableMax: ["available", "lte"],
    minPriceMin: ["min_price", "gte"],
    minPriceMax: ["min_price", "lte"],
  };

  Object.entries(query.filters ?? {}).forEach(([field, value]) => {
    if (value === undefined || value === "") return;

    const mapping = filterParameterMap[field as keyof PartsFilters];

    if (!mapping) return;

    const [apiField, operator] = mapping;

    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((item) => {
        searchParams.append(`filter[${apiField}][${operator}][]`, item);
      });

      return;
    }

    searchParams.set(`filter[${apiField}][${operator}]`, String(value));
  });

  query.conditions?.forEach((condition, index) => {
    searchParams.set(`conditions[${index}][field]`, condition.field);
    searchParams.set(`conditions[${index}][operator]`, condition.operator);
    searchParams.set(`conditions[${index}][value]`, condition.value);

    if (condition.secondValue !== undefined) {
      searchParams.set(`conditions[${index}][second_value]`, condition.secondValue);
    }
    if (condition.connector !== undefined) {
      searchParams.set(`conditions[${index}][connector]`, condition.connector);
    }
  });

  query.sort?.forEach((sort, index) => {
    searchParams.set(`sort[${index}][field]`, sort.field);
    searchParams.set(`sort[${index}][direction]`, sort.direction);
  });

  const queryString = searchParams.toString();
  const path = queryString ? `/parts?${queryString}` : "/parts";

  return api.get(path, partsResponseSchema);
}

export type PartPayload = {
  part_number: string;
  description: string;
  available: number;
  reserved: number;
  sold: number;
  condition: string;
  min_cost: string;
  min_price: string;
  min_order: number | null;
  med_cost: string;
  med_price: string;
  med_order: number | null;
  max_cost: string;
  max_price: string;
  max_order: number | null;
  lead_time: string | null;
  quote_type: string;
  tag: string;
  internal_note: string | null;
  added: string | null;
  company_id: number;
};

export async function getPart(partId: number) {
  return api.get(`/parts/${partId}`, partResponseSchema);
}

export async function createPart(payload: PartPayload) {
  return api.post("/parts", payload, partResponseSchema);
}

export async function updatePart(partId: number, payload: PartPayload) {
  return api.patch(`/parts/${partId}`, payload, partResponseSchema);
}

export async function getPartVersions(partId: number) {
  return api.get(`/parts/${partId}/versions`, partVersionsResponseSchema);
}

export async function deletePartVersions(partId: number) {
  return api.delete(`/parts/${partId}/versions`, emptyResponseSchema);
}
