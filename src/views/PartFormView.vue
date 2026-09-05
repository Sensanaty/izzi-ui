<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <h1 class="font-bold text-3xl">
        {{ isEditing ? `Editing part ${partId}` : "Add new part" }}
      </h1>

      <p class="text-text-muted">
        {{ isEditing ? "Update the part record" : "Add a part to the inventory" }}
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <IzziButton
        v-if="isEditing && versionCount !== 0"
        variant="secondary"
        size="sm"
        :disabled="versionCount === null"
        @click="isVersionsOpen = true"
      >
        {{ versionsButtonLabel }}
      </IzziButton>

      <RouterLink class="text-accent underline" :to="{ path: RoutePath.HOME, query: route.query }">
        Back to parts
      </RouterLink>
    </div>
  </div>

  <p v-if="loadError" class="text-danger" role="alert">{{ loadError }}</p>

  <form class="grid gap-6" novalidate @submit.prevent="submitForm">
    <section class="bg-surface-raised border-border grid gap-4 rounded-sm border-2 p-4">
      <h2 class="font-bold text-xl">Part details</h2>

      <div class="grid gap-4 md:grid-cols-2">
        <IzziInput
          v-model="form.part_number"
          label="Part number"
          :error="fieldError('part_number')"
          required
        />

        <IzziInput
          v-model="form.description"
          label="Description"
          :error="fieldError('description')"
          required
        />

        <div class="grid content-start gap-1">
          <span class="font-bold" id="part-company-label">
            Company <sup aria-hidden="true">*</sup><span class="sr-only">(required)</span>
          </span>

          <IzziDropdown
            v-model="form.company_id"
            id="part-company"
            aria-labelledby="part-company-label"
            :options="companyOptions"
            placeholder="Select a company"
            searchable
            search-label="companies"
            virtualize
            size="lg"
            :disabled="isSaving || companiesLoading || isCreatingCompany"
            :error="fieldError('company_id')"
          />

          <div class="mt-2 flex flex-wrap items-center gap-3">
            <IzziButton
              size="sm"
              variant="secondary"
              :disabled="isSaving"
              @click="isCreatingCompany = !isCreatingCompany"
            >
              {{ isCreatingCompany ? "Cancel new company" : "New company" }}
            </IzziButton>

            <RouterLink class="text-accent text-sm underline" :to="RoutePath.COMPANY_NEW">
              Open full company form
            </RouterLink>
          </div>

          <div
            v-if="isCreatingCompany"
            class="border-border mt-2 grid gap-4 rounded-sm border-2 p-4"
          >
            <CompanyFormFields v-model="newCompanyForm" :errors="companyFieldErrors" />

            <IzziButton
              class="mt-1 justify-self-start"
              size="sm"
              :disabled="isSavingCompany"
              @click="createQuickCompany"
            >
              {{ isSavingCompany ? "Saving..." : "Create and select company" }}
            </IzziButton>
          </div>

          <span v-if="!companiesLoading && !companies.length" class="text-danger" role="alert">
            No companies are available
          </span>
        </div>

        <IzziInput
          v-model="form.condition"
          label="Condition"
          :error="fieldError('condition')"
          required
        />

        <div class="grid content-start gap-1">
          <span class="font-bold" id="quote-type-label">
            Quote type <sup aria-hidden="true">*</sup><span class="sr-only">(required)</span>
          </span>

          <IzziDropdown
            v-model="form.quote_type"
            id="quote-type"
            aria-labelledby="quote-type-label"
            :options="quoteTypeOptions"
            :disabled="isSaving"
            :error="fieldError('quote_type')"
          />
        </div>

        <IzziInput v-model="form.tag" label="Tag" :error="fieldError('tag')" required />

        <IzziInput v-model="form.lead_time" label="Lead time" :error="fieldError('lead_time')" />

        <IzziInput v-model="form.added" label="Updated" type="date" :error="fieldError('added')" />

        <IzziInput v-if="isEditing" v-model="form.updated_at" label="Updated At" readonly />

        <IzziInput v-if="isEditing" v-model="form.created_at" label="Created At" readonly />
      </div>

      <IzziTextArea
        v-model="form.internal_note"
        label="Internal note"
        :error="fieldError('internal_note')"
      />
    </section>

    <section class="bg-surface-raised border-border grid gap-4 rounded-sm border-2 p-4">
      <h2 class="font-bold text-xl">Inventory and pricing</h2>

      <div class="grid gap-4 md:grid-cols-3">
        <IzziInput
          v-model="form.available"
          label="Available"
          type="number"
          min="0"
          :error="fieldError('available')"
          required
        />

        <IzziInput
          v-model="form.reserved"
          label="Reserved"
          type="number"
          min="0"
          :error="fieldError('reserved')"
          required
        />

        <IzziInput
          v-model="form.sold"
          label="Sold"
          type="number"
          min="0"
          :error="fieldError('sold')"
          required
        />
      </div>

      <div v-for="tier in priceTiers" :key="tier.key" class="grid gap-4 md:grid-cols-3">
        <IzziInput
          v-model="form[tier.cost]"
          :label="`${tier.label} cost`"
          type="number"
          min="0"
          step="0.01"
          :error="fieldError(tier.cost)"
        />

        <IzziInput
          v-model="form[tier.price]"
          :label="`${tier.label} price`"
          type="number"
          min="0"
          step="0.01"
          :error="fieldError(tier.price)"
        />

        <IzziInput
          v-model="form[tier.order]"
          :label="`${tier.label} minimum order`"
          type="number"
          min="0"
          :error="fieldError(tier.order)"
        />
      </div>
    </section>

    <div class="flex flex-wrap gap-2">
      <IzziButton type="submit" :disabled="isSaving || companiesLoading">
        {{ submitLabel }}
      </IzziButton>

      <IzziButton variant="secondary" :disabled="isSaving" @click="cancel">Cancel</IzziButton>
    </div>
  </form>

  <PartVersionsDialog
    v-if="isVersionsOpen"
    :part-id="partId"
    :current-values="currentValues"
    @close="isVersionsOpen = false"
    @restore="restoreVersionField"
    @restore-all="restoreVersion"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { createCompany } from "@/api/companies";
