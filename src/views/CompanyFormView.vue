<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <h1 class="font-bold text-3xl">New Company</h1>
      <p class="text-text-muted">Add a company for parts, contacts, and orders</p>
    </div>
    <RouterLink class="text-accent underline" :to="RoutePath.HOME">Back to parts</RouterLink>
  </div>

  <form
    class="bg-surface-raised border-border grid gap-6 rounded-sm border-2 p-4"
    novalidate
    @submit.prevent="submitForm"
  >
    <CompanyFormFields v-model="form" :errors="fieldErrors" />

    <div class="flex gap-2">
      <IzziButton type="submit" :disabled="isSaving">
        {{ isSaving ? "Saving..." : "Create company" }}
      </IzziButton>
      <IzziButton variant="secondary" :disabled="isSaving" @click="cancel">Cancel</IzziButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { createCompany } from "@/api/companies";
import CompanyFormFields from "@/components/companies/CompanyFormFields.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import { notifyApiError } from "@/lib/notifications";
import { RoutePath } from "@/router/constants";
import { useNotificationStore } from "@/stores/notification";

import type { CompanyFormState } from "@/components/companies/CompanyFormFields.vue";

const router = useRouter();
const { createNotification } = useNotificationStore();
const form = reactive<CompanyFormState>({
  name: "",
  address: "",
  city: "",
  country: "",
  website: "",
  subscription: "",
});
const fieldErrors = ref<Record<string, string[]>>({});
const isSaving = ref(false);

function validateForm(): boolean {
  if (form.name.trim()) {
    fieldErrors.value = {};

    return true;
  }

  fieldErrors.value = { name: ["is required"] };
  createNotification("Company name is required", { kind: "w" });

  return false;
}

function payload(): CompanyFormState {
  return {
    name: form.name.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    country: form.country.trim(),
    website: form.website.trim(),
    subscription: form.subscription.trim(),
  };
}

async function submitForm(): Promise<void> {
  if (!validateForm()) return;

  fieldErrors.value = {};
  isSaving.value = true;

  try {
    await createCompany({
      ...payload(),
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      country: form.country.trim() || null,
      website: form.website.trim() || null,
      subscription: form.subscription.trim() || null,
    });
    createNotification("Company created");
    await router.replace(RoutePath.HOME);
  } catch (error) {
    const details = notifyApiError(error, "Unable to create company");
    fieldErrors.value = details.fieldErrors;
  } finally {
    isSaving.value = false;
  }
}

function cancel(): void {
  void router.push(RoutePath.HOME);
}
</script>
