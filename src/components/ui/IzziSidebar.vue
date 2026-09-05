<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-40" aria-label="Sidebar backdrop">
      <div class="absolute inset-0 bg-black/50" @click="close" />

      <aside
        class="bg-input text-text absolute top-0 right-0 flex h-full w-full flex-col shadow-md"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        :style="{ width: `${sidebarWidth}%` }"
        @click.stop
      >
        <button
          class="bg-input border-border absolute top-1/2 -left-4 z-10 flex h-16 w-8 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-sm border-2 p-0 shadow-md"
          type="button"
          role="separator"
          aria-label="Resize sidebar"
          :aria-valuemin="MIN_WIDTH_PERCENT"
          :aria-valuemax="MAX_WIDTH_PERCENT"
          :aria-valuenow="sidebarWidth"
          @keydown="handleResizeKeydown"
          @pointerdown="startResize"
        >
          <GripVertical class="text-accent size-5" aria-hidden="true" />
        </button>
        <header class="border-border flex items-center justify-between gap-4 border-b p-4">
          <h2 class="font-bold text-xl">{{ title }}</h2>

          <div class="flex items-center gap-2">
            <slot name="header-actions" />

            <IzziButton
              size="sm"
              variant="ghost"
              rounded
              flat
              :aria-label="`Close ${title}`"
              @click="close"
            >
              <X aria-hidden="true" class="size-4" />
            </IzziButton>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto p-4">
          <slot />
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { GripVertical, X } from "@lucide/vue";
import IzziButton from "@/components/ui/IzziButton.vue";

defineProps<{
  title: string;
  ariaLabel?: string;
}>();

const SIDEBAR_WIDTH_STORAGE_KEY = "izzi-sidebar-width-percent";
const MIN_WIDTH_PERCENT = 25;
const MAX_WIDTH_PERCENT = 75;
const DEFAULT_WIDTH_PERCENT = 50;

const modelValue = defineModel<boolean>({ required: true });
const sidebarWidth = ref(getStoredSidebarWidth());
const emit = defineEmits<{ close: [] }>();
let isResizing = false;

function getStoredSidebarWidth(): number {
  const storedValue = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);

  if (storedValue === null) return DEFAULT_WIDTH_PERCENT;

  const storedWidth = Number(storedValue);

  return Number.isFinite(storedWidth) ? clampWidth(storedWidth) : DEFAULT_WIDTH_PERCENT;
}

function clampWidth(width: number): number {
  return Math.min(Math.max(width, MIN_WIDTH_PERCENT), MAX_WIDTH_PERCENT);
}

function close(): void {
  modelValue.value = false;
  emit("close");
}

function startResize(event: PointerEvent): void {
  if (event.button !== 0) return;

  isResizing = true;
  window.addEventListener("pointermove", resizeSidebar);
  window.addEventListener("pointerup", stopResize);
  event.preventDefault();
}

function resizeSidebar(event: PointerEvent): void {
  if (!isResizing) return;

  const width = ((window.innerWidth - event.clientX) / window.innerWidth) * 100;
  sidebarWidth.value = clampWidth(width);
  localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth.value));
}

function stopResize(): void {
  isResizing = false;
  window.removeEventListener("pointermove", resizeSidebar);
  window.removeEventListener("pointerup", stopResize);
}

function handleResizeKeydown(event: KeyboardEvent): void {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

  const change = event.key === "ArrowLeft" ? 1 : -1;
  sidebarWidth.value = clampWidth(sidebarWidth.value + change);
  localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth.value));
  event.preventDefault();
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") close();
}

let previousBodyOverflow = "";

function updateBodyScrollLock(isOpen: boolean): void {
  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);

    return;
  }

  document.body.style.overflow = previousBodyOverflow;
  window.removeEventListener("keydown", handleKeydown);
}

watch(modelValue, updateBodyScrollLock, { immediate: true });

onBeforeUnmount(() => {
  stopResize();
  updateBodyScrollLock(false);
});
</script>
