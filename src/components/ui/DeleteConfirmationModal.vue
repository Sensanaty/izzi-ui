<template>
  <IzziModal
    v-model="isOpen"
    :title="`Delete ${items.length} ${itemNoun}?`"
    @close="emit('cancel')"
  >
    <div class="grid gap-4">
      <p class="text-text-muted">
        This will permanently delete the selected {{ itemNoun }}. This action cannot be undone
      </p>

      <div
        v-if="warning"
        class="border-danger bg-danger/10 text-danger rounded-sm border-2 p-3"
        role="alert"
      >
        <p class="font-bold">{{ warning }}</p>
      </div>

      <ul
        v-if="items.length > 1"
        class="border-border max-h-48 overflow-y-auto rounded-sm border p-3"
        :aria-label="`Selected ${itemNoun}`"
      >
        <li v-for="item in items" :key="item.id">{{ item.label }}</li>
      </ul>

      <p v-else class="border-border rounded-sm border p-3 font-bold">{{ items[0]?.label }}</p>

      <div v-if="confirmationValue" class="grid gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold">Parts that would be deleted:</span>

          <span
            class="bg-surface-hover border-border rounded-full border px-2 py-0.5 font-mono font-bold"
          >
            {{ confirmationValue }}
          </span>
        </div>

        <IzziInput
          v-model="confirmationInput"
          label="Type the exact part count to confirm"
          description="This extra confirmation is required for large deletions"
          type="search"
          inputmode="numeric"
          :disabled="deleting"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <IzziButton variant="secondary" :disabled="deleting" @click="cancel">Cancel</IzziButton>

        <IzziButton variant="danger" :disabled="deleting || !canConfirm" @click="emit('confirm')">
          {{ deleting ? "Deleting..." : `Delete ${items.length} ${itemNoun}` }}
        </IzziButton>
      </div>
    </template>
  </IzziModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziInput from "@/components/ui/IzziInput.vue";
import IzziModal from "@/components/ui/IzziModal.vue";

type DeleteItem = {
  id: number;
  label: string;
};

const props = defineProps<{
  items: DeleteItem[];
  itemLabel: string;
  itemLabelPlural: string;
  deleting: boolean;
  warning?: string;
  confirmationValue?: string;
}>();

const itemNoun = computed(() =>
  props.items.length === 1 ? props.itemLabel : props.itemLabelPlural,
);

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const isOpen = ref(true);
const confirmationInput = ref("");
const canConfirm = computed(
  () => !props.confirmationValue || confirmationInput.value.trim() === props.confirmationValue,
);

watch(
  () => props.confirmationValue,
  () => {
    confirmationInput.value = "";
  },
);

function cancel(): void {
  isOpen.value = false;
  emit("cancel");
}
</script>
