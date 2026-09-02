<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-8"
      @keydown.esc="close"
    >
      <div class="absolute inset-0 bg-black/60" aria-hidden="true" @click="close" />

      <section
        class="bg-background border-border relative flex max-h-full w-full max-w-7xl flex-col overflow-hidden rounded-sm border-2 shadow-lg"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <header
          class="bg-background border-border flex items-start justify-between gap-4 border-b p-4"
        >
          <div>
            <p class="text-text-muted font-mono text-sm">Part #{{ partId }}</p>

            <h2 :id="titleId" class="font-bold text-2xl">Past versions</h2>

            <p class="text-text-muted mt-1 text-sm">
              Select a version to review changes, or restore an individual field
            </p>
          </div>

          <IzziButton size="sm" aria-label="Close past versions" @click="close">Close</IzziButton>
        </header>

        <div class="min-h-0 overflow-auto p-4">
          <p v-if="isLoading" class="text-text-muted py-12 text-center" role="status">
            Loading version history...
          </p>

          <p v-else-if="errorMessage" class="text-danger py-8 text-center" role="alert">
            {{ errorMessage }}
          </p>

          <p v-else-if="!versions.length" class="text-text-muted py-12 text-center">
            No previous versions of this part found
          </p>

          <template v-else-if="selectedVersion">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <IzziButton
                  variant="secondary"
                  size="sm"
                  :disabled="selectedIndex === 0"
                  aria-label="View newer version"
                  @click="selectedIndex -= 1"
                >
                  Newer
                </IzziButton>

                <span class="font-mono text-sm"
                  >Version {{ selectedIndex + 1 }} of {{ versions.length }}</span
                >

                <IzziButton
                  variant="secondary"
                  size="sm"
                  :disabled="selectedIndex === versions.length - 1"
                  aria-label="View older version"
                  @click="selectedIndex += 1"
                >
                  Older
                </IzziButton>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <label
                  class="text-text-muted inline-flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input v-model="hideIdentical" class="accent-primary size-4" type="checkbox" />
                  Hide identical values
                </label>

                <span class="text-text-muted font-mono text-sm">{{
                  formatDate(selectedVersion.created_at)
                }}</span>

                <IzziButton size="sm" :disabled="changedFields.length === 0" @click="restoreAll">
                  Restore version
                </IzziButton>
              </div>
            </div>

            <p
              v-if="hideIdentical && changedFields.length === 0"
              class="text-text-muted border-border rounded-sm border p-6 text-center"
            >
              All fields match the selected version
            </p>

            <div v-else class="border-border grid overflow-hidden rounded-sm border md:grid-cols-2">
              <div
                class="border-border bg-surface-hover border-b p-3 font-bold md:border-r md:border-b-0"
              >
                Current values
              </div>

              <div class="border-border bg-surface-hover border-b p-3 font-bold md:border-b-0">
                Version values
              </div>

              <template v-for="field in visibleFields" :key="field.key">
                <div
                  class="border-border border-b p-3 md:border-r"
                  :class="{ 'bg-history-change/20': isChanged(field.key) }"
                >
                  <span class="text-text-muted block text-xs font-bold tracking-wide uppercase">{{
                    field.label
                  }}</span>

                  <span class="font-mono break-words">{{
                    displayValue(field.key, currentValues[field.key])
                  }}</span>
                </div>

                <button
                  class="border-border border-b p-3 text-left md:cursor-default"
                  :class="{
                    'bg-history-change/20 hover:bg-history-change-hover/30 md:cursor-pointer':
                      isChanged(field.key),
                  }"
                  type="button"
                  :disabled="!isChanged(field.key)"
                  :title="isChanged(field.key) ? `Restore ${field.label}` : undefined"
                  @click="restoreField(field.key)"
                >
                  <span class="text-text-muted block text-xs font-bold tracking-wide uppercase">{{
                    field.label
                  }}</span>

                  <span class="font-mono break-words">{{
                    displayValue(field.key, selectedVersion.object[field.key])
                  }}</span>

                  <span v-if="isChanged(field.key)" class="text-accent mt-1 block text-xs font-bold"
                    >Click to restore</span
                  >
                </button>
              </template>
            </div>
          </template>
        </div>

        <footer
          class="bg-background border-border flex flex-wrap justify-between gap-2 border-t p-4"
        >
          <IzziButton
            variant="danger"
            :disabled="isLoading || isDeleting || !versions.length"
            @click="deleteHistory"
          >
            {{ isDeleting ? "Deleting..." : "Delete history" }}
          </IzziButton>

          <IzziButton variant="secondary" @click="close">Done</IzziButton>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { deletePartVersions, getPartVersions } from "@/api/parts";
