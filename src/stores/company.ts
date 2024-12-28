import { defineStore } from "pinia";
import useFetch from "@/composables/useFetch.ts";
import { computed, ref } from "vue";
import fuzzysort from "fuzzysort";
import type { Company, CreateOrUpdateCompany, Part } from "@/schemas";

type WrappedResponse<T> = {
  data: T;
  token?: string;
};

const COMPANY_URL = "/companies";
const COMPANY_ID_URL = (id: Company["id"]) => `${COMPANY_URL}/${id}`;
const COMPANY_PARTS_URL = (id: Company["id"]) => `${COMPANY_ID_URL(id)}/parts`;

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

const useCompanyStore = defineStore("company", () => {
  const { fetch, isFetching, hasErrored, hasFetched } = useFetch();

  const companies = ref<Company[]>([]);
  const lastFetched = ref<Date | null>(null);

  const nameFilter = ref("");

  const filteredCompanies = computed<Company[]>(() => {
    if (!nameFilter.value) {
      return companies.value;
    }

    return fuzzysort
      .go(nameFilter.value, companies.value, { key: "name" })
      .map(({ obj }) => obj);
  });

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

  async function deleteCompany(companyId: Company["id"]) {
    await fetch(COMPANY_ID_URL(companyId), "DELETE", { successMessage: "Company deleted" });

    const index = companies.value.findIndex(({ id }) => id === companyId);

    if (index > -1) {
      companies.value.splice(index, 1);
    }
  }

  async function fetchParts(companyId: Company["id"]) {
    const response = await fetch<Part[]>(COMPANY_PARTS_URL(companyId), "GET");
    return response;
  }

  return {
    companies,
    filteredCompanies,

    isFetching,
    hasErrored,
    hasFetched,

    nameFilter,

    getAllCompanies,
    createCompany,
    updateCompany,
    deleteCompany,

    fetchParts,
  };
});

export default useCompanyStore;
