<template>
  <BaseModal :model-value="true" :title="`Part history #${currentPart.id}`" size="xlarge" @close="emit('close')">
    <h1 v-if="partStore.isFetchingVersions" class="text-center text-3xl">
      Fetching versions...
    </h1>

    <div v-else-if="!partStore.isFetchingVersions && partStore.currentPartVersions.length > 0" class="grid grid-cols-2 gap-x-2">
      <div class="flex flex-col gap-y-2 border-r-2">
        <h1 class="h-8 text-center font-bold">
          Current Part
        </h1>

        <div v-for=" key in orderedKeys" :key="key" class="p-0.5 font-mono transition-colors" :class="{ 'bg-emerald-900': isChanged(key) }">
          <span class="font-bold">{{ labelize(key) }}</span>
          <span>: {{ currentPart[key] ? currentPart[key] : 'N/A' }}</span>
        </div>
      </div>

      <div class="relative flex flex-col gap-y-2">
        <div class="flex h-8 items-center justify-between">
          <BaseButton :disabled="currentPage === 0" @click="prevPage">
            <PhArrowLeft size="1.5rem" />
          </BaseButton>

          <h1 class="font-mono font-bold">
            {{ new Date(currentVersion.created_at).toLocaleString() }}
          </h1>

          <BaseButton :disabled="currentPage === partStore.currentPartVersions.length - 1" @click="nextPage">
            <PhArrowRight size="1.5rem" />
          </BaseButton>
        </div>

        <div class="flex flex-col gap-y-2">
          <div
            v-for="key in orderedKeys"
            :key="key"
            class="p-0.5 font-mono transition-colors"
            :class="{ 'diff cursor-pointer bg-emerald-900 hover:bg-emerald-700': isChanged(key) }"
            @click.prevent="(event) => chooseVersion(event, key)"
          >
            <span class="font-bold">{{ labelize(key) }}</span>
            <span>: {{ currentVersion.object[key] ? currentVersion.object[key] : 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <h1>No previous versions of this part found</h1>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import BaseModal from "@/components/Base/BaseModal.vue";
import usePartsStore from "@/stores/parts.ts";
import { PartSchema, type CreatePart, type UpdatePart, type Part, type Version } from "@/schemas";
import { labelize } from "@/utils/stringUtils.ts";
import { PhArrowLeft, PhArrowRight } from "@phosphor-icons/vue";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "choosePastVersion", key: keyof Part, value: unknown): void;
}>();

const props = defineProps<{
  currentPart: CreatePart | UpdatePart;
}>();

const partStore = usePartsStore();

onMounted(async () => {
  await partStore.getPartVersions();
});

const currentPage = ref(0);
const nextPage = () => currentPage.value += 1;
const prevPage = () => currentPage.value -= 1;

const currentVersion = computed(() => partStore.currentPartVersions[currentPage.value]);

const orderedKeys = computed(() => {
  const schemaKeys = Object.keys(PartSchema.shape);

  const allKeys = new Set([
    ...Object.keys(props.currentPart),
    ...Object.keys(currentVersion.value?.object || {}),
  ]);

  return schemaKeys.filter(key => allKeys.has(key)) as Array<keyof CreatePart>;
});

const isChanged = (key: keyof Part) => {
  if (key === "updated_at" || key === "created_at" || !currentVersion.value?.object_changes) {
    return false;
  };

  // Check if the key exists in object_changes
  if (!(key in currentVersion.value.object_changes)) {
    return false;
  };

  const changes = currentVersion.value.object_changes[key];
  if (!Array.isArray(changes) || changes.length !== 2) {
    return false;
  };

  const versionValue = changes[1];
  const currentValue = props.currentPart[key];

  return versionValue === currentValue;
};

function chooseVersion(event: MouseEvent, key: keyof Part) {
  if (event.currentTarget instanceof HTMLElement && event.currentTarget.classList.contains("diff")) {
    emit("choosePastVersion", key, currentVersion.value.object[key]);
  }
}
</script>
