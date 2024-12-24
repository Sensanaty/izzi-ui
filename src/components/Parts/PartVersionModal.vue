<template>
  <BaseModal :model-value="true" :title="`Part history #${currentPart.id} (limited to 10 history entries)`" size="xlarge" @close="emit('close')">
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

    <template #footer>
      <BaseButton class="mr-8" variant="danger" @click.prevent="deleteHistory">
        Delete history
      </BaseButton>

      <BaseButton class="mr-4" @click.prevent="resetToCurrent">
        Reset
      </BaseButton>

      <BaseButton @click.prevent="emit('close')">
        Close
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRaw, watch } from "vue";
import BaseModal from "@/components/Base/BaseModal.vue";
import usePartsStore from "@/stores/parts.ts";
import { PartSchema, type CreatePart, type UpdatePart, type Part, type Version } from "@/schemas";
import { labelize } from "@/utils/stringUtils.ts";
import { PhArrowLeft, PhArrowRight } from "@phosphor-icons/vue";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "choosePastVersion", key: keyof Part, value: unknown): void;
  (e: "reset", payload: CreatePart | UpdatePart): void;
}>();

const props = defineProps<{
  currentPart: CreatePart | UpdatePart;
}>();

const partStore = usePartsStore();

onMounted(async () => {
  await partStore.getPartVersions();
});

onBeforeUnmount(() => partStore.clearPartVersions());

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
  if (key === "updated_at" || key === "created_at") {
    return false;
  };

  return props.currentPart[key] !== currentVersion.value.object[key];
};

function chooseVersion(event: MouseEvent, key: keyof Part) {
  if (event.currentTarget instanceof HTMLElement && event.currentTarget.classList.contains("diff")) {
    emit("choosePastVersion", key, currentVersion.value.object[key]);
  }
}

const originalCurrentPart = ref(structuredClone(toRaw(props.currentPart)));

watch(() => props.currentPart.id, () => originalCurrentPart.value = structuredClone(toRaw(props.currentPart)));

function resetToCurrent() {
  emit("reset", toRaw(originalCurrentPart.value));
}

async function deleteHistory() {
  if (!confirm("Are you sure you want to delete all history for this part? This action cannot be undone, and will delete ALL past history for the currently viewed part.")) {
    return;
  } else {
    await partStore.deletePartHistory();
    await partStore.getPartVersions();
  }
}
</script>
