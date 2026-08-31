<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <h1 class="font-bold text-3xl">
        {{ isEditing ? `Edit company ${companyId}` : "New company" }}
      </h1>

      <p class="text-text-muted">
        {{
          isEditing ? "Update the company record" : "Add a company for parts, contacts, and orders"
        }}
      </p>
    </div>

    <RouterLink class="text-accent underline" :to="RoutePath.COMPANIES">
      Back to companies
    </RouterLink>
  </div>

  <p v-if="loadError" class="text-danger" role="alert">{{ loadError }}</p>

  <form
    class="bg-surface-raised border-border grid gap-6 rounded-sm border-2 p-4"
    novalidate
    @submit.prevent="submitForm"
  >
    <CompanyFormFields v-model="form" :errors="fieldErrors" />

    <div class="flex gap-2">
      <IzziButton type="submit" :disabled="isSaving || isLoading">
        {{ isSaving ? "Saving..." : isEditing ? "Save changes" : "Create company" }}
      </IzziButton>
      <IzziButton variant="secondary" :disabled="isSaving" @click="cancel">Cancel</IzziButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { createCompany, getCompany, updateCompany } from "@/api/companies";
import CompanyFormFields from "@/components/companies/CompanyFormFields.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import { notifyApiError } from "@/lib/notifications";
import { Route, RoutePath } from "@/router/constants";
import { useNotificationStore } from "@/stores/notification";

import type { CompanyPayload } from "@/api/companies";
import type { CompanyFormState } from "@/components/companies/CompanyFormFields.vue";

const route = useRoute();
const router = useRouter();
const { createNotification } = useNotificationStore();
const companyId = computed(() => Number(route.params.id));
const isEditing = computed(() => route.name === Route.COMPANY_EDIT);
const isLoading = ref(false);
const isSaving = ref(false);
const loadError = ref<string | null>(null);
const fieldErrors = ref<Record<string, string[]>>({});
const form = reactive<CompanyFormState>(emptyForm());

function emptyForm(): CompanyFormState {
  return { name: "", address: "", city: "", country: "", website: "", subscription: "" };
}

function setForm(company: Awaited<ReturnType<typeof getCompany>>): void {
  Object.assign(form, {
    name: company.name,
    address: company.address ?? "",
    city: company.city ?? "",
    country: company.country ?? "",
    website: company.website ?? "",
    subscription: company.subscription ?? "",
  });
}

function resetForm(): void {
  Object.assign(form, emptyForm());
  fieldErrors.value = {};
  loadError.value = null;
}

async function loadCompany(): Promise<void> {
  if (!isEditing.value) {
    isLoading.value = false;

    return;
  }

  const requestedCompanyId = companyId.value;

  if (!Number.isInteger(requestedCompanyId) || requestedCompanyId < 1) {
    loadError.value = "Invalid company ID";
    isLoading.value = false;

    return;
  }

  isLoading.value = true;

  try {
    const company = await getCompany(requestedCompanyId);

    if (!isEditing.value || companyId.value !== requestedCompanyId) return;

    setForm(company);
  } catch (error) {
    if (isEditing.value && companyId.value === requestedCompanyId) {
      loadError.value = notifyApiError(error, "Unable to load company").message;
    }
  } finally {
    if (isEditing.value && companyId.value === requestedCompanyId) {
      isLoading.value = false;
    }
  }
}

function validateForm(): boolean {
  if (form.name.trim()) {
    fieldErrors.value = {};

    return true;
  }

  fieldErrors.value = { name: ["is required"] };
  createNotification("Company name is required", { kind: "w" });

  return false;
}

function payload(): CompanyPayload {
  return {
    name: form.name.trim(),
    address: form.address.trim() || null,
    city: form.city.trim() || null,
    country: form.country.trim() || null,
    website: form.website.trim() || null,
    subscription: form.subscription.trim() || null,
  };
}

async function submitForm(): Promise<void> {
  if (!validateForm()) return;

  isSaving.value = true;
  fieldErrors.value = {};

  try {
    if (isEditing.value) {
      await updateCompany(companyId.value, payload());
    } else {
      await createCompany(payload());
    }

    createNotification(isEditing.value ? "Company updated" : "Company created");
    await router.replace(RoutePath.COMPANIES);
  } catch (error) {
    const details = notifyApiError(
      error,
      isEditing.value ? "Unable to update company" : "Unable to create company",
    );
    fieldErrors.value = details.fieldErrors;
  } finally {
    isSaving.value = false;
  }
}

function cancel(): void {
  void router.push(RoutePath.COMPANIES);
}

watch(
  () => [route.name, route.params.id],
  () => {
    resetForm();
    void loadCompany();
  },
  { immediate: true },
);
</script>
