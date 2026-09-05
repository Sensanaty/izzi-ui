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
      <Logs
        class="size-4 transition-colors"
        :class="{ 'text-accent': isMenuOpen }"
        :stroke-width="2.5"
        aria-hidden="true"
      />
    </IzziButton>

    <Teleport to="body">
      <div
        v-if="isMenuOpen"
        ref="menuElementRef"
        class="bg-surface-raised border-border fixed z-50 grid w-max gap-1 rounded-sm border p-2 shadow-md"
        role="menu"
        tabindex="-1"
        :style="menuStyle"
      >
        <button
          v-for="action in actions"
          :key="action.type"
          class="text-text hover:bg-surface-hover flex items-center gap-2 rounded-sm px-2 py-1 text-left whitespace-nowrap"
          type="button"
          role="menuitem"
          @click="runAction(action.type)"
        >
          <component :is="action.icon" class="size-4" aria-hidden="true" />
          {{ action.label }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useTemplateRef } from "vue";
import type { Component } from "vue";
import { ClipboardCopy, Copy, Eye, Logs, Pencil, Quote, Trash2 } from "@lucide/vue";
import { useRoute, useRouter } from "vue-router";
import IzziButton from "@/components/ui/IzziButton.vue";
import { useExclusiveActionMenu } from "@/composables/useExclusiveActionMenu";
import { Route } from "@/router/constants";

import type { Part } from "@/lib/schemas/part";
import type { ICellRendererParams } from "ag-grid-community";

export type PartsGridActionsParams = ICellRendererParams<Part> & {
  copyDetailsForParts: (parts: Part[], type: "quote" | "full") => Promise<void>;
  copyPartNumber: (part: Part) => Promise<void>;
  onDelete: (part: Part) => void;
};

type Props = {
  params: PartsGridActionsParams;
};

type ActionType = "view" | "edit" | "quote" | "full" | "part-number" | "delete";

type Action = {
  icon: Component;
  label: string;
  type: ActionType;
};

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();

const actions: Action[] = [
  { icon: Eye, label: "View part", type: "view" },
  { icon: Pencil, label: "Edit part", type: "edit" },
  { icon: Copy, label: "Copy part number", type: "part-number" },
  { icon: Quote, label: "Copy quote details", type: "quote" },
  { icon: ClipboardCopy, label: "Copy full details", type: "full" },
  { icon: Trash2, label: "Delete part", type: "delete" },
];

const isMenuOpen = ref(false);
const { registerMenu, unregisterMenu } = useExclusiveActionMenu();

const menuElement = useTemplateRef<HTMLDivElement>("menuElementRef");
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
  registerMenu(closeMenu);
  document.addEventListener("click", closeMenu);
  document.addEventListener("scroll", updateMenuPosition, true);
  window.addEventListener("resize", updateMenuPosition);

  void nextTick(() => {
    positionMenu(triggerBounds);
    menuElement.value?.focus();
  });
}

function positionMenu(triggerBounds: DOMRect): void {
  const menu = menuElement.value;

  if (!menu) return;

  const menuBottom = triggerBounds.bottom + 4 + menu.offsetHeight;
  const top =
    menuBottom > window.innerHeight
      ? Math.max(4, triggerBounds.top - menu.offsetHeight - 4)
      : triggerBounds.bottom + 4;

  menuStyle.value = {
    left: `${triggerBounds.left}px`,
    top: `${top}px`,
  };
}

function updateMenuPosition(): void {
  if (!isMenuOpen.value || !triggerElement) return;

  const triggerBounds = triggerElement.getBoundingClientRect();

  if (
    triggerBounds.bottom < 0 ||
    triggerBounds.top > window.innerHeight ||
    triggerBounds.right < 0 ||
    triggerBounds.left > window.innerWidth
  ) {
    closeMenu();

    return;
  }

  positionMenu(triggerBounds);
}

function closeMenu() {
  isMenuOpen.value = false;
  triggerElement = null;
  unregisterMenu(closeMenu);

  document.removeEventListener("click", closeMenu);
  document.removeEventListener("scroll", updateMenuPosition, true);
  window.removeEventListener("resize", updateMenuPosition);
}

async function runAction(type: ActionType) {
  const part = props.params.data;

  if (!part) return;

  switch (type) {
    case "view":
      await router.replace({ query: { ...route.query, part: String(part.id) } });
      break;
    case "edit":
      await router.push({
        name: Route.PART_EDIT,
        params: { id: part.id },
        query: route.query,
      });
      break;
    case "part-number":
      void props.params.copyPartNumber(part);
      break;
    case "full":
    case "quote":
      props.params.copyDetailsForParts([part], type);
      break;
    case "delete":
    default:
      props.params.onDelete(part);
      break;
  }

  closeMenu();
}

onBeforeUnmount(closeMenu);
</script>
