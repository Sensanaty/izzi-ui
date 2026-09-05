<template>
  <IzziSidebar v-model="isOpen" :title="sidebarTitle" @close="closeSidebar">
    <template #header-actions>
      <IzziButton v-if="company" size="sm" @click="editCompany">Edit</IzziButton>
    </template>

    <div v-if="isLoadingCompany" class="text-text">Loading company...</div>

    <p v-else-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>

    <template v-else-if="company">
      <section class="grid gap-3" aria-labelledby="company-details-heading">
        <h3 id="company-details-heading" class="font-bold text-lg">{{ display(company.name) }}</h3>

        <dl class="grid gap-2 text-sm sm:grid-cols-2">
          <div v-for="field in companyFields" :key="field.label">
            <dt class="text-text">{{ field.label }}</dt>
            <dd class="break-words">{{ display(field.value) }}</dd>
          </div>
        </dl>
      </section>

      <CompanyDetailsSection
        title="Parts"
        item-label="parts"
        search-label="Search parts"
        :items="parts"
        :search="partsSearch"
        :highlight-query="partsHighlightQuery"
        :is-loading="isLoadingParts"
        :error-message="partsErrorMessage"
        :has-previous-page="partsPagination.hasPreviousPage.value"
        :has-next-page="partsPagination.hasNextPage.value"
        @search="searchParts"
        @update:search="partsSearch = $event"
        @first="loadParts(1)"
        @previous="loadParts(partsPagination.currentPage.value - 1)"
        @next="loadParts(partsPagination.currentPage.value + 1)"
        @last="loadParts(partsPagination.lastPage.value)"
        @add="addPart"
        @edit="editPart"
        @delete="requestPartDelete"
      />

      <CompanyDetailsSection
        title="Contacts"
        item-label="contacts"
        search-label="Search contacts"
        :items="contacts"
        :search="contactsSearch"
        :highlight-query="contactsHighlightQuery"
        :is-loading="isLoadingContacts"
        :error-message="contactsErrorMessage"
        :has-previous-page="contactsPagination.hasPreviousPage.value"
        :has-next-page="contactsPagination.hasNextPage.value"
        @search="searchContacts"
        @update:search="contactsSearch = $event"
        @first="loadContacts(1)"
        @previous="loadContacts(contactsPagination.currentPage.value - 1)"
        @next="loadContacts(contactsPagination.currentPage.value + 1)"
        @last="loadContacts(contactsPagination.lastPage.value)"
        @add="addContact"
        @edit="editContact"
        @delete="requestContactDelete"
      />
    </template>

    <DeleteConfirmationModal
      v-if="deleteItems.length"
      :item-label="deleteItemLabel"
      :item-label-plural="deleteItemLabelPlural"
      :items="deleteItems"
      :deleting="isDeleting"
      @cancel="deleteItems = []"
      @confirm="confirmDelete"
    />
  </IzziSidebar>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { deleteClient, getClients } from "@/api/clients";
import { getCompany } from "@/api/companies";
import { deletePart, getParts } from "@/api/parts";
import CompanyDetailsSection from "@/components/companies/CompanyDetailsSection.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziSidebar from "@/components/ui/IzziSidebar.vue";
import { usePagination } from "@/composables/usePagination";
import { notifyApiError } from "@/lib/notifications";
import { Route, RoutePath } from "@/router/constants";

import type { Client } from "@/lib/schemas/client";
import type { Company } from "@/lib/schemas/company";
import type { Part } from "@/lib/schemas/part";

const DeleteConfirmationModal = defineAsyncComponent(
  () => import("@/components/ui/DeleteConfirmationModal.vue"),
);

const props = defineProps<{ companyId: number }>();
const emit = defineEmits<{ close: [] }>();
const router = useRouter();
const isOpen = defineModel<boolean>({ required: true });

const company = ref<Company | null>(null);
const parts = ref<Part[]>([]);
const contacts = ref<Client[]>([]);
const isLoadingCompany = ref(false);
const isLoadingParts = ref(false);
const isLoadingContacts = ref(false);
const errorMessage = ref<string | null>(null);
const partsErrorMessage = ref<string | null>(null);
const contactsErrorMessage = ref<string | null>(null);
const partsSearch = ref("");
const partsHighlightQuery = ref("");
const contactsSearch = ref("");
const contactsHighlightQuery = ref("");
const isDeleting = ref(false);
const deleteItems = ref<{ id: number; label: string }[]>([]);
const deleteItemType = ref<"part" | "contact" | null>(null);

const partsPagination = usePagination({
  pageSizeOptions: [5, 10, 25],
  defaultPageSize: 5,
});
const contactsPagination = usePagination({
  pageSizeOptions: [5, 10, 25],
  defaultPageSize: 5,
});

