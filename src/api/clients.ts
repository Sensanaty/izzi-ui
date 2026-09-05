import { api } from "@/lib/api";
import { clientSchema, clientsResponseSchema } from "@/lib/schemas/client";
import { emptyResponseSchema } from "@/lib/schemas/common";

import type { ClientField } from "@/lib/schemas/client";

export const clientsSortFields = [
  "id",
  "name",
  "address",
  "number",
  "email",
  "company_name",
] as const satisfies readonly ClientField[];

export type ClientsSortField = (typeof clientsSortFields)[number];
export type ClientsSort = { field: ClientsSortField; direction: "asc" | "desc" };

export type ClientsQuery = {
  page?: number;
  count?: number;
  query?: string;
  companyId?: number;
  sort?: ClientsSort[];
};

export function isClientsSortField(value: string): value is ClientsSortField {
  return clientsSortFields.some((field) => field === value);
}

export async function getClients(query: ClientsQuery = {}) {
  const searchParams = new URLSearchParams();

  if (query.page !== undefined) searchParams.set("page", String(query.page));
  if (query.count !== undefined) searchParams.set("count", String(query.count));
  if (query.query) searchParams.set("query", query.query);
  if (query.companyId !== undefined) searchParams.set("company_id", String(query.companyId));

  query.sort?.forEach((sort, index) => {
    searchParams.set(`sort[${index}][field]`, sort.field);
    searchParams.set(`sort[${index}][direction]`, sort.direction);
  });

  const queryString = searchParams.toString();

  return api.get(queryString ? `/clients?${queryString}` : "/clients", clientsResponseSchema);
}

export type ClientPayload = {
  name: string;
  address: string | null;
  number: string | null;
  email: string | null;
  company_id: number;
};

export async function getClient(id: number) {
  return api.get(`/clients/${id}`, clientSchema);
}

export async function createClient(payload: ClientPayload) {
  return api.post("/clients", payload, clientSchema);
}

export async function updateClient(id: number, payload: ClientPayload) {
  return api.patch(`/clients/${id}`, payload, clientSchema);
}

export async function deleteClient(id: number): Promise<void> {
  await api.delete(`/clients/${id}`, emptyResponseSchema);
}
