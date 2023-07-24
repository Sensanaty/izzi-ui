<template>
  <div class="flex flex-row items-center mb-4 w-[90%] mx-auto">
    <router-link to="/admin" class="rounded px-3 py-1 hover:text-sky-500"><ph-arrow-left :size="25" weight="bold" /></router-link>
    <h1 v-if="!isFetching" class="text-2xl font-bold ">Editing part <span class="font-mono rounded px-3 py-1 font-black bg-stone-800">{{ activePart.part_number }}</span></h1>
  </div>

  <ph-arrow-clockwise v-if="isFetching" class="mx-auto animate-spin" :size="50" />
  <EditTable v-else class="mx-auto mb-4" :part="activePart" />
</template>

<script lang="ts" async setup>
  import { useRoute } from "vue-router";
  import usePartStore from "~/store/part";
  import { onBeforeMount, onBeforeUnmount, ref } from "vue";
  import { storeToRefs } from "pinia";
  import { PhArrowLeft, PhArrowClockwise } from "@phosphor-icons/vue";
  import EditTable from "~components/admin/EditTable.vue";

  const route = useRoute();
  const parts = usePartStore();

  const { activePart } = storeToRefs(parts);

  const isFetching = ref(true);

  onBeforeMount(async () => {
    await parts.fetchPart(parseInt(<string>route.params.partId)).then(() => {
      isFetching.value = false;
    });
  });

  onBeforeUnmount(() => {
    parts.resetPart();
  });
</script>
