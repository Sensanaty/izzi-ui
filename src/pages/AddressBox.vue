<template>
  <div class="flex flex-col rounded bg-neutral-800 p-4 min-w-[45%]">
    <h1 class="text-3xl font-bold">{{ title }}</h1>
    <p class="text-xl mt-2">{{ address }}</p>
    <p class="text-xl">{{ subAddress }}</p>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    title: string,
    address: string,
    subAddress: string
  }>();
</script>