const deleteItemLabel = computed(() => (deleteItemType.value === "part" ? "part" : "contact"));
const deleteItemLabelPlural = computed(() =>
  deleteItemType.value === "part" ? "parts" : "contacts",
);
const sidebarTitle = computed(() => {
  const partsCount = display(company.value?.parts_count);
  const contactsCount = display(company.value?.clients_count);

  return `Company details · ${partsCount} Parts · ${contactsCount} Contacts`;
});
const companyFields = computed(() => [
  { label: "ID", value: company.value?.id },
  { label: "Address", value: company.value?.address },
  { label: "City", value: company.value?.city },
  { label: "Country", value: company.value?.country },
  { label: "Website", value: company.value?.website },
  { label: "Subscription", value: company.value?.subscription },
  { label: "Parts count", value: company.value?.parts_count },
  { label: "Contacts count", value: company.value?.clients_count },
]);

function display(value: string | number | null | undefined): string | number {
  return value === null || value === undefined || value === "" ? "-" : value;
}

async function loadCompany(): Promise<void> {
  isLoadingCompany.value = true;
  errorMessage.value = null;

  try {
    company.value = await getCompany(props.companyId);
  } catch (error) {
    errorMessage.value = notifyApiError(error, "Unable to load company").message;
  } finally {
    isLoadingCompany.value = false;
  }
}

async function loadParts(page = partsPagination.currentPage.value): Promise<void> {
  isLoadingParts.value = true;
  partsErrorMessage.value = null;

  try {
    const response = await getParts({
      page,
      count: partsPagination.pageSize.value,
      query: partsSearch.value.trim(),
      filters: { companyId: props.companyId },
    });
    parts.value = response.data;
    partsHighlightQuery.value = partsSearch.value.trim();
    partsPagination.updateMetadata(response.metadata);
  } catch (error) {
    partsErrorMessage.value = notifyApiError(error, "Unable to load parts").message;
  } finally {
    isLoadingParts.value = false;
  }
}

async function loadContacts(page = contactsPagination.currentPage.value): Promise<void> {
  isLoadingContacts.value = true;
  contactsErrorMessage.value = null;

  try {
    const response = await getClients({
      page,
      count: contactsPagination.pageSize.value,
      query: contactsSearch.value.trim(),
      companyId: props.companyId,
    });
    contacts.value = response.data;
    contactsHighlightQuery.value = contactsSearch.value.trim();
    contactsPagination.updateMetadata(response.metadata);
  } catch (error) {
    contactsErrorMessage.value = notifyApiError(error, "Unable to load contacts").message;
  } finally {
    isLoadingContacts.value = false;
  }
}

async function loadAll(): Promise<void> {
  await Promise.all([loadCompany(), loadParts(1), loadContacts(1)]);
}

async function searchParts(): Promise<void> {
  await loadParts(1);
}

async function searchContacts(): Promise<void> {
  await loadContacts(1);
}

function editCompany(): void {
  if (!company.value) return;

  void router.push({
    name: Route.COMPANY_EDIT,
    params: { id: company.value.id },
    query: router.currentRoute.value.query,
  });
}

function addPart(): void {
  void router.push({ path: RoutePath.PART_NEW, query: { company_id: String(props.companyId) } });
}

function addContact(): void {
  void router.push({ path: RoutePath.CLIENT_NEW, query: { company_id: String(props.companyId) } });
}

function editPart(item: Part | Client): void {
  if (!("part_number" in item)) return;

  void router.push({
    name: Route.PART_EDIT,
    params: { id: item.id },
    query: router.currentRoute.value.query,
  });
}

function editContact(item: Part | Client): void {
  if (!("name" in item)) return;

  void router.push({
    name: Route.CLIENT_EDIT,
    params: { id: item.id },
    query: router.currentRoute.value.query,
  });
}

function requestPartDelete(item: Part | Client): void {
  if (!("part_number" in item)) return;

  deleteItemType.value = "part";
  deleteItems.value = [{ id: item.id, label: item.part_number }];
}

function requestContactDelete(item: Part | Client): void {
  if (!("name" in item)) return;

  deleteItemType.value = "contact";
  deleteItems.value = [{ id: item.id, label: item.name }];
}

async function confirmDelete(): Promise<void> {
  const item = deleteItems.value[0];
  const type = deleteItemType.value;

  if (!item || !type) return;

  isDeleting.value = true;

  try {
    if (type === "part") await deletePart(item.id);
    else await deleteClient(item.id);

    deleteItems.value = [];
    deleteItemType.value = null;
    await (type === "part" ? loadParts() : loadContacts());
  } catch (error) {
    notifyApiError(error, `Unable to delete ${type}`);
  } finally {
    isDeleting.value = false;
  }
}

async function closeSidebar(): Promise<void> {
  await router.replace({ query: { ...router.currentRoute.value.query, company: undefined } });
  emit("close");
}

watch(
  () => props.companyId,
  async () => {
    await loadAll();
  },
  { immediate: true },
);
</script>
