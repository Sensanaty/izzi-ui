<template>
  <Dropdown
    v-model="selectedCompany"
    :options="companyStore.companies"
    placeholder="Search for company name"
    option-label="name"
    :filter="true"
  />
</template>

<script lang="ts" setup>
  import Dropdown from "primevue/dropdown";
  import { onMounted, ref, toRef, watch } from "vue";

  import useCompanyStore from "~/store/company";
  import usePartStore from "~/store/part";
  import Company from "~/types/store/company";

  const companyStore = useCompanyStore();
  const { activePart } = usePartStore();

  const emits = defineEmits(["setCompany"]);

  onMounted(async () => {
    await companyStore.fetchCompanies();
  });

  const companies = toRef([ ...companyStore.companies ]);
  const selectedCompany = ref({
    ...(companies.value.find(company => company.id === activePart.company_id))
  });

  // @ts-ignore
  watch(selectedCompany, (current: Company) => {
    emits("setCompany", current.id);
  });
</script>
