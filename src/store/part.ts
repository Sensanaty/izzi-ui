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

        const metadataValues = response.data.metadata;
        this.metadata = {
          count,
          page,
          from: metadataValues.from,
          last: metadataValues.last,
          next: metadataValues.next,
          prev: metadataValues.prev,
          to:   metadataValues.to,
        }
      } catch (err: unknown) {
        catchResponse(err)
      }
    }
  },
});

export default usePartStore;
