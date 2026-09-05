<template>
  <IzziModal v-model="isOpen" :title="content.title" size="md">
    <div class="grid gap-6">
      <p class="text-text-muted">{{ content.introduction }}</p>

      <section v-for="section in content.sections" :key="section.title" class="grid gap-2">
        <h3 class="font-bold text-lg">{{ section.title }}</h3>

        <ul class="grid gap-2">
          <li v-for="item in section.items" :key="item.label" class="flex gap-3">
            <span
              class="bg-surface-hover text-accent mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm"
            >
              <component :is="item.icon" aria-hidden="true" class="size-4" />
            </span>

            <span>
              <strong>{{ item.label }}</strong>
              <span class="text-text-muted ml-1">{{ item.description }}</span>
            </span>
          </li>
        </ul>
      </section>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <IzziButton variant="secondary" @click="isOpen = false">Close</IzziButton>
      </div>
    </template>
  </IzziModal>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import type { Component } from "vue";
import { Columns3, Keyboard, MousePointer2, TableProperties } from "@lucide/vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziModal from "@/components/ui/IzziModal.vue";
import { Route, RoutePath } from "@/router/constants";

const isOpen = defineModel<boolean>({ required: true });

type HelpItem = {
  label: string;
  description: string;
  icon: Component;
};

type HelpSection = {
  title: string;
  items: HelpItem[];
};

type PageHelpContent = {
  title: string;
  introduction: string;
  sections: HelpSection[];
};

const commonSections: HelpSection[] = [
  {
    title: "Keyboard shortcuts",
    items: [
      {
        label: "Ctrl/Cmd + click",
        description: "a table row to open its details in a sidebar without leaving the page",
        icon: MousePointer2,
      },
      {
        label: "Escape",
        description: "to close an open menu, sidebar, or dialog",
        icon: Keyboard,
      },
    ],
  },
];

const tableSections: HelpSection[] = [
  {
    title: "Tables",
    items: [
      {
        label: "Select rows",
        description: "with the checkboxes to enable bulk actions such as export or delete",
        icon: TableProperties,
      },
      {
        label: "Row actions",
        description: "are available from the list icon at the start of each row",
        icon: MousePointer2,
      },
      {
        label: "Sort columns",
        description: "by selecting a column header, then drag headers to change their order",
        icon: TableProperties,
      },
    ],
  },
  {
    title: "Table settings",
    items: [
      {
        label: "Table Settings",
        description:
          "controls which columns are visible and where columns are pinned while scrolling",
        icon: Columns3,
      },
      {
        label: "Reset to default settings",
        description: "restores the original columns, order, and pinning for this table",
        icon: Columns3,
      },
    ],
  },
];

const pageContent: Record<string, PageHelpContent> = {
  [Route.HOME]: {
    title: "Using the parts table",
    introduction:
      "Use the parts table to search inventory, inspect records, and perform actions on one or more parts.",
    sections: [
      ...commonSections,
      ...tableSections,
      {
        title: "Part actions",
        items: [
          {
            label: "Ctrl/Cmd + C",
            description: "copies quote details for the focused part when no text is selected",
            icon: Keyboard,
          },
          {
            label: "Copy quote details",
            description: "copies the selected parts in a format ready to use in a quote",
            icon: Keyboard,
          },
          {
            label: "Export selected or all",
            description: "downloads part data as a CSV file",
            icon: TableProperties,
          },
        ],
      },
    ],
  },
  [Route.COMPANIES]: {
    title: "Using the companies table",
    introduction:
      "Search companies, review their details, and manage company records from this table.",
    sections: [...commonSections, ...tableSections],
  },
  [Route.CLIENTS]: {
    title: "Using the contacts table",
    introduction:
      "Search contacts, review their company relationships, and manage contact records from this table.",
    sections: [...commonSections, ...tableSections],
  },
  [Route.USERS]: {
    title: "Managing users",
    introduction: "Use this page to review user access and update administrator permissions.",
    sections: [
      {
        title: "User actions",
        items: [
          {
            label: "Edit",
            description: "opens the user form so you can update account details",
            icon: MousePointer2,
          },
          {
            label: "Make admin or Remove admin",
            description: "changes administrator access after the update succeeds",
            icon: Keyboard,
          },
        ],
      },
    ],
  },
};

const formContent: PageHelpContent = {
  title: "Working with forms",
  introduction:
    "Complete the required fields, then save the record. Validation messages appear beside the fields that need attention.",
  sections: [
    {
      title: "Form actions",
      items: [
        {
          label: "Save",
          description: "submits the form and keeps your entered values when validation fails",
          icon: MousePointer2,
        },
        {
          label: "Cancel",
          description: "leaves the form without saving changes",
          icon: Keyboard,
        },
        {
          label: "Escape",
          description: "returns to the previous list when you are not editing a field",
          icon: Keyboard,
        },
      ],
    },
  ],
};

const userFormContent: PageHelpContent = {
  title: "Managing a user",
  introduction: "Update the user details, then save to apply the changes.",
  sections: formContent.sections,
};

pageContent[Route.PART_NEW] = formContent;
pageContent[Route.PART_EDIT] = formContent;
pageContent[Route.COMPANY_NEW] = formContent;
pageContent[Route.COMPANY_EDIT] = formContent;
pageContent[Route.CLIENT_NEW] = formContent;
pageContent[Route.CLIENT_EDIT] = formContent;
pageContent[Route.USER_NEW] = userFormContent;
pageContent[Route.USER_EDIT] = userFormContent;

const pagePathContent: Partial<Record<string, PageHelpContent>> = {
  [RoutePath.HOME]: pageContent[Route.HOME],
  [RoutePath.COMPANIES]: pageContent[Route.COMPANIES],
  [RoutePath.CLIENTS]: pageContent[Route.CLIENTS],
  [RoutePath.USERS]: pageContent[Route.USERS],
};

const defaultContent: PageHelpContent = {
  title: "Using this page",
  introduction: "Use the controls on this page to view and update IZZICUP records.",
  sections: [
    {
      title: "Keyboard shortcuts",
      items: [
        {
          label: "Escape",
          description: "to close an open menu, sidebar, or dialog",
          icon: Keyboard,
        },
      ],
    },
  ],
};

const props = defineProps<{
  routeName: string | symbol | null | undefined;
  routePath: string;
}>();

const content = computed(
  () => pagePathContent[props.routePath] ?? pageContent[String(props.routeName)] ?? defaultContent,
);

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

function handleShortcut(event: KeyboardEvent): void {
  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    isOpen.value = false;

    return;
  }

  if (
    event.key !== "?" ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    isTypingTarget(event.target)
  ) {
    return;
  }

  event.preventDefault();
  isOpen.value = !isOpen.value;
}

onMounted(() => document.addEventListener("keydown", handleShortcut));
onBeforeUnmount(() => document.removeEventListener("keydown", handleShortcut));
</script>
