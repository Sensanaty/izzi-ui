<template>
  <div class="grid gap-4 md:grid-cols-2">
    <IzziInput v-model="form.name" label="Name" :error="fieldError('name')" required />

    <IzziInput v-model="form.address" label="Address" :error="fieldError('address')" />

    <IzziInput v-model="form.city" label="City" :error="fieldError('city')" />

    <IzziInput v-model="form.country" label="Country" :error="fieldError('country')" />

    <IzziInput v-model="form.website" label="Website" :error="fieldError('website')" type="url" />

    <IzziInput
      v-model="form.subscription"
      label="Subscription"
      :error="fieldError('subscription')"
    />
  </div>
</template>

<script setup lang="ts">
import IzziInput from "@/components/ui/IzziInput.vue";

export type CompanyFormState = {
  name: string;
  address: string;
  city: string;
  country: string;
  website: string;
  subscription: string;
  needsCleanup?: boolean;
};

type Props = {
  errors?: Record<string, string[]>;
};

const props = withDefaults(defineProps<Props>(), { errors: () => ({}) });

const form = defineModel<CompanyFormState>({ required: true });

function fieldError(field: keyof CompanyFormState): string | null {
  return props.errors[field]?.join(", ") ?? null;
}
</script>
