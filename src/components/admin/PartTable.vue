<template>
  <div class="flex flex-row">
    <TableMetadata class="ml-4" :search="partSearchPassed" />

    <div class="inline-flex ml-auto items-center">
      <button
        class="h-1/2 mt-auto bg-sky-700 border-l-2 border-neutral-800 py-1 px-3 hover:bg-sky-800 disabled:bg-sky-900 disabled:cursor-not-allowed"
        :disabled="!partSearchModel"
        @click.prevent="clearSearch"
      >
        Clear
      </button>

      <input
        ref="searchbar"
        v-model.trim="partSearchModel"
        type="text"
        placeholder="Part Number (CTRL/⌘ + K)"
        class="h-1/2 w-[250px] mt-auto px-3 py-2 text-sm text-black font-mono"
        @keydown.enter.prevent="searchPartNumber"
      >

      <button
        class="h-1/2 mt-auto mr-3 bg-sky-700 border-l-2 border-neutral-800 py-1 px-3 hover:bg-sky-800"
        @click.prevent="searchPartNumber"
      >
        Search
      </button>
    </div>
  </div>

  <table class="my-2 table-fixed w-[100%]">
    <TableHeader />
    <TableRow v-for="part in parts" :key="part.id" :part="part" />
  </table>

  <div class="flex flex-row mb-8">
    <TableMetadata class="ml-4" :search="partSearchPassed" />
  </div>
</template>

<script async lang="ts" setup>
  import { storeToRefs } from "pinia";
  import { onMounted, ref } from "vue";
  import usePartStore from "~/store/part";

  import TableRow from "~components/admin/table/TableRow.vue";
  import TableMetadata from "~components/admin/table/TableMetadata.vue";
  import TableHeader from "~components/admin/table/TableHeader.vue";

  const partStore = usePartStore();
  const count = ref(25);

  partStore.fetchParts(1, count.value);
  const { parts } = storeToRefs(partStore);

  const partSearchModel = ref("");
  const partSearchPassed = ref("");

  async function clearSearch() {
    partSearchModel.value = "";
    await searchPartNumber();
  }

  async function searchPartNumber() {
    partSearchPassed.value = partSearchModel.value;
    await partStore.fetchParts(1, count.value, partSearchModel.value);
  }

  const searchbar = ref<HTMLElement | null>(null);

  onMounted(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        searchbar?.value?.focus();
      }
    });
  });
</script>

<style>
  table, tr, td {
    @apply border border-gray-600 border-collapse;
  }
</style>
