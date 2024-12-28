<template>
  <div class="grid auto-rows-auto grid-cols-3 gap-x-2 gap-y-3.5 md:grid-cols-2">
    <CompanyCard
      v-for="company in companyStore.companies"
      :key="company.id"
      :company="company"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import useCompanyStore from "@/stores/company.ts";
import CompanyCard from "@/components/Company/CompanyCard.vue";

const companyStore = useCompanyStore();

onBeforeMount(async () => {
  await companyStore.getAllCompanies();
});
</script>
