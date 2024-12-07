<template>
  <div class="flex flex-col">
    <BaseInput
      id="part-search-top"
      v-model="partNumberQuery"
      size="xsmall"
      class="w-fit whitespace-nowrap"
      label="Search Part Number"
      @blur="getByPartNumber"
      @keydown.enter.prevent="getByPartNumber"
      @keydown.esc="clearPartNumber"
    />

    <TableMetadata
      :metadata="partStore.metadata"
      :is-fetching="partStore.isFetching"
      rounded-top
      @goto="partStore.getPage"
      @navigate="navigatePages"
    />

    <PartData :parts="partStore.parts" />

    <TableMetadata
      :metadata="partStore.metadata"
      :is-fetching="partStore.isFetching"
      @goto="partStore.getPage"
      @navigate="navigatePages"
    />

    <BaseInput
      id="part-search-bottom"
      v-model="partNumberQuery"
      size="xsmall"
      class="w-fit whitespace-nowrap"
      label="Search Part Number"
      @blur="getByPartNumber"
      @keydown.enter.prevent="getByPartNumber"
      @keydown.esc="clearPartNumber"
    />
  </div>
</template>

<script setup lang="ts">
import TableMetadata from "@/components/Table/TableMetadata.vue";
import usePartsStore from "@/stores/parts.ts";
import { onBeforeMount, ref } from "vue";
import useQueryBuilder from "@/composables/useQueryBuilder.ts";
import { storeToRefs } from "pinia";
import PartData from "@/components/Table/Parts/PartData.vue";
import { useRoute } from "vue-router";

const partStore = usePartsStore();
const { currentParams } = storeToRefs(partStore);
const queryBuilder = useQueryBuilder(currentParams);

onBeforeMount(() => {
  partStore.getAllParts(queryBuilder.getCurrentQueryParams());
});

const partNumberQuery = ref((useRoute()?.query?.query as string) ?? "");

function getByPartNumber() {
  partStore.getAllParts({ count: currentParams.value.count, page: 1, query: partNumberQuery.value });
}

function clearPartNumber() {
  partStore.getAllParts({ count: currentParams.value.count, page: 1, query: "" });
}

function navigatePages(direction: "first" | "prev" | "next" | "last") {
  switch (direction) {
    case "first":
      partStore.getFirstPage();
      break;
    case "next":
      partStore.getNextPage();
      break;
    case "prev":
      partStore.getPreviousPage();
      break;
    case "last":
      partStore.getLastPage();
      break;
  }
}
</script>
