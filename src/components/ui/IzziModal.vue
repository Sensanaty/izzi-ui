<template>
  <dialog
    ref="dialogElement"
    class="bg-surface-raised border-border text-text w-full rounded-sm border-2 p-0 shadow-md"
    :class="{
      'max-w-lg': props.size === 'sm',
      'max-w-2xl': props.size === 'md',
      'max-w-4xl': props.size === 'lg',
    }"
    :aria-label="props.title ? undefined : props.ariaLabel"
    :aria-labelledby="props.title ? titleId : undefined"
    @cancel="handleCancel"
    @close="handleClose"
    @click="handleDialogClick"
  >
    <div class="grid gap-4 p-4">
      <header class="border-border -mx-4 -mt-4 flex items-start justify-between gap-4 border-b p-4">
        <div v-if="$slots.header || props.title" class="grid gap-1">
          <slot name="header">
            <h2 :id="titleId" class="font-bold text-xl">{{ props.title }}</h2>
          </slot>
        </div>

        <IzziButton
          class="-mr-2 -mt-2 shrink-0"
          size="sm"
          variant="ghost"
          rounded
          flat
          aria-label="Close dialog"
          @click="closeDialog"
        >
          <X aria-hidden="true" class="size-4" />
        </IzziButton>
      </header>

      <div>
        <slot />
      </div>

      <footer v-if="$slots.footer" class="border-border -mx-4 -mb-4 border-t p-4">
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { X } from "@lucide/vue";
import IzziButton from "@/components/ui/IzziButton.vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    ariaLabel?: string;
    size?: "sm" | "md" | "lg";
    closeOnBackdrop?: boolean;
  }>(),
  { title: undefined, ariaLabel: "Dialog", size: "sm", closeOnBackdrop: true },
);

const isOpen = defineModel<boolean>({ required: true });
const emit = defineEmits<{
  close: [];
}>();

const dialogElement = ref<HTMLDialogElement | null>(null);
const titleId = `izzi-modal-title-${Math.random().toString(36).slice(2)}`;
let returnFocusElement: HTMLElement | null = null;

function showDialog(): void {
  const dialog = dialogElement.value;

  if (!dialog || dialog.open) return;

  returnFocusElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialog.showModal();
  void nextTick(() => focusFirstElement(dialog));
}

function closeDialog(): void {
  if (dialogElement.value?.open) dialogElement.value.close();
  else isOpen.value = false;
}

function handleCancel(event: Event): void {
  event.preventDefault();
  closeDialog();
}

function handleClose(): void {
  isOpen.value = false;
  emit("close");
  returnFocusElement?.focus();
  returnFocusElement = null;
}

function handleDialogClick(event: MouseEvent): void {
  if (props.closeOnBackdrop && event.target === dialogElement.value) closeDialog();
}

function focusFirstElement(dialog: HTMLDialogElement): void {
  const focusableElement = dialog.querySelector<HTMLElement>(
    '[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  focusableElement?.focus();
}

watch(isOpen, (open) => {
  if (open) showDialog();
  else closeDialog();
});

onMounted(() => {
  if (isOpen.value) showDialog();
});

onBeforeUnmount(() => {
  if (dialogElement.value?.open) dialogElement.value.close();
});
</script>

<style scoped>
@reference "#style.css";

dialog {
  position: fixed;
  inset: 0;
  margin: auto;
  max-height: calc(100% - 2rem);
}

dialog::backdrop {
  @apply bg-black/50;
}
</style>
