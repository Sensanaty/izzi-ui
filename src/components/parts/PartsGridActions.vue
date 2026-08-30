<template>
  <div class="flex h-full items-center justify-center text-sm">
    <IzziButton
      size="sm"
      variant="ghost"
      rounded
      flat
      aria-label="Open row actions"
      @click.stop="toggleMenu"
    >
      <Settings
        class="size-4 transition-colors"
        :class="{ 'text-accent': isMenuOpen }"
        aria-hidden="true"
      />
    </IzziButton>

    <Teleport to="body">
      <div
        v-if="isMenuOpen"
        ref="menuElement"
        class="bg-surface-raised border-border fixed z-50 grid w-max gap-1 rounded-sm border p-2 shadow-md"
        role="menu"
        tabindex="-1"
        :style="menuStyle"
      >
        <button
          v-for="action in actions"
          :key="action.type"
          class="text-text hover:bg-surface-hover rounded-sm px-2 py-1 text-left whitespace-nowrap"
          type="button"
          role="menuitem"
          @click="runAction(action.type)"
        >
          {{ action.label }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from "vue";
import { Settings } from "@lucide/vue";
import { useRoute, useRouter } from "vue-router";
import IzziButton from "@/components/ui/IzziButton.vue";
import { Route } from "@/router/constants";

import type { Part } from "@/lib/schemas/part";
import type { ICellRendererParams } from "ag-grid-community";

export type PartsGridActionsParams = ICellRendererParams<Part> & {
  copyDetailsForParts: (parts: Part[], type: "quote" | "full") => Promise<void>;
};

type Props = {
  params: PartsGridActionsParams;
};

type ActionType = "edit" | "quote" | "full";

type Action = {
  label: string;
  type: ActionType;
};

const actions: Action[] = [
  { label: "Edit part", type: "edit" },
  { label: "Copy quote details", type: "quote" },
  { label: "Copy full details", type: "full" },
];

const route = useRoute();
const router = useRouter();
const isMenuOpen = ref(false);
const menuElement = ref<HTMLDivElement | null>(null);
const menuStyle = ref({ left: "0px", top: "0px" });
let triggerElement: HTMLButtonElement | null = null;

function toggleMenu(event: MouseEvent): void {
  triggerElement = event.currentTarget instanceof HTMLButtonElement ? event.currentTarget : null;

  if (isMenuOpen.value) {
    closeMenu();

    return;
  }

  const triggerBounds = triggerElement?.getBoundingClientRect();

  if (!triggerBounds) return;

  menuStyle.value = {
    left: `${triggerBounds.left}px`,
    top: `${triggerBounds.bottom + 4}px`,
  };

  isMenuOpen.value = true;
  document.addEventListener("click", closeMenu);

  void nextTick(() => menuElement.value?.focus());
}

function closeMenu(): void {
  isMenuOpen.value = false;
  triggerElement = null;
  document.removeEventListener("click", closeMenu);
}

function runAction(type: ActionType): void {
  const part = props.params.data;

  if (!part) return;

  if (type === "edit") {
    void router.push({
      name: Route.PART_EDIT,
      params: { id: part.id },
      query: route.query,
    });
  } else {
    void props.params.copyDetailsForParts([part], type);
  }

  closeMenu();
}

const props = defineProps<Props>();

onBeforeUnmount(closeMenu);
</script>
