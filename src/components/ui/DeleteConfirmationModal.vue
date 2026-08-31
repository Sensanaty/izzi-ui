<template>
  <IzziModal v-model="isOpen" :title="`Delete ${itemLabel}?`" @close="emit('cancel')">
    <p class="text-text-muted">This action cannot be undone</p>

    <ul v-if="items.length > 1" class="border-border mt-4 max-h-48 overflow-y-auto rounded-sm border p-3">
      <li v-for="item in items" :key="item.id">{{ item.label }}</li>
    </ul>
    <p v-else class="mt-4 font-bold">{{ items[0]?.label }}</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <label v-if="items.length === 1" class="mr-auto flex items-center gap-2">
          <input v-model="dontAskAgain" type="checkbox" />
          <span>Don't ask again</span>
        </label>
        <IzziButton variant="secondary" :disabled="deleting" @click="cancel">Cancel</IzziButton>
        <IzziButton variant="danger" :disabled="deleting" @click="confirmDeletion">
          {{ deleting ? "Deleting..." : "Delete" }}
        </IzziButton>
      </div>
    </template>
  </IzziModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziModal from "@/components/ui/IzziModal.vue";

type DeleteItem = {
  id: number;
  label: string;
};

const props = defineProps<{
  items: DeleteItem[];
  itemLabel: string;
  deleting: boolean;
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [dontAskAgain: boolean];
}>();

const isOpen = ref(true);
const dontAskAgain = ref(false);

function cancel(): void {
  isOpen.value = false;
  emit("cancel");
}

function confirmDeletion(): void {
  emit("confirm", props.items.length === 1 && dontAskAgain.value);
}
</script>
