<template>
  <IzziModal
    v-model="isOpen"
    :title="`Delete ${items.length} ${itemNoun}?`"
    @close="emit('cancel')"
  >
    <p class="text-text-muted">
      This will permanently delete the selected {{ itemNoun }}. This action cannot be undone
    </p>

    <ul
      v-if="items.length > 1"
      class="border-border mt-4 max-h-48 overflow-y-auto rounded-sm border p-3"
      :aria-label="`Selected ${itemNoun}`"
    >
      <li v-for="item in items" :key="item.id">{{ item.label }}</li>
    </ul>

    <p v-else class="mt-4 font-bold">{{ items[0]?.label }}</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <IzziButton variant="secondary" :disabled="deleting" @click="cancel">Cancel</IzziButton>

        <IzziButton variant="danger" :disabled="deleting" @click="emit('confirm')">
          {{ deleting ? "Deleting..." : `Delete ${items.length} ${itemNoun}` }}
        </IzziButton>
      </div>
    </template>
  </IzziModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import IzziButton from "@/components/ui/IzziButton.vue";
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
}>();

const itemNoun = computed(() =>
  props.items.length === 1 ? props.itemLabel : props.itemLabelPlural,
);

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const isOpen = ref(true);

function cancel(): void {
  isOpen.value = false;
  emit("cancel");
}
</script>
