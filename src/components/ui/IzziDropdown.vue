<template>
  <div ref="dropdownElement" class="relative" @focusout="handleFocusOut">
    <button
      ref="triggerElement"
      v-bind="attrs"
      :id="triggerId"
      class="bg-input focus:ring-focus-ring flex h-10 w-full items-center justify-between gap-2 rounded-sm border-2 px-3 py-2 text-left outline-none focus:ring-2 disabled:cursor-not-allowed disabled:text-text-muted"
      :class="error || invalid ? 'border-danger!' : 'border-border!'"
      type="button"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-errormessage="error ? errorId : undefined"
      :aria-expanded="isOpen"
      :aria-invalid="Boolean(error) || invalid"
      :aria-activedescendant="searchable ? undefined : activeOptionId"
      :disabled="disabled"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <span class="min-w-0 flex-1 truncate">
        <slot name="value" :option="selectedOption">
          {{ selectedOption?.label ?? placeholder }}
        </slot>
      </span>
      <ChevronDown class="size-4 shrink-0" aria-hidden="true" />
    </button>

    <div
      v-if="isOpen"
      class="bg-surface-raised border-border absolute z-10 mt-1 grid max-h-80 w-max min-w-80 max-w-screen-sm gap-2 overflow-hidden rounded-sm border-2 p-2 shadow-lg"
    >
      <IzziInput
        v-if="searchable"
        ref="searchInput"
        v-model="query"
        clearable
        :aria-controls="listboxId"
        :aria-activedescendant="activeOptionId"
        :aria-label="`Search ${searchLabel}`"
        role="searchbox"
        @keydown="handleSearchKeydown"
      />

      <p
        v-if="filteredOptions.length === 0"
        class="text-text-muted px-2 py-1 text-sm"
        role="status"
      >
        No matching options.
      </p>

      <ul
        v-else
        :id="listboxId"
        class="grid max-h-52 gap-1 overflow-y-auto"
        role="listbox"
        :aria-labelledby="triggerId"
      >
        <li
          v-for="(option, index) in filteredOptions"
          :id="optionId(index)"
          :key="option.value"
          class="min-w-0 cursor-pointer break-words rounded-sm px-2 py-1.5 outline-none"
          :class="{
            'bg-primary text-on-primary':
              option.value === model && hoveredIndex !== index && activeIndex !== index,
            'bg-surface-hover': hoveredIndex === index || index === activeIndex,
            'ring-focus-ring ring-2 ring-inset': index === activeIndex,
          }"
          role="option"
          :aria-selected="option.value === model"
          @mouseenter="handleOptionMouseEnter(index)"
          @mouseleave="hoveredIndex = -1"
          @mousedown.prevent
          @click="select(option)"
        >
          <slot
            name="option"
            :option="option"
            :selected="option.value === model"
            :active="index === activeIndex"
            :hovered="index === hoveredIndex"
          >
            {{ option.label }}
          </slot>
        </li>
      </ul>
    </div>

    <p v-if="error" :id="errorId" class="text-danger" role="alert" aria-live="polite">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  useTemplateRef,
  watch,
} from "vue";
import { ChevronDown } from "@lucide/vue";
import IzziInput from "@/components/ui/IzziInput.vue";

export type IzziDropdownOption = {
  value: string;
  label: string;
  searchText?: string;
};

type IzziDropdownProps = {
  id?: string;
  options: readonly IzziDropdownOption[];
  placeholder?: string;
  clearable?: boolean;
  emptyOptionLabel?: string;
  searchable?: boolean;
  searchLabel?: string;
  error?: string | null;
  invalid?: boolean;
  disabled?: boolean;
};

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<IzziDropdownProps>(), {
  id: undefined,
  placeholder: "Choose an option",
  clearable: false,
  emptyOptionLabel: "No selection",
  searchable: false,
  searchLabel: "options",
  error: null,
  invalid: false,
});

const model = defineModel<string>({ default: "" });

const attrs = useAttrs();

const isOpen = ref(false);
const query = ref("");
const typeaheadQuery = ref("");
const activeIndex = ref(-1);
const hoveredIndex = ref(-1);

const dropdownElement = useTemplateRef<HTMLElement>("dropdownElement");
const triggerElement = useTemplateRef<HTMLButtonElement>("triggerElement");
const searchInput = useTemplateRef<InstanceType<typeof IzziInput>>("searchInput");

const componentId = useId();

const dropdownOptions = computed<readonly IzziDropdownOption[]>(() => {
  if (!props.clearable || props.options.some((option) => option.value === "")) {
    return props.options;
  }

  return [{ value: "", label: props.emptyOptionLabel }, ...props.options];
});

const triggerId = props.id ?? `izzi-dropdown-${componentId}`;
const listboxId = `${triggerId}-listbox`;
const errorId = `${triggerId}-error`;

const filteredOptions = computed(() => {
  const normalizedQuery = normalizeSearchText(query.value.trim());

  if (!normalizedQuery) return dropdownOptions.value;

  return dropdownOptions.value.filter((option) =>
    [option.label, option.searchText ?? ""].some((text) =>
      normalizeSearchText(text).includes(normalizedQuery),
    ),
  );
});

const selectedOption = computed(() => props.options.find((option) => option.value === model.value));

const activeOptionId = computed(() =>
  activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined,
);

