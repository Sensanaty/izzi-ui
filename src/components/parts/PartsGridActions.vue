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
        ref="menuElementRef"
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
import { nextTick, onBeforeUnmount, ref, useTemplateRef } from "vue";
import { Settings } from "@lucide/vue";
import { useRoute, useRouter } from "vue-router";
import IzziButton from "@/components/ui/IzziButton.vue";
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

type ActionType = "edit" | "quote" | "full" | "part-number" | "delete";

type Action = {
  label: string;
  type: ActionType;
};

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();

const actions: Action[] = [
  { label: "Edit part", type: "edit" },
  { label: "Copy part number", type: "part-number" },
  { label: "Copy quote details", type: "quote" },
  { label: "Copy full details", type: "full" },
  { label: "Delete part", type: "delete" },
];

const isMenuOpen = ref(false);

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
  document.addEventListener("click", closeMenu);

  void nextTick(() => menuElement.value?.focus());
}

function closeMenu() {
  isMenuOpen.value = false;
  triggerElement = null;

  document.removeEventListener("click", closeMenu);
}

async function runAction(type: ActionType) {
  const part = props.params.data;

  if (!part) return;

  switch (type) {
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
