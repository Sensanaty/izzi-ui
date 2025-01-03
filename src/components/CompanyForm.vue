<template>
  <form class="mx-auto w-full max-w-6xl rounded-md border bg-neutral-900 px-3 py-2 md:max-w-2xl">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <ul v-if="Object.keys(errors).length > 0" class="mb-4 break-words text-red-500">
        <li v-for="(error, key) in errors" :key="error" class="list-white ml-4 list-outside marker:text-white">
          {{ labelize(key) }}: {{ error }}
        </li>
      </ul>
    </Transition>

    <div class="flex w-full flex-col gap-y-2">
      <FormField id="companyName" v-model="form.name" :invalid="!!errors?.name" label-class="min-w-20" label="Name" />

      <FormField id="address" v-model="form.address" :invalid="!!errors?.address" label-class="min-w-20" label="Address" />

      <FormField id="city" v-model="form.city" :invalid="!!errors?.city" label-class="min-w-20" label="City" />

      <FormField id="country" v-model="form.country" :invalid="!!errors?.country" label-class="min-w-20" label="Country" />

      <FormField id="website" v-model="form.website" :invalid="!!errors?.website" label-class="min-w-20" label="Website" />
    </div>

    <div class="mt-4 flex justify-center gap-4">
      <BaseButton :disabled="companyStore.isFetching" @click="handleSubmit">
        {{ isCreatePage ? 'Create' : 'Update' }}
      </BaseButton>

      <BaseButton @click.prevent="resetForm">
        Reset
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, toRaw, watch } from "vue";
import { labelize } from "@/utils/stringUtils.ts";
import extractDefaults, { useZodValidation } from "@/utils/zodUtils.ts";
import useCompanyStore from "@/stores/company.ts";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { type CreateOrUpdateCompany, CreateOrUpdateCompanySchema } from "@/schemas";
import FormField from "@/components/Base/Form/FormField.vue";

const props = defineProps<{
  isCreatePage: boolean;
  isQuickAdd?: boolean;
}>();

const route = useRoute();

const companyStore = useCompanyStore();
const form = ref<CreateOrUpdateCompany>(props.isCreatePage ? extractDefaults(CreateOrUpdateCompanySchema) : companyStore.currentCompany);

watch(() => companyStore.currentCompany.id, () => form.value = structuredClone(toRaw(companyStore.currentCompany)));

onBeforeRouteLeave(() => {
  companyStore.clearCurrentCompany();
  form.value = structuredClone(toRaw(companyStore.currentCompany));
});

const { errors, validate } = useZodValidation(CreateOrUpdateCompanySchema);

async function handleSubmit() {
  if (!validate(form.value)) return;

  try {
    if (!props.isCreatePage && !!route.params.id) {
      await companyStore.updateCompany(Number(route.params.id), form.value);
    } else {
      await companyStore.createCompany(form.value);
    }
  } catch (e) {
    console.error("Form submission failed:", e);
  }
}

function resetForm() {
  form.value = structuredClone(toRaw(companyStore.currentCompany));
  errors.value = {};
}
</script>
