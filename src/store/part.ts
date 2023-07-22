import { defineStore } from "pinia";
import { api } from "~/modules/fetch";
import useAuthStore from "~/store/auth";
import catchResponse from "~/modules/catchResponse";

import type Part from "~/types/store/part";
import type RequestMetadata from "~/types/requestMetadata";

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

      try {
        const response = await api.get("parts", {
          headers: {
            "Authorization": token || window.localStorage.getItem("token")
          },
          params: {
            count: count,
            page: page,
          }
        });

        this.parts = response.data.data;

        const metadataValues = response.data.metadata;
        this.metadata = {
          count,
          page,
          from:  metadataValues.from,
          last:  metadataValues.last,
          next:  metadataValues.next,
          prev:  metadataValues.prev,
          to:    metadataValues.to,
          total: metadataValues.total,
        }
      } catch (err: unknown) {
        catchResponse(err)
      }
    }
  },
});

export default usePartStore;
