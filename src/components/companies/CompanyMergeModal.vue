<template>
  <IzziModal v-model="isOpen" title="Merge duplicate company" size="md" @close="emit('cancel')">
    <div class="grid gap-4">
      <p class="text-text-muted">
        Move the parts and contacts from <strong>{{ sourceCompany.name }}</strong> into the selected
        company. The source company will be archived after the merge.
      </p>

      <div class="grid gap-1">
        <label class="font-bold" for="merge-target-company">Company to keep</label>

        <IzziDropdown
          id="merge-target-company"
          v-model="targetCompanyId"
          :options="targetOptions"
          placeholder="Choose a company"
          searchable
          search-label="companies"
          :disabled="isMerging"
        />
      </div>

      <p v-if="previewError" class="text-danger" role="alert">{{ previewError }}</p>

      <div v-else-if="preview" class="border-border grid gap-1 rounded-sm border p-3">
        <p class="font-bold">Records to move</p>
        <p>{{ preview.partsCount }} parts</p>
        <p>{{ preview.clientsCount }} contacts</p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <IzziButton variant="secondary" :disabled="isMerging" @click="cancel">Cancel</IzziButton>

        <IzziButton :disabled="!targetCompanyId || isMerging" @click="confirm">
          {{ isMerging ? "Merging..." : "Merge companies" }}
        </IzziButton>
      </div>
    </template>
  </IzziModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getCompanyMergePreview } from "@/api/companies";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziDropdown from "@/components/ui/IzziDropdown.vue";
import IzziModal from "@/components/ui/IzziModal.vue";

import type { Company } from "@/lib/schemas/company";

const props = defineProps<{
  sourceCompany: Company;
  companies: Company[];
  isMerging: boolean;
}>();
const emit = defineEmits<{
  cancel: [];
  confirm: [targetCompanyId: number];
}>();

const isOpen = ref(true);
const targetCompanyId = ref("");
const preview = ref<{ partsCount: number; clientsCount: number } | null>(null);
const previewError = ref<string | null>(null);

const targetOptions = computed(() =>
  props.companies
    .filter((company) => company.id !== props.sourceCompany.id && company.name.trim().length > 0)
    .map((company) => ({ value: String(company.id), label: company.name })),
);

watch(targetCompanyId, async (value) => {
  preview.value = null;
  previewError.value = null;

  if (!value) return;

  try {
    const response = await getCompanyMergePreview(props.sourceCompany.id, Number(value));
    preview.value = {
      partsCount: response.data.parts_count,
      clientsCount: response.data.clients_count,
    };
  } catch {
    previewError.value = "Unable to load the merge preview";
  }
});

function cancel(): void {
  isOpen.value = false;
  emit("cancel");
}

function confirm(): void {
  const targetId = Number(targetCompanyId.value);

  if (!Number.isInteger(targetId) || targetId <= 0) return;

  emit("confirm", targetId);
}
</script>
