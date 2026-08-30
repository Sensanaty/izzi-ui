import { api } from "@/lib/api";
import { partsResponseSchema } from "@/lib/schemas/part";

export type PartsQuery = {
  page?: number;
  count?: number;
  query?: string;
};

export async function getParts(query: PartsQuery = {}) {
  const searchParams = new URLSearchParams();

  if (query.page !== undefined) searchParams.set("page", String(query.page));
  if (query.count !== undefined) searchParams.set("count", String(query.count));
  if (query.query) searchParams.set("query", query.query);

  const queryString = searchParams.toString();
  const path = queryString ? `/parts?${queryString}` : "/parts";

  return api.get(path, partsResponseSchema);
}
