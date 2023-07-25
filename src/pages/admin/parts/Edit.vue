<template>
  <div class="flex flex-row items-center mb-4 w-[90%] mx-auto">
    <RouterLink to="/admin" class="rounded px-3 py-1 hover:text-sky-500"><ph-arrow-left :size="25" weight="bold" /></RouterLink>
    <h1 v-if="!isFetching" class="text-2xl font-bold ">Editing part <span class="font-mono rounded px-3 py-1 font-black bg-stone-800">{{ activePart.part_number }}</span></h1>
  </div>

  <ph-arrow-clockwise v-if="isFetching" class="mx-auto animate-spin" :size="50" />
  <EditTable v-else class="mx-auto mb-4" :part="activePart" :is-new="false" />
</template>

<script lang="ts" async setup>
  import { PhArrowClockwise, PhArrowLeft } from "@phosphor-icons/vue";
  import { storeToRefs } from "pinia";
  import { onBeforeMount, onBeforeUnmount, ref } from "vue";
  import { useRoute } from "vue-router";

  import usePartStore from "~/store/part";
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
