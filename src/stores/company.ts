import { defineStore } from "pinia";
import useFetch from "@/composables/useFetch.ts";
import { ref } from "vue";
import type { Company, CreateOrUpdateCompany } from "@/schemas";

type WrappedResponse<T> = {
  data: T;
  token?: string;
};

const COMPANY_URL = "/companies";
const COMPANY_ID_URL = (id: Company["id"]) => `${COMPANY_URL}/${id}`;

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

const useCompanyStore = defineStore("company", () => {
  const { fetch, isFetching, hasErrored, hasFetched } = useFetch();

  const companies = ref<Company[]>([]);
  const lastFetched = ref<Date | null>(null);

  async function getAllCompanies(force?: boolean) {
    const now = new Date();

    if (force || !lastFetched.value || now.getTime() - lastFetched.value?.getTime() > CACHE_DURATION) {
      const response = await fetch<WrappedResponse<Company[]>>(COMPANY_URL, "GET");

      lastFetched.value = now;
      companies.value = response.data;
    }
  }

  async function createCompany(data: CreateOrUpdateCompany) {
    const response = await fetch<Company>(COMPANY_URL, "POST", { data, successMessage: "Company created" });
    companies.value.unshift(response);
  };

  async function updateCompany(companyId: Company["id"], data: CreateOrUpdateCompany) {
    const response = await fetch<Company>(COMPANY_ID_URL(companyId), "PUT", { data, successMessage: "Company updated" });

    const companyIndex = companies.value.findIndex(({ id }) => id === companyId);

    if (companyIndex > -1) {
      companies.value[companyIndex] = response;
    }
  }

  return {
    companies,

    isFetching,
    hasErrored,
    hasFetched,

    getAllCompanies,
    createCompany,
    updateCompany,
  };
});

export default useCompanyStore;
