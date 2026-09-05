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
import { Logs } from "@lucide/vue";
import { useRoute, useRouter } from "vue-router";
import IzziButton from "@/components/ui/IzziButton.vue";
import { useExclusiveActionMenu } from "@/composables/useExclusiveActionMenu";
import { Route } from "@/router/constants";

import type { Company } from "@/lib/schemas/company";
import type { ICellRendererParams } from "ag-grid-community";

type Props = {
  params: ICellRendererParams<Company> & { onDelete: (company: Company) => void };
};

type ActionType = "view" | "edit" | "delete";
type Action = { label: string; type: ActionType };

const actions: Action[] = [
  { label: "View company", type: "view" },
  { label: "Edit company", type: "edit" },
  { label: "Delete company", type: "delete" },
];
const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();
const isMenuOpen = ref(false);
const { registerMenu, unregisterMenu } = useExclusiveActionMenu();
const menuElement = ref<HTMLDivElement | null>(null);
const menuStyle = ref({ left: "0px", top: "0px" });

let triggerElement: HTMLButtonElement | null = null;

function toggleMenu(event: MouseEvent): void {
  if (isMenuOpen.value) {
    closeMenu();

    return;
  }

  triggerElement = event.currentTarget instanceof HTMLButtonElement ? event.currentTarget : null;

  if (!triggerElement) return;

  const bounds = triggerElement.getBoundingClientRect();
  menuStyle.value = { left: `${bounds.left}px`, top: `${bounds.bottom + 4}px` };
  isMenuOpen.value = true;
  registerMenu(closeMenu);
  document.addEventListener("click", closeMenu);
  document.addEventListener("scroll", updateMenuPosition, true);
  window.addEventListener("resize", updateMenuPosition);
  void nextTick(() => {
    positionMenu(bounds);
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

  menuStyle.value = { left: `${triggerBounds.left}px`, top: `${top}px` };
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

function closeMenu(): void {
  isMenuOpen.value = false;
  triggerElement = null;
  unregisterMenu(closeMenu);
  document.removeEventListener("click", closeMenu);
  document.removeEventListener("scroll", updateMenuPosition, true);
  window.removeEventListener("resize", updateMenuPosition);
}

function runAction(type: ActionType): void {
  const company = props.params.data;

  if (!company) return;

  if (type === "view") {
    void router.replace({
      query: { ...router.currentRoute.value.query, company: String(company.id) },
    });
  } else if (type === "edit") {
    void router.push({ name: Route.COMPANY_EDIT, params: { id: company.id }, query: route.query });
  } else if (type === "delete") {
    props.params.onDelete(company);
  }

  closeMenu();
}

onBeforeUnmount(closeMenu);
</script>
