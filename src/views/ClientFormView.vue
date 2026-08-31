<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <h1 class="font-bold text-3xl">
        {{ isEditing ? `Edit contact ${clientId}` : "New contact" }}
      </h1>
      <p class="text-text-muted">
        {{ isEditing ? "Update the contact record" : "Add a contact to a company" }}
      </p>
    </div>
    <RouterLink class="text-accent underline" :to="{ path: RoutePath.CLIENTS, query: route.query }">
      Back to contacts
    </RouterLink>
  </div>

  <p v-if="loadError" class="text-danger" role="alert">{{ loadError }}</p>

  <form class="grid gap-6" novalidate @submit.prevent="submitForm">
    <section class="bg-surface-raised border-border grid gap-4 rounded-sm border-2 p-4">
      <h2 class="font-bold text-xl">Contact details</h2>
      <ClientFormFields v-model="form" :errors="fieldErrors" />
      <div class="grid content-start gap-1">
        <span id="client-company-label" class="font-bold">
          Company <sup aria-hidden="true">*</sup><span class="sr-only">(required)</span>
        </span>
        <IzziDropdown
          id="client-company"
          v-model="companyId"
          aria-labelledby="client-company-label"
          :options="companyOptions"
          placeholder="Select a company"
          searchable
          search-label="companies"
          virtualize
          :disabled="isSaving || isLoading"
          :error="fieldErrors.company_id?.join(', ') ?? null"
        />
        <span v-if="!isLoading && !companies.length" class="text-danger" role="alert">
          No companies are available
        </span>
      </div>
    </section>

    <div class="flex flex-wrap gap-2">
      <IzziButton type="submit" :disabled="isSaving || isLoading">
        {{ isSaving ? "Saving..." : isEditing ? "Save changes" : "Create contact" }}
      </IzziButton>
      <IzziButton variant="secondary" :disabled="isSaving" @click="cancel">Cancel</IzziButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { createClient, getClient, updateClient } from "@/api/clients";
import ClientFormFields from "@/components/clients/ClientFormFields.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziDropdown from "@/components/ui/IzziDropdown.vue";
import { notifyApiError } from "@/lib/notifications";
import { Route, RoutePath } from "@/router/constants";
import { useCompanyOptionsStore } from "@/stores/companyOptions";

import type { ClientFormState } from "@/components/clients/ClientFormFields.vue";

const route = useRoute();
const router = useRouter();
const isEditing = computed(() => route.name === Route.CLIENT_EDIT);
const clientId = computed(() => Number(route.params.id));
const form = reactive<ClientFormState>({ name: "", address: "", number: "", email: "" });
const companyId = ref("");
const companyOptionsStore = useCompanyOptionsStore();
const { companies } = storeToRefs(companyOptionsStore);

const companyOptions = computed(() =>
  companies.value.map((company) => ({ value: String(company.id), label: company.name })),
);

const fieldErrors = ref<Record<string, string[]>>({});
const loadError = ref<string | null>(null);
const isLoading = ref(false);
const isSaving = ref(false);

async function load(): Promise<void> {
  if (isEditing.value && (!Number.isInteger(clientId.value) || clientId.value < 1)) {
    loadError.value = "Invalid contact ID";

    return;
  }

  isLoading.value = true;

  try {
    const [options, client] = await Promise.all([
      companyOptionsStore.loadCompanies(),
      isEditing.value ? getClient(clientId.value) : Promise.resolve(null),
    ]);
    companies.value = options;

    if (client) {
      Object.assign(form, {
        name: client.name,
        address: client.address ?? "",
        number: client.number ?? "",
        email: client.email ?? "",
      });
      companyId.value = String(client.company_id);
    }
  } catch (error) {
    loadError.value = notifyApiError(error, "Unable to load contact form").message;
  } finally {
    isLoading.value = false;
  }
}

async function submitForm(): Promise<void> {
  fieldErrors.value = {};

  if (!form.name.trim()) fieldErrors.value.name = ["is required"];
  if (!companyId.value) fieldErrors.value.company_id = ["is required"];
  if (Object.keys(fieldErrors.value).length) return;

  const selectedCompanyId = Number(companyId.value);

  if (!Number.isInteger(selectedCompanyId) || selectedCompanyId < 1) {
    fieldErrors.value.company_id = ["is invalid"];

    return;
  }

  isSaving.value = true;

  try {
    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || null,
      number: form.number.trim() || null,
      email: form.email.trim() || null,
      company_id: selectedCompanyId,
    };

    if (isEditing.value) await updateClient(clientId.value, payload);
    else await createClient(payload);

    await router.replace({ path: RoutePath.CLIENTS, query: route.query });
  } catch (error) {
    const details = notifyApiError(
      error,
      isEditing.value ? "Unable to update contact" : "Unable to create contact",
    );
    fieldErrors.value = details.fieldErrors;
  } finally {
    isSaving.value = false;
  }
}

function cancel(): void {
  void router.push({ path: RoutePath.CLIENTS, query: route.query });
}

onMounted(() => void load());
</script>
