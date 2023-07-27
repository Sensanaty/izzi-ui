import dayjs from "dayjs";
import { defineStore } from "pinia";

import catchResponse from "~/modules/catchResponse";
import { api } from "~/modules/fetch";
import useAuthStore from "~/store/auth";
import type RequestMetadata from "~/types/requestMetadata";
import type Part from "~/types/store/part";

const usePartStore = defineStore("part", {
  state: () => {
    return {
      parts: [] as Part[],
      metadata: {} as RequestMetadata,
      activePart: {} as Partial<Part>,
    };
  },

  actions: {
    async fetchParts(
      page: RequestMetadata["page"] = 1,
      count: RequestMetadata["count"] = 25,
      query?: string
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
            query: query
          }
        });

        this.parts = response.data.data;

        this.parts.forEach(part => {
          part.added = dayjs(part.added).format("DD/MM/YYYY");
        })

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
        catchResponse(err);
      }
    },

    async fetchPart(id: Part["id"]) {
      const { token } = useAuthStore();

      try {
        const response = await api.get(`parts/${id}`, {
          headers: {
            "Authorization": token || window.localStorage.getItem("token")
          }
        });

        this.activePart = response.data.data;
      } catch(err: unknown) {
        catchResponse(err);
      }
    },

    async updatePart(payload: Part | Partial<Part>, create = false) {
      const { token } = useAuthStore();
      const headers = { "Authorization": token || window.localStorage.getItem("token") }

      try {
        const response = create ?
          await api.post("parts", payload, { headers }) :
          await api.patch(`parts/${payload.id}`, payload,{ headers });

        this.activePart = response.data.data;

        return Promise.resolve(true)
      } catch(err: unknown) {
        catchResponse(err);

        return Promise.reject(err);
      }
    },

    resetPart() {
      this.activePart = {};
    }
  },
});

export default usePartStore;
