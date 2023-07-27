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
    },

    async updateCompany(payload: Company | Partial<Company>, create = false) {
      const { token } = useAuthStore();
      const headers = { "Authorization": token || window.localStorage.getItem("token") };

      try {
        const response = create ?
          await api.post("companies", payload, { headers }) :
          await api.patch(`companies/${payload.id}`, payload, { headers });

        this.activeCompany = response.data.data;

        return Promise.resolve(true);
      } catch (err: unknown) {
        catchResponse(err);

        return Promise.reject(err);
      }
    }
  }
})

export default useCompanyStore;
