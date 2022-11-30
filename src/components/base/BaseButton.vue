<template>
  <button class="flex text-xl leading-tight bg-gray-700 py-1.5 px-4 rounded hover:bg-gray-600">
    <BaseIcon v-if="props.iconName" :name="props.iconName" :size="props.iconSize" :weight="props.iconWeight" />
    <slot />
    <slot name="icon-end" />
  </button>
</template>

<script setup lang="ts">
  import BaseIcon from "~components/base/BaseIcon.vue";
  import { BaseButtonProps } from "~/types/componentProps";

  const props = defineProps<BaseButtonProps>();
</script>
