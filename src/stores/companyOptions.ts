import { ref } from "vue";
import { defineStore } from "pinia";
import { getCompanies } from "@/api/companies";

import type { Company } from "@/lib/schemas/company";

export const useCompanyOptionsStore = defineStore("companyOptions", () => {
  const companies = ref<Company[]>([]);
  const isLoading = ref(false);
  const hasLoaded = ref(false);

  let loadPromise: Promise<Company[]> | null = null;

  async function loadCompanies(): Promise<Company[]> {
    if (hasLoaded.value) return companies.value;

    loadPromise ??= (async () => {
      isLoading.value = true;

      try {
        companies.value = await getCompanies();
        hasLoaded.value = true;

        return companies.value;
      } finally {
        isLoading.value = false;
        loadPromise = null;
      }
    })();

    return loadPromise;
  }

  function upsertCompany(company: Company): void {
    if (!hasLoaded.value) return;

    const existingCompany = companies.value.some(({ id }) => id === company.id);
    const nextCompanies = existingCompany
      ? companies.value.map((existing) => (existing.id === company.id ? company : existing))
      : [...companies.value, company];

    companies.value = nextCompanies.sort((left, right) => left.name.localeCompare(right.name));
  }

  function removeCompany(id: number): void {
    if (!hasLoaded.value) return;

    companies.value = companies.value.filter((company) => company.id !== id);
  }

  function clearCompanies(): void {
    companies.value = [];
    hasLoaded.value = false;
  }

  return { companies, isLoading, loadCompanies, upsertCompany, removeCompany, clearCompanies };
});
