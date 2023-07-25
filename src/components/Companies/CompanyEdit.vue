<template>
  <div class="flex flex-col w-full font-mono">
    <div class="flex flex-row mb-3">
      <label for="name">Name</label>
      <input id="name" v-model="localCompany.name">
    </div>

    <div class="flex flex-row mb-3">
      <label for="email">Email</label>
      <input id="email" v-model="localCompany.email" type="text">
    </div>

    <div class="flex flex-row mb-3">
      <label for="address">Address</label>
      <input id="address" v-model="localCompany.address" type="text">
    </div>

    <div class="flex flex-row mb-3">
      <label for="number">Number</label>
      <input id="number" v-model="localCompany.number" type="text">
    </div>

    <div class="flex flex-row mb-3">
      <label for="city">City</label>
      <input id="city" v-model="localCompany.city" type="text">
    </div>

    <div class="flex flex-row mb-3">
      <label for="country">Country</label>
      <input id="country" v-model="localCompany.country" type="text">
    </div>

    <div class="flex flex-row mb-3">
      <label for="website">Website</label>
      <input id="website" v-model="localCompany.website" type="text">
    </div>

    <div class="flex flex-row mb-3">
      <label for="type">Type</label>
      <input id="type" v-model="localCompany.type" type="text">
    </div>

    <BaseButton class="w-fit mx-auto">Save</BaseButton>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, toRef } from "vue";

  import useCompanyStore from "~/store/company";
  import BaseButton from "~components/base/BaseButton.vue";

  const company = useCompanyStore().activeCompany;
  const localCompany = toRef({ ...company });

  const props = defineProps<{
    isNew: boolean
  }>();

  onBeforeUnmount(() => {
    useCompanyStore().activeCompany = {};
  });
</script>

<style scoped>
label {
  @apply bg-stone-800 px-2 py-1 mr-3 min-w-[100px];
}

input {
  @apply text-black w-full px-2 py-1;
}
</style>
