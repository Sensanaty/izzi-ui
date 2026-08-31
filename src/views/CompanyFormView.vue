<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <h1 class="font-bold text-3xl">{{ isEditing ? `Edit company ${companyId}` : "New company" }}</h1>
      <p class="text-text-muted">
        {{ isEditing ? "Update the company record" : "Add a company for parts, contacts, and orders" }}
      </p>
    </div>
    <RouterLink class="text-accent underline" :to="RoutePath.COMPANIES">Back to companies</RouterLink>
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
import { computed, onMounted, reactive, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { createCompany, getCompany, updateCompany } from "@/api/companies";

import type { CompanyPayload } from "@/api/companies";
import CompanyFormFields from "@/components/companies/CompanyFormFields.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import { notifyApiError } from "@/lib/notifications";
import { Route, RoutePath } from "@/router/constants";
import { useNotificationStore } from "@/stores/notification";

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

async function loadCompany(): Promise<void> {
  if (!isEditing.value) return;

  if (!Number.isInteger(companyId.value) || companyId.value < 1) {
    loadError.value = "Invalid company ID";

    return;
  }

  isLoading.value = true;
  loadError.value = null;

  try {
    setForm(await getCompany(companyId.value));
  } catch (error) {
    loadError.value = notifyApiError(error, "Unable to load company").message;
  } finally {
    isLoading.value = false;
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

onMounted(() => void loadCompany());
</script>
