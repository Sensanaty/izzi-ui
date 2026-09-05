<template>
  <section class="border-border mt-6 grid gap-3 border-t pt-4" :aria-labelledby="headingId">
    <div class="flex items-center justify-between gap-2">
      <h3 :id="headingId" class="font-bold text-lg">{{ title }}</h3>

      <IzziButton size="sm" variant="secondary" @click="emit('add')">Add</IzziButton>
    </div>

    <form class="flex gap-2" @submit.prevent="emit('search')">
      <IzziInput
        :id="`${headingId}-search`"
        v-model="searchValue"
        class="min-w-0 flex-1"
        :aria-label="searchLabel"
        :placeholder="searchLabel"
        type="search"
        clearable
        @clear="emit('search')"
      />

      <IzziButton type="submit" :disabled="isLoading">Search</IzziButton>
    </form>

    <div class="flex justify-between gap-2">
      <div class="flex gap-2">
        <IzziButton
          variant="outline"
          :disabled="!hasPreviousPage || isLoading"
          @click="emit('first')"
        >
          First
        </IzziButton>

        <IzziButton
          variant="outline"
          :disabled="!hasPreviousPage || isLoading"
          @click="emit('previous')"
        >
          Previous
        </IzziButton>
      </div>

      <div class="flex gap-2">
        <IzziButton variant="outline" :disabled="!hasNextPage || isLoading" @click="emit('next')">
          Next
        </IzziButton>

        <IzziButton
          variant="outline"
          :disabled="!hasNextPage || isLoading"
          @click="emit('last')"
        >
          Last
        </IzziButton>
      </div>
    </div>

    <p v-if="errorMessage" class="text-danger text-sm" role="alert">{{ errorMessage }}</p>

    <p v-else-if="isLoading && !items.length" class="text-text text-sm">
      Loading {{ itemLabel }}...
    </p>

    <p v-else-if="!items.length" class="text-text text-sm">No {{ itemLabel }} found</p>

    <ul v-if="items.length" class="border-border divide-border grid divide-y rounded-sm border">
      <li v-for="item in items" :key="item.id" class="flex items-start justify-between gap-3 p-3">
        <div class="min-w-0">
          <p class="break-words font-bold">
            <template
              v-for="(segment, segmentIndex) in highlightText(itemTitle(item), highlightQuery)"
              :key="`title-${segmentIndex}`"
            >
              <span :class="{ 'text-accent font-semibold': segment.isMatch }">
                {{ segment.text }}
              </span>
            </template>
          </p>
          <p class="text-text break-words text-sm">
            <template
              v-for="(segment, segmentIndex) in highlightText(itemSubtitle(item), highlightQuery)"
              :key="`subtitle-${segmentIndex}`"
            >
              <span :class="{ 'text-accent font-semibold': segment.isMatch }">
                {{ segment.text }}
              </span>
            </template>
          </p>
          <p v-if="isPart(item)" class="text-text break-words text-sm">
            Tag:
            <template
              v-for="(segment, segmentIndex) in highlightText(item.tag ?? '-', highlightQuery)"
              :key="`tag-${segmentIndex}`"
            >
              <span :class="{ 'text-accent font-semibold': segment.isMatch }">
                {{ segment.text }}
              </span>
            </template>
          </p>
        </div>

        <div class="flex shrink-0 gap-1">
          <IzziButton size="sm" :disabled="isLoading" @click="emit('edit', item)">Edit</IzziButton>

          <IzziButton
            size="sm"
            variant="danger"
            :disabled="isLoading"
            @click="emit('delete', item)"
          >
            Delete
          </IzziButton>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziInput from "@/components/ui/IzziInput.vue";

import type { Client } from "@/lib/schemas/client";
import type { Part } from "@/lib/schemas/part";

type Item = Part | Client;
type TextSegment = { text: string; isMatch: boolean };

const props = defineProps<{
  title: string;
  itemLabel: string;
  searchLabel: string;
  items: Item[];
  search: string;
  highlightQuery: string;
  isLoading: boolean;
  errorMessage: string | null;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}>();

const emit = defineEmits<{
  search: [];
  "update:search": [value: string];
  first: [];
  previous: [];
  next: [];
  last: [];
  add: [];
  edit: [item: Item];
  delete: [item: Item];
}>();

const searchValue = computed({
  get: () => props.search,
  set: (value: string) => emit("update:search", value),
});

const headingId = computed(() => `company-${props.itemLabel}-heading`);

function highlightText(value: string, query: string): TextSegment[] {
  if (!query) return [{ text: value, isMatch: false }];

  const normalizedValue = value.toLocaleLowerCase();
  const normalizedQuery = query.toLocaleLowerCase();
  const segments: TextSegment[] = [];
  let segmentStart = 0;

  while (segmentStart < value.length) {
    const matchIndex = normalizedValue.indexOf(normalizedQuery, segmentStart);

    if (matchIndex === -1) {
      segments.push({ text: value.slice(segmentStart), isMatch: false });
      break;
    }

    if (matchIndex > segmentStart) {
      segments.push({ text: value.slice(segmentStart, matchIndex), isMatch: false });
    }

    segments.push({
      text: value.slice(matchIndex, matchIndex + query.length),
      isMatch: true,
    });
    segmentStart = matchIndex + query.length;
  }

  return segments;
}

function isPart(item: Item): item is Part {
  return "part_number" in item;
}

function itemTitle(item: Item): string {
  return isPart(item) ? item.part_number : item.name;
}

function itemSubtitle(item: Item): string {
  return "part_number" in item ? (item.description ?? "-") : (item.email ?? item.number ?? "-");
}
</script>
