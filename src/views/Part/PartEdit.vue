<template>
  <h1 v-if="isCreatePage" class="mb-2.5 text-2xl font-bold">
    Creating new Part
  </h1>

  <h1 v-else class="mb-2.5 text-2xl font-bold">
    Editing Part <span class="font-mono">{{ route.params.id }}</span>
  </h1>

  <PartForm :is-create-page="isCreatePage" />
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import PartForm from "@/components/PartForm.vue";
import usePartsStore from "@/stores/parts.ts";

const route = useRoute();

const partStore = usePartsStore();
const isCreatePage = computed(() => !!route.meta?.isCreatePage);

onBeforeMount(async () => {
  if (!isCreatePage.value && route.params.id) {
    await partStore.getPart(Number(route.params.id));
  }
});
</script>