import { createPart, getPart, updatePart } from "@/api/parts";
import CompanyFormFields from "@/components/companies/CompanyFormFields.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziDropdown from "@/components/ui/IzziDropdown.vue";
import IzziInput from "@/components/ui/IzziInput.vue";
import IzziTextArea from "@/components/ui/IzziTextArea.vue";
import { useEscapeNavigation } from "@/composables/useEscapeNavigation";
import { notifyApiError } from "@/lib/notifications";
import { RoutePath } from "@/router/constants";
import { useCompanyOptionsStore } from "@/stores/companyOptions";
import { useNotificationStore } from "@/stores/notification";

import type { CompanyFormState } from "@/components/companies/CompanyFormFields.vue";
import type { Part } from "@/lib/schemas/part";

const PartVersionsDialog = defineAsyncComponent(
  () => import("@/components/parts/PartVersionsDialog.vue"),
);

const quoteTypes = ["OUTRIGHT SALE", "FLAT RATE EXCHANGE", "EXCHANGE + COST"] as const;
type QuoteType = (typeof quoteTypes)[number];

const quoteTypeOptions = quoteTypes.map((quoteType) => ({
  value: quoteType,
  label: quoteType,
}));

const quoteTypeValues: Record<string, QuoteType> = {
  outright_sale: "OUTRIGHT SALE",
  flat_rate_exchange: "FLAT RATE EXCHANGE",
  exchange_plus_cost: "EXCHANGE + COST",
};

const priceTiers = [
  { key: "min", label: "Minimum", cost: "min_cost", price: "min_price", order: "min_order" },
  { key: "med", label: "Medium", cost: "med_cost", price: "med_price", order: "med_order" },
  { key: "max", label: "Maximum", cost: "max_cost", price: "max_price", order: "max_order" },
] as const;

type FormState = {
  part_number: string;
  description: string;
  available: string;
  reserved: string;
  sold: string;
  condition: string;
  min_cost: string;
  min_price: string;
  min_order: string;
  med_cost: string;
  med_price: string;
  med_order: string;
  max_cost: string;
  max_price: string;
  max_order: string;
  lead_time: string;
  quote_type: string;
  tag: string;
  internal_note: string;
  added: string;
  created_at: string;
  updated_at: string;
  company_id: string;
};

function currentDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const emptyForm = (): FormState => ({
  part_number: "",
  description: "",
  available: "0",
  reserved: "0",
  sold: "0",
  condition: "",
  min_cost: "0",
  min_price: "0",
  min_order: "0",
  med_cost: "0",
  med_price: "0",
  med_order: "0",
  max_cost: "0",
  max_price: "0",
  max_order: "0",
  lead_time: "",
  quote_type: quoteTypes[0],
  tag: "",
  internal_note: "",
  added: currentDate(),
  created_at: "",
  updated_at: "",
  company_id: "",
});

const route = useRoute();
const router = useRouter();
const { createNotification } = useNotificationStore();

const form = reactive<FormState>(emptyForm());
const companyOptionsStore = useCompanyOptionsStore();
const { companies, isLoading: companiesLoading } = storeToRefs(companyOptionsStore);
const isCreatingCompany = ref(false);
const isSavingCompany = ref(false);
const companyFieldErrors = ref<Record<string, string[]>>({});

const newCompanyForm = reactive<CompanyFormState>({
  name: "",
  address: "",
  city: "",
  country: "",
  website: "",
  subscription: "",
});

const isSaving = ref(false);
const isVersionsOpen = ref(false);

const versionCount = ref<number | null>(null);
const versionsButtonLabel = computed(() => {
  if (versionCount.value === null) return "Loading past versions...";

  return `View ${versionCount.value} past version${versionCount.value === 1 ? "" : "s"}`;
});

const submitLabel = computed(() => {
  if (isSaving.value) return "Saving...";

  return isEditing.value ? "Save changes" : "Create part";
});

useEscapeNavigation(cancel);

const loadError = ref<string | null>(null);
const fieldErrors = ref<Record<string, string[]>>({});

const companyOptions = computed(() =>
  companies.value.map((company) => ({ value: String(company.id), label: company.name })),
);

const partId = computed(() => Number(route.params.id));
const isEditing = computed(() => Number.isInteger(partId.value) && partId.value > 0);

const currentValues = computed<Partial<Record<keyof Part, string | number | null | undefined>>>(
  () => ({
    ...form,
    company_name: companies.value.find((company) => String(company.id) === form.company_id)?.name,
  }),
);

type PartVersionField = keyof Part;

type VersionValue = string | number | null | undefined;

function restoreVersionField(field: PartVersionField, value: VersionValue): void {
  if (field === "company_name") return;
  if (!(field in form)) return;

  form[field as keyof FormState] = value === null || value === undefined ? "" : String(value);
}

function restoreVersion(values: Partial<Record<PartVersionField, VersionValue>>): void {
  Object.entries(values).forEach(([field, value]) => {
    restoreVersionField(field as PartVersionField, value);
  });
}

function fieldError(field: string): string | null {
  return fieldErrors.value[field]?.join(", ") ?? null;
}

watch(form, (nextForm) => {
  Object.keys(fieldErrors.value).forEach((field) => {
    if (!(field in nextForm)) return;

    const value = nextForm[field as keyof FormState];

    if (typeof value === "string" && value.trim()) delete fieldErrors.value[field];
  });
});

watch(newCompanyForm, (nextForm) => {
  Object.keys(companyFieldErrors.value).forEach((field) => {
    if (
      typeof nextForm[field as keyof CompanyFormState] === "string" &&
      nextForm[field as keyof CompanyFormState].trim()
    ) {
      delete companyFieldErrors.value[field];
    }
  });
});

function numberValue(value: string): number {
  return Number(value || 0);
}

function payload() {
  const { created_at, updated_at, ...editableForm } = form;
  void created_at;
  void updated_at;

  return {
    ...editableForm,
    available: numberValue(form.available),
    reserved: numberValue(form.reserved),
    sold: numberValue(form.sold),
    min_order: form.min_order ? numberValue(form.min_order) : null,
    med_order: form.med_order ? numberValue(form.med_order) : null,
    max_order: form.max_order ? numberValue(form.max_order) : null,
    lead_time: form.lead_time || null,
    internal_note: form.internal_note || null,
    added: form.added || null,
    company_id: numberValue(form.company_id),
  };
}

