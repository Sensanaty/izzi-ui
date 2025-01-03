<template>
  <h1 v-if="isCreatePage" class="mb-2.5 text-2xl font-bold">
    Creating new Company
  </h1>

  <h1 v-else class="mb-2.5 text-2xl font-bold">
    Editing Company <span class="font-mono">{{ route.params.id }}</span>
  </h1>

  <CompanyForm :is-create-page="isCreatePage" />
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import CompanyForm from "@/components/CompanyForm.vue";
import useCompanyStore from "@/stores/company.ts";

const route = useRoute();

const companyStore = useCompanyStore();
const isCreatePage = computed(() => !!route.meta?.isCreatePage);

onBeforeMount(async () => {
  if (!isCreatePage.value && route.params.id) {
    await companyStore.getCompany(Number(route.params.id));
  }
});
</script>
