<template>
  <div class="flex flex-row items-center mb-4 w-[90%] mx-auto">
    <RouterLink to="/admin" class="rounded px-3 py-1 hover:text-sky-500"><ph-arrow-left :size="25" weight="bold" /></RouterLink>
  </div>

  <EditTable class="mx-auto mb-4" :part="{}" :is-new="true" />
</template>

<script setup lang="ts">
  import { PhArrowLeft } from "@phosphor-icons/vue";

  import EditTable from "~components/admin/EditTable.vue";
</script>