import IzziButton from "@/components/ui/IzziButton.vue";
import { notifyApiError } from "@/lib/notifications";

import type { Part, PartVersion } from "@/lib/schemas/part";

type Value = string | number | null | undefined;
type FieldKey = keyof Part;
type Field = { key: FieldKey; label: string };

type Props = {
  partId: number;
  currentValues: Partial<Record<FieldKey, Value>>;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  restore: [key: FieldKey, value: Value];
  restoreAll: [values: Partial<Record<FieldKey, Value>>];
}>();

const numericFields = new Set<FieldKey>([
  "available",
  "reserved",
  "sold",
  "min_cost",
  "min_price",
  "min_order",
  "med_cost",
  "med_price",
  "med_order",
  "max_cost",
  "max_price",
  "max_order",
  "company_id",
]);

const fields: Field[] = [
  { key: "part_number", label: "Part number" },
  { key: "description", label: "Description" },
  { key: "company_name", label: "Company" },
  { key: "condition", label: "Condition" },
  { key: "quote_type", label: "Quote type" },
  { key: "tag", label: "Tag" },
  { key: "lead_time", label: "Lead time" },
  { key: "available", label: "Available" },
  { key: "reserved", label: "Reserved" },
  { key: "sold", label: "Sold" },
  { key: "min_cost", label: "Minimum cost" },
  { key: "min_price", label: "Minimum price" },
  { key: "min_order", label: "Minimum order" },
  { key: "med_cost", label: "Medium cost" },
  { key: "med_price", label: "Medium price" },
  { key: "med_order", label: "Medium order" },
  { key: "max_cost", label: "Maximum cost" },
  { key: "max_price", label: "Maximum price" },
  { key: "max_order", label: "Maximum order" },
  { key: "internal_note", label: "Internal note" },
  { key: "added", label: "Added" },
  { key: "company_id", label: "Company ID" },
];

const titleId = `part-versions-${props.partId}`;
const isLoading = ref(true);
const isDeleting = ref(false);
const errorMessage = ref<string | null>(null);
const versions = ref<PartVersion[]>([]);
const selectedIndex = ref(0);
const hideIdentical = ref(false);
const selectedVersion = computed<PartVersion | null>(
  () => versions.value[selectedIndex.value] ?? null,
);
const changedFields = computed(() => fields.filter(({ key }) => isChanged(key)));
const visibleFields = computed(() => (hideIdentical.value ? changedFields.value : fields));

const quoteTypeLabels: Record<string, string> = {
  outright_sale: "OUTRIGHT SALE",
  flat_rate_exchange: "FLAT RATE EXCHANGE",
  exchange_plus_cost: "EXCHANGE + COST",
};

function normalizedValue(key: FieldKey, value: Value): Value {
  if (key === "quote_type" && typeof value === "string") {
    return quoteTypeLabels[value] ?? value;
  }

  return value;
}

function displayValue(key: FieldKey, value: Value): string {
  const normalized = normalizedValue(key, value);

  return normalized === null || normalized === undefined || normalized === ""
    ? "Not set"
    : String(normalized);
}

function comparableValue(key: FieldKey, value: Value): string | number | null {
  const normalized = normalizedValue(key, value);

  if (normalized === null || normalized === undefined || normalized === "") return null;
  if (numericFields.has(key)) return Number(normalized);

  return String(normalized);
}

function isChanged(key: FieldKey): boolean {
  if (key === "created_at" || key === "updated_at") return false;

  return (
    comparableValue(key, props.currentValues[key]) !==
    comparableValue(key, selectedVersion.value?.object[key])
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}

function close(): void {
  emit("close");
}

function restoreField(key: FieldKey): void {
  const version = selectedVersion.value;

  if (!version || !isChanged(key)) return;

  emit("restore", key, normalizedValue(key, version.object[key]));
}

function restoreAll(): void {
  const version = selectedVersion.value;

  if (!version) return;

  const values: Partial<Record<FieldKey, Value>> = { ...version.object };

  if (values.quote_type !== undefined) {
    values.quote_type = normalizedValue("quote_type", values.quote_type);
  }

  emit("restoreAll", values);
}

async function deleteHistory() {
  if (!window.confirm("Delete all past versions for this part? This cannot be undone")) return;

  isDeleting.value = true;

  try {
    await deletePartVersions(props.partId);
    versions.value = [];
  } catch (error) {
    errorMessage.value = notifyApiError(error, "Unable to delete version history").message;
  } finally {
    isDeleting.value = false;
  }
}

async function loadVersions() {
  try {
    versions.value = (await getPartVersions(props.partId)).data;
  } catch (error) {
    errorMessage.value = notifyApiError(error, "Unable to load version history").message;
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await loadVersions();
});
</script>
