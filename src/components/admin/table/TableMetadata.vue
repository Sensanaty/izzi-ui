<template>
  <div class="flex flex-col items-center w-[600px]">
    <div class="container">
      <div class="flex flex-row items-center justify-end">
        <button tabindex="-1" class="btn" @click.prevent="fetchParts(1, metadata.count, 'first')">first</button>
        <button tabindex="-1" class="btn" @click.prevent="fetchParts(metadata.prev, metadata.count, 'prev')">previous</button>
      </div>

      <input
        v-model="metadata.page"
        tabindex="-1"
        class="flex text-black p-0 mx-1 text-center w-[60px] h-full"
        @blur="fetchParts(metadata.page, metadata.count, 'page')"
        @keydown.enter.prevent="fetchParts(metadata.page, metadata.count, 'page')"
      >

      <div class="flex flex-row items-center">
        <button tabindex="-1" class="btn" @click.prevent="fetchParts(metadata.next, metadata.count, 'next')">next</button>
        <button tabindex="-1" class="btn" @click.prevent="fetchParts(metadata.last, metadata.count, 'last')">last</button>
      </div>
    </div>

    <div class="flex flex-row items-center mr-auto">
      <select v-model.lazy.number="metadata.count" tabindex="-1" class="text-black mr-3 px-1 w-12 text-center" @change="setCount">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <p class="font-mono">Showing {{ metadata.from }} to {{ metadata.to }} of {{ metadata.total }} total, page {{ metadata.page }} of {{ metadata.last }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useEventListener } from "@vueuse/core";
  import { storeToRefs } from "pinia";
  import { onBeforeUnmount,ref } from "vue";

  import usePartStore from "~/store/part";
  import RequestMetadata from "~/types/requestMetadata";

  type FetchType = "prev" | "next" | "first" | "last" | "page";

  const partStore = usePartStore();
  const { metadata } = storeToRefs(partStore);

  const props = defineProps<{
    search?: string
  }>();

  async function fetchParts(page: RequestMetadata["page"] | null, count: RequestMetadata["count"], fetchType: FetchType) {
    if (!page || !shouldFetch(fetchType)) { return; }

    isFetching.value = true;

    await partStore.fetchParts(page, count, props.search).then(() => isFetching.value = false);
  }

  function shouldFetch(fetchType: FetchType): boolean {
    if (isFetching.value) { return false; }

    switch (fetchType) {
    case "first":
      return metadata.value.page !== 1;
    case "last":
      return metadata.value.last !== metadata.value.page;
    case "next":
      return !!metadata.value.next;
    case "prev":
      return !!metadata.value.prev;
    case "page":
      return true;
    }
  }

  async function setCount() {
    await fetchParts(metadata.value.page, metadata.value.count, "page");
  }

  const isFetching = ref(false);

  async function setNavigationListeners(event: KeyboardEvent) {
    if (!document.activeElement?.matches("input") && event.shiftKey) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        await fetchParts(metadata.value.next, metadata.value.count, "next");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        await fetchParts(metadata.value.prev, metadata.value.count, "prev");
      }
    }
  }

  const unregisterListener = useEventListener(document, "keydown", (e: KeyboardEvent) => setNavigationListeners(e));

  onBeforeUnmount(() => unregisterListener());
</script>

<style scoped>
  .container {
    @apply grid mb-4 w-fit mr-auto;
    grid-template: 1fr / 2fr 0.5fr 2fr ;
  }

  .btn {
    @apply bg-sky-700 border-l-2 border-neutral-800 py-1 px-3 hover:bg-sky-800;
  }
</style>
