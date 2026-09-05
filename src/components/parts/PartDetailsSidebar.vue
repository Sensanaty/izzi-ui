<template>
  <IzziSidebar v-model="isOpen" :title="sidebarTitle" @close="closeSidebar">
    <template #header-actions>
      <IzziButton v-if="part" size="sm" @click="editPart">Edit</IzziButton>
    </template>

    <p v-if="isLoading" class="text-text" role="status">Loading part...</p>

    <p v-else-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>

    <template v-else-if="part">
      <section class="grid gap-3" aria-labelledby="part-summary-heading">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 id="part-summary-heading" class="font-bold text-lg">{{ part.part_number }}</h3>
            <p class="text-text break-words">{{ display(part.description) }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <IzziButton size="sm" variant="secondary" @click="copyDetails('quote')">
              Copy quote details
            </IzziButton>

            <IzziButton size="sm" variant="secondary" @click="copyDetails('full')">
              Copy full details
            </IzziButton>
          </div>
        </div>
      </section>

      <section
        class="border-border mt-6 grid gap-3 border-t pt-4"
        aria-labelledby="part-inventory-heading"
      >
        <h3 id="part-inventory-heading" class="font-bold text-lg">Inventory</h3>

        <dl class="grid gap-2 text-sm sm:grid-cols-3">
          <div v-for="field in inventoryFields" :key="field.label">
            <dt class="text-text">{{ field.label }}</dt>
            <dd class="font-mono font-bold">{{ display(field.value) }}</dd>
          </div>
        </dl>
      </section>

      <section
        class="border-border mt-6 grid gap-3 border-t pt-4"
        aria-labelledby="part-pricing-heading"
      >
        <h3 id="part-pricing-heading" class="font-bold text-lg">Pricing tiers</h3>

        <div class="border-border overflow-x-auto rounded-sm border">
          <table class="w-full text-left text-sm">
            <thead class="border-border border-b">
              <tr>
                <th class="p-2">Tier</th>
                <th class="p-2">Cost</th>
                <th class="p-2">Price</th>
                <th class="p-2">Minimum order</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tier in pricingTiers"
                :key="tier.label"
                class="border-border border-b last:border-b-0"
              >
                <th class="p-2 font-normal">{{ tier.label }}</th>
                <td class="p-2 font-mono">{{ display(tier.cost) }}</td>
                <td class="p-2 font-mono">{{ display(tier.price) }}</td>
                <td class="p-2 font-mono">{{ display(tier.order) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section
        class="border-border mt-6 grid gap-3 border-t pt-4"
        aria-labelledby="part-details-heading"
      >
        <h3 id="part-details-heading" class="font-bold text-lg">Details</h3>

        <dl class="grid gap-2 text-sm sm:grid-cols-2">
          <div v-for="field in detailFields" :key="field.label">
            <dt class="text-text">{{ field.label }}</dt>
            <dd class="break-words">{{ display(field.value) }}</dd>
          </div>
        </dl>
      </section>

      <section
        class="border-border mt-6 grid gap-3 border-t pt-4"
        aria-labelledby="part-notes-heading"
      >
        <h3 id="part-notes-heading" class="font-bold text-lg">Internal note</h3>
        <p class="whitespace-pre-wrap break-words text-sm">{{ display(part.internal_note) }}</p>
      </section>

      <section
        class="border-border mt-6 grid gap-3 border-t pt-4"
        aria-labelledby="part-history-heading"
      >
        <div class="flex items-center justify-between gap-3">
          <h3 id="part-history-heading" class="font-bold text-lg">History</h3>
          <IzziButton size="sm" variant="secondary" @click="isVersionsOpen = true"
            >View versions</IzziButton
          >
        </div>
        <p class="text-text text-sm">Updated {{ formatDate(part.updated_at) }}</p>
      </section>
    </template>

    <PartVersionsDialog
      v-if="part && isVersionsOpen"
      :part-id="part.id"
      :current-values="part"
      @close="isVersionsOpen = false"
    />
  </IzziSidebar>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPart } from "@/api/parts";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziSidebar from "@/components/ui/IzziSidebar.vue";
import { usePartsCopy } from "@/composables/usePartsCopy";
import { notifyApiError } from "@/lib/notifications";
import { Route } from "@/router/constants";

import type { Part } from "@/lib/schemas/part";

const PartVersionsDialog = defineAsyncComponent(
  () => import("@/components/parts/PartVersionsDialog.vue"),
);

const props = defineProps<{ partId: number }>();
const emit = defineEmits<{ close: [] }>();
const route = useRoute();
const router = useRouter();
const isOpen = defineModel<boolean>({ required: true });
const { copyDetailsForParts } = usePartsCopy();

const part = ref<Part | null>(null);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const isVersionsOpen = ref(false);

const sidebarTitle = computed(() =>
  part.value ? `Part · ${part.value.part_number}` : "Part details",
);
const inventoryFields = computed(() => [
  { label: "Available", value: part.value?.available },
  { label: "Reserved", value: part.value?.reserved },
  { label: "Sold", value: part.value?.sold },
]);
const pricingTiers = computed(() => [
  {
    label: "Minimum",
    cost: part.value?.min_cost,
    price: part.value?.min_price,
    order: part.value?.min_order,
  },
  {
    label: "Medium",
    cost: part.value?.med_cost,
    price: part.value?.med_price,
    order: part.value?.med_order,
  },
  {
    label: "Maximum",
    cost: part.value?.max_cost,
    price: part.value?.max_price,
    order: part.value?.max_order,
  },
]);
const detailFields = computed(() => [
  { label: "ID", value: part.value?.id },
  { label: "Company", value: part.value?.company_name },
  { label: "Condition", value: part.value?.condition },
  { label: "Quote type", value: part.value?.quote_type },
  { label: "Tag", value: part.value?.tag },
  { label: "Lead time", value: part.value?.lead_time },
  { label: "Added", value: formatDate(part.value?.added) },
  { label: "Created", value: formatDate(part.value?.created_at) },
]);

function display(value: string | number | null | undefined): string | number {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

async function loadPart(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = null;
  isVersionsOpen.value = false;

  try {
    part.value = (await getPart(props.partId)).data;
  } catch (error) {
    errorMessage.value = notifyApiError(error, "Unable to load part").message;
  } finally {
    isLoading.value = false;
  }
}

async function copyDetails(type: "quote" | "full"): Promise<void> {
  if (part.value) await copyDetailsForParts([part.value], type);
}

function editPart(): void {
  if (!part.value) return;

  void router.push({ name: Route.PART_EDIT, params: { id: part.value.id }, query: route.query });
}

async function closeSidebar(): Promise<void> {
  await router.replace({ query: { ...route.query, part: undefined } });
  emit("close");
}

watch(() => props.partId, loadPart, { immediate: true });
</script>
