<template>
  <div class="flex">
    <button :disabled="metadata.page === 1" class="btn" @click.prevent="fetchParts(1, metadata.count)">first</button>
    <button :disabled="!metadata.prev" class="btn" @click.prevent="fetchParts(metadata.prev, metadata.count)">previous</button>

    <input
      v-model="metadata.page"
      class="text-black p-0"
      type="number"
      min="1"
      :max="metadata.last"
      @blur="fetchParts(metadata.page, metadata.count)"
      @keydown.enter.prevent="fetchParts(metadata.page, metadata.count)"
    >

    <button :disabled="!metadata.next" class="btn" @click.prevent="fetchParts(metadata.next, metadata.count)">next</button>
    <button :disabled="metadata.last === metadata.page" class="btn" @click.prevent="fetchParts(metadata.last, metadata.count)">last</button>

    <select v-model.lazy.number="metadata.count" class="text-black" @change="setCount">
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  </div>
</template>

<script lang="ts" setup>
  import usePartStore from "~/store/part";
  import { storeToRefs } from "pinia";
  import RequestMetadata from "~/types/requestMetadata";

  const partStore = usePartStore();
  const { metadata } = storeToRefs(partStore);

  async function fetchParts(page: RequestMetadata["page"] | null, count: RequestMetadata["count"]) {
    if (!page) { return; }

    await partStore.fetchParts(page, count);
  }

  async function setCount() {
    localStorage.setItem("partCountParam", String(metadata.value.count));

    await fetchParts(metadata.value.page, metadata.value.count);
  }
</script>

<style scoped>
  .btn {
    @apply bg-amber-700 border-l-2 border-neutral-800 py-1 px-3 hover:bg-amber-800 disabled:bg-amber-900;
  }
</style>
