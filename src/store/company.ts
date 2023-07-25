import { defineStore } from "pinia";

import catchResponse from "~/modules/catchResponse";
import { api } from "~/modules/fetch";
import useAuthStore from "~/store/auth";
import type Company from "~/types/store/company";

const useCompanyStore = defineStore("company", {
  state: () => {
    return {
      companies: [] as Company[],
      activeCompany: {} as Partial<Company>,
      fetched: false
    }
  },

  actions: {
    async fetchCompanies(query?: string) {
      const { token } = useAuthStore();

      try {
        const response = await api.get("companies", {
          headers: { "Authorization": token || window.localStorage.getItem("token") },
          params: { query }
        });

        this.companies = response.data.data;
        this.fetched = true;
      } catch (err: unknown) {
        this.fetched = false;
        catchResponse(err);
      }
    }
  }
})

export default useCompanyStore;