function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase();
}

function optionId(index: number): string {
  return `${listboxId}-option-${index}`;
}

watch(filteredOptions, (options) => {
  hoveredIndex.value = -1;

  if (options.length === 0) {
    activeIndex.value = -1;

    return;
  }

  if (activeIndex.value >= options.length) activeIndex.value = 0;
});

watch(activeIndex, async (index) => {
  if (index < 0) return;

  await nextTick();

  document.getElementById(optionId(index))?.scrollIntoView({ block: "nearest" });
});

function setActiveToSelected(): void {
  const selectedIndex = filteredOptions.value.findIndex((option) => option.value === model.value);
  activeIndex.value = selectedIndex >= 0 ? selectedIndex : 0;
}

async function open(): Promise<void> {
  if (props.disabled) return;

  isOpen.value = true;
  query.value = "";
  setActiveToSelected();

  await nextTick();

  if (props.searchable) searchInput.value?.focus();
}

function close({ restoreFocus = false }: { restoreFocus?: boolean } = {}): void {
  isOpen.value = false;

  query.value = "";
  typeaheadQuery.value = "";
  activeIndex.value = -1;
  hoveredIndex.value = -1;

  if (restoreFocus) triggerElement.value?.focus();
}

function toggle(): void {
  if (isOpen.value) {
    close();

    return;
  }

  void open();
}

function handleOptionMouseEnter(index: number): void {
  hoveredIndex.value = index;
  activeIndex.value = index;
}

function select(option: IzziDropdownOption): void {
  model.value = option.value;

  close({ restoreFocus: true });
}

function moveActive(offset: number): void {
  const optionCount = filteredOptions.value.length;

  if (optionCount === 0) return;

  if (activeIndex.value < 0) {
    activeIndex.value = offset > 0 ? 0 : optionCount - 1;

    return;
  }

  activeIndex.value = (activeIndex.value + offset + optionCount) % optionCount;
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();

    if (!isOpen.value) {
      void open();

      return;
    }

    moveActive(event.key === "ArrowDown" ? 1 : -1);

    return;
  }

  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    close({ restoreFocus: true });

    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    const activeOption = filteredOptions.value[activeIndex.value];

    if (isOpen.value && !props.searchable && activeOption) {
      select(activeOption);

      return;
    }

    toggle();

    return;
  }

  if (!props.searchable && isTypeaheadKey(event)) {
    event.preventDefault();
    activateTypeahead(event.key);
  }
}

function isTypeaheadKey(event: KeyboardEvent): boolean {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
}

function activateTypeahead(key: string): void {
  const isRepeatedKey = typeaheadQuery.value === key;
  const candidateQuery = isRepeatedKey ? key : `${typeaheadQuery.value}${key}`;
  const matchingIndex = findMatchingOption(candidateQuery, isRepeatedKey);
  const nextIndex = matchingIndex >= 0 ? matchingIndex : findMatchingOption(key, false);

  if (nextIndex < 0) {
    resetTypeahead();

    return;
  }

  if (!isOpen.value) void open();

  typeaheadQuery.value = matchingIndex >= 0 ? candidateQuery : key;
  activeIndex.value = nextIndex;
  resetTypeahead();
}

function findMatchingOption(searchText: string, cycleFromActive: boolean): number {
  const normalizedSearchText = searchText.toLocaleLowerCase();
  const options = props.options;
  const startingIndex = cycleFromActive ? activeIndex.value + 1 : 0;

  for (let offset = 0; offset < options.length; offset += 1) {
    const index = (startingIndex + offset) % options.length;
    const option = options[index];

    if (option?.label.toLocaleLowerCase().startsWith(normalizedSearchText)) return index;
  }

  return -1;
}

let typeaheadResetTimeout: ReturnType<typeof setTimeout> | undefined;

function resetTypeahead(): void {
  if (typeaheadResetTimeout) clearTimeout(typeaheadResetTimeout);

  typeaheadResetTimeout = setTimeout(() => {
    typeaheadQuery.value = "";
  }, 500);
}

function handleSearchKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      moveActive(1);

      return;
    case "ArrowUp":
      event.preventDefault();
      moveActive(-1);

      return;
    case "Home":
      event.preventDefault();
      activeIndex.value = 0;

      return;
    case "End":
      event.preventDefault();
      activeIndex.value = filteredOptions.value.length - 1;

      return;

    case "Enter": {
      const activeOption = filteredOptions.value[activeIndex.value];

      if (activeOption) {
        event.preventDefault();
        select(activeOption);
      }

      return;
    }

    case "Escape":
      event.preventDefault();
      close({ restoreFocus: true });

      return;
  }
}

function handleFocusOut(event: FocusEvent): void {
  if (!isOpen.value) return;

  const nextTarget = event.relatedTarget;

  // A null relatedTarget also covers transient blurs from clicking non-focusable
  // areas of the popup itself, so only keyboard-style focus moves close the popup.
  if (!(nextTarget instanceof Node) || dropdownElement.value?.contains(nextTarget)) return;

  close();
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (!dropdownElement.value?.contains(event.target as Node)) close();
}

onMounted(() => document.addEventListener("pointerdown", handleDocumentPointerDown));

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handleDocumentPointerDown);

  if (typeaheadResetTimeout) clearTimeout(typeaheadResetTimeout);
});
</script>
