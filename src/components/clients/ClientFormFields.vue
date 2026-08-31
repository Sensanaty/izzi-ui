<template>
  <div class="grid gap-4 md:grid-cols-2">
    <IzziInput v-model="form.name" label="Name" :error="fieldError('name')" required />

    <IzziInput v-model="form.address" label="Address" :error="fieldError('address')" />

    <IzziInput v-model="form.number" label="Number" :error="fieldError('number')" />

    <IzziInput v-model="form.email" label="Email" :error="fieldError('email')" type="email" />
  </div>
</template>

<script setup lang="ts">
import IzziInput from "@/components/ui/IzziInput.vue";

export type ClientFormState = {
  name: string;
  address: string;
  number: string;
  email: string;
};

const props = withDefaults(defineProps<{ errors?: Record<string, string[]> }>(), {
  errors: () => ({}),
});
const form = defineModel<ClientFormState>({ required: true });

function fieldError(field: keyof ClientFormState): string | null {
  return props.errors[field]?.join(", ") ?? null;
}
</script>
