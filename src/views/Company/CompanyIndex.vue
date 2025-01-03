<template>
  <div class="flex flex-col gap-x-2 gap-y-3.5 md:grid-cols-2">
    <FormField
      id="filterCompanies"
      v-model="companyStore.nameFilter"
      label="Filter companies by name"
      class="mb-2 w-fit"
    />

    <CompanyCard
      v-for="company in companyStore.filteredCompanies"
      :key="company.id"
      :company="company"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import useCompanyStore from "@/stores/company.ts";
import CompanyCard from "@/components/Company/CompanyCard.vue";
import FormField from "@/components/Base/Form/FormField.vue";

const companyStore = useCompanyStore();

onBeforeMount(async () => {
  await companyStore.getAllCompanies();
});
</script>
