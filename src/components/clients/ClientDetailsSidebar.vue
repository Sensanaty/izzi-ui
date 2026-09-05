<template>
  <IzziSidebar v-model="isOpen" :title="sidebarTitle" @close="closeSidebar">
    <template #header-actions>
      <IzziButton v-if="client" size="sm" @click="editClient">Edit</IzziButton>
    </template>

    <p v-if="isLoading" class="text-text" role="status">Loading contact...</p>

    <p v-else-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>

    <template v-else-if="client">
      <section class="grid gap-3" aria-labelledby="contact-summary-heading">
        <h3 id="contact-summary-heading" class="font-bold text-lg">{{ client.name }}</h3>
        <p class="text-text text-sm">Contact record {{ client.id }}</p>

        <div class="flex flex-wrap gap-2">
          <a v-if="client.email" class="text-accent underline" :href="`mailto:${client.email}`">
            Email contact
          </a>
          <a v-if="client.number" class="text-accent underline" :href="`tel:${client.number}`">
            Call contact
          </a>
        </div>
      </section>

      <section
        class="border-border mt-6 grid gap-3 border-t pt-4"
        aria-labelledby="contact-details-heading"
      >
        <h3 id="contact-details-heading" class="font-bold text-lg">Contact details</h3>

        <dl class="grid gap-3 text-sm">
          <div v-for="field in contactFields" :key="field.label">
            <dt class="text-text">{{ field.label }}</dt>
            <dd class="break-words">{{ display(field.value) }}</dd>
          </div>
        </dl>
      </section>

      <section
        class="border-border mt-6 grid gap-3 border-t pt-4"
        aria-labelledby="contact-company-heading"
      >
        <h3 id="contact-company-heading" class="font-bold text-lg">Company relationship</h3>
        <p class="break-words">{{ display(client.company_name) }}</p>
        <IzziButton
          v-if="client.company_id"
          class="w-fit"
          size="sm"
          variant="secondary"
          @click="openCompany"
        >
          View company
        </IzziButton>
      </section>

      <section
        class="border-border mt-6 grid gap-3 border-t pt-4"
        aria-labelledby="contact-record-heading"
      >
        <h3 id="contact-record-heading" class="font-bold text-lg">Record</h3>
        <dl class="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-text">Created</dt>
            <dd>{{ formatDate(client.created_at) }}</dd>
          </div>
          <div>
            <dt class="text-text">Updated</dt>
            <dd>{{ formatDate(client.updated_at) }}</dd>
          </div>
        </dl>
      </section>
    </template>
  </IzziSidebar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getClient } from "@/api/clients";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziSidebar from "@/components/ui/IzziSidebar.vue";
import { notifyApiError } from "@/lib/notifications";
import { Route } from "@/router/constants";

import type { Client } from "@/lib/schemas/client";

const props = defineProps<{ clientId: number }>();
const emit = defineEmits<{ close: [] }>();
const route = useRoute();
const router = useRouter();
const isOpen = defineModel<boolean>({ required: true });

const client = ref<Client | null>(null);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const sidebarTitle = computed(() =>
  client.value ? `Contact · ${client.value.name}` : "Contact details",
);
const contactFields = computed(() => [
  { label: "Email", value: client.value?.email },
  { label: "Phone", value: client.value?.number },
  { label: "Address", value: client.value?.address },
]);

function display(value: string | number | null | undefined): string | number {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

async function loadClient(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    client.value = await getClient(props.clientId);
  } catch (error) {
    errorMessage.value = notifyApiError(error, "Unable to load contact").message;
  } finally {
    isLoading.value = false;
  }
}

function editClient(): void {
  if (!client.value) return;

  void router.push({
    name: Route.CLIENT_EDIT,
    params: { id: client.value.id },
    query: route.query,
  });
}

function openCompany(): void {
  if (!client.value) return;

  void router.push({
    name: Route.COMPANIES,
    query: { ...route.query, contact: undefined, company: String(client.value.company_id) },
  });
}

async function closeSidebar(): Promise<void> {
  await router.replace({ query: { ...route.query, contact: undefined } });
  emit("close");
}

watch(() => props.clientId, loadClient, { immediate: true });
</script>
