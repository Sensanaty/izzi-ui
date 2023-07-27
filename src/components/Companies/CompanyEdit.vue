<template>
  <div class="flex flex-col w-full font-mono">
    <div class="flex flex-row mb-3">
      <label for="name">Name</label>
      <input id="name" v-model="localCompany.name">
    </div>

    <div class="flex flex-row mb-3">
      <label for="address">Address</label>
      <input id="address" v-model="localCompany.address" type="text">
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

    <BaseButton class="w-fit mx-auto" @click.prevent="saveCompany">Save</BaseButton>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, toRef } from "vue";

  import useCompanyStore from "~/store/company";
  import useNotificationStore from "~/store/notification";
  import BaseButton from "~components/base/BaseButton.vue";

  const notification = useNotificationStore();

  const company = useCompanyStore().activeCompany;
  const localCompany = toRef({ ...company });

  const emits = defineEmits(['closeModal']);

  const props = defineProps<{
    isNew: boolean
  }>();

  onBeforeUnmount(() => {
    useCompanyStore().activeCompany = {};
  });

  async function saveCompany() {
    await useCompanyStore().updateCompany(localCompany.value, props.isNew).then(() => {
      notification.createNotification("Company successfuly saved", "succ");
    }).then(() => {
      if (props.isNew) {
        useCompanyStore().fetchCompanies();
      }

      emits("closeModal");
    });
  }
</script>

<style scoped>
label {
  @apply bg-stone-800 px-2 py-1 mr-3 min-w-[100px];
}

input {
  @apply text-black w-full px-2 py-1;
}
</style>