function fillForm(part: Part): void {
  Object.assign(form, {
    ...part,
    available: String(part.available),
    reserved: String(part.reserved),
    sold: String(part.sold),
    min_cost: part.min_cost ?? "0",
    min_price: part.min_price ?? "0",
    min_order: String(part.min_order ?? ""),
    med_cost: part.med_cost ?? "0",
    med_price: part.med_price ?? "0",
    med_order: String(part.med_order ?? ""),
    max_cost: part.max_cost ?? "0",
    max_price: part.max_price ?? "0",
    max_order: String(part.max_order ?? ""),
    quote_type: quoteTypeValues[part.quote_type] ?? part.quote_type,
    lead_time: part.lead_time ?? "",
    internal_note: part.internal_note ?? "",
    added: part.added ?? "",
    created_at: part.created_at,
    updated_at: part.updated_at,
    company_id: String(part.company_id ?? ""),
  });
}

async function load() {
  const requestedPath = route.fullPath;

  try {
    const companyPromise = companyOptionsStore.loadCompanies();
    const partPromise = isEditing.value ? getPart(partId.value) : Promise.resolve(null);
    const [loadedCompanies, loadedPart] = await Promise.all([companyPromise, partPromise]);

    if (requestedPath !== route.fullPath) return;

    companies.value = loadedCompanies;
    versionCount.value = loadedPart?.data.versions_count ?? null;

    if (loadedPart) fillForm(loadedPart.data);
  } catch (error) {
    loadError.value = notifyApiError(
      error,
      isEditing.value ? "Unable to load part" : "Unable to load companies",
    ).message;
  } finally {
    if (requestedPath === route.fullPath) companiesLoading.value = false;
  }
}

function validateCompanyForm(): boolean {
  if (newCompanyForm.name.trim()) {
    companyFieldErrors.value = {};

    return true;
  }

  companyFieldErrors.value = { name: ["is required"] };
  createNotification("Company name is required", { kind: "w" });

  return false;
}

async function createQuickCompany() {
  if (!validateCompanyForm()) return;

  isSavingCompany.value = true;

  try {
    const company = await createCompany({
      name: newCompanyForm.name.trim(),
      address: newCompanyForm.address.trim() || null,
      city: newCompanyForm.city.trim() || null,
      country: newCompanyForm.country.trim() || null,
      website: newCompanyForm.website.trim() || null,
      subscription: newCompanyForm.subscription.trim() || null,
    });

    companyOptionsStore.upsertCompany(company);
    form.company_id = String(company.id);
    isCreatingCompany.value = false;

    Object.assign(newCompanyForm, {
      name: "",
      address: "",
      city: "",
      country: "",
      website: "",
      subscription: "",
    });

    companyFieldErrors.value = {};
    createNotification("Company created");
  } catch (error) {
    const details = notifyApiError(error, "Unable to create company");
    companyFieldErrors.value = details.fieldErrors;
  } finally {
    isSavingCompany.value = false;
  }
}

function validateForm(): boolean {
  const requiredFields = [
    "part_number",
    "description",
    "condition",
    "tag",
    "company_id",
    "quote_type",
    "available",
    "reserved",
    "sold",
  ];
  const errors: Record<string, string[]> = {};

  requiredFields.forEach((field) => {
    const value = form[field as keyof FormState];

    if (typeof value === "string" && !value.trim()) errors[field] = ["is required"];
  });

  fieldErrors.value = errors;

  if (Object.keys(errors).length === 0) return true;

  createNotification("Please complete the required fields", { kind: "w" });

  return false;
}

async function submitForm() {
  if (!validateForm()) return;

  fieldErrors.value = {};
  isSaving.value = true;

  try {
    if (isEditing.value) {
      await updatePart(partId.value, payload());
    } else {
      await createPart(payload());
    }

    createNotification(isEditing.value ? "Part updated" : "Part created");
    await router.replace({ path: RoutePath.HOME, query: route.query });
  } catch (error) {
    const details = notifyApiError(
      error,
      isEditing.value ? "Unable to update part" : "Unable to create part",
    );
    fieldErrors.value = details.fieldErrors;
  } finally {
    isSaving.value = false;
  }
}

async function cancel(): Promise<void> {
  await router.push({ path: RoutePath.HOME, query: route.query });
}

function resetForRoute(): void {
  Object.assign(form, emptyForm());

  Object.assign(newCompanyForm, {
    name: "",
    address: "",
    city: "",
    country: "",
    website: "",
    subscription: "",
  });

  isCreatingCompany.value = false;
  companyFieldErrors.value = {};
  fieldErrors.value = {};
  loadError.value = null;
  versionCount.value = null;
  companiesLoading.value = true;
  void load();
}

watch(() => route.fullPath, resetForRoute);

onMounted(() => void load());
</script>
