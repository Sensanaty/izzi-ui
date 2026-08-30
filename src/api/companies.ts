import { z } from "zod";
import { api } from "@/lib/api";

const companySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const companiesResponseSchema = z.object({
  data: z.array(companySchema),
});

export type Company = z.infer<typeof companySchema>;

export async function getCompanies(): Promise<Company[]> {
  const response = await api.get("/companies", companiesResponseSchema);

  return response.data;
}
