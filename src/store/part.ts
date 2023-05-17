import { defineStore } from "pinia";
import { api } from "~/modules/fetch";
import useAuthStore from "~/store/auth";
import Part from "~/types/store/part";
import RequestMetadata from "~/types/requestMetadata";
import catchResponse from "~/modules/catchResponse";

const usePartStore = defineStore("part", {
  state: () => {
    return {
      parts: [] as Part[],
      metadata: {} as RequestMetadata
    };
  },
  actions: {
    async fetchParts(
      page: RequestMetadata["page"] = 1,
      count: RequestMetadata["count"] = 25
    ) {
      const { token } = useAuthStore();

      const response = await api.get("parts", {
        headers: {
          "Authorization": token || window.localStorage.getItem("token")
        },
        params: {
          count: count,
          page: page
        }
      });

      try {
        this.parts = response.data.data;
        this.metadata = {
          count,
          page,
          from: response.data.metadata.from,
          last: response.data.metadata.last,
          next: response.data.metadata.next,
          prev: response.data.metadata.prev,
          to:   response.data.metadata.to,
        }
        this.metadata = response.data.metadata;
      } catch (err: unknown) {
        catchResponse(err)
      }
    }
  },
});

export default usePartStore;
