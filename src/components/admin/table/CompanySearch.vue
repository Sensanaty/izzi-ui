<template>
  <Dropdown
    v-model="selectedCompany"
    :options="companyStore.companies"
    :placeholder="activePart.company_name"
    option-label="name"
    class="w-[400px] bg-white text-black"
    filter
    :pt="{
      filterIcon: (options) => ({
        style: {
          'display': 'none'
        }
      })
    }"
  >
    <template #option="slotProps">
      <div class="flex flex-row text-black bg-white py-2 px-1 border-y border-collapse border-gray-600 hover:bg-stone-200 font-mono transition-none">
        <h1>{{ slotProps.option.name }}</h1>
      </div>
    </template>
  </Dropdown>
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

<style>
.p-dropdown-trigger {
  @apply px-2;
}

.p-dropdown {
  @apply text-black px-3 py-0.5 border-4 border-transparent;
}

.p-dropdown-items {
  @apply p-2;
}

.p-dropdown-filter-container {
  @apply flex flex-row border-b h-full border-gray-600 text-black w-full;
}

.p-dropdown-filter {
  @apply bg-white w-full py-2 px-1 ;
}

.p-dropdown-empty-message {
  @apply bg-white text-black;
}
</style>
