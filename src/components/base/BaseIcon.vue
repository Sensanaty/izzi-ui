<template>
  <component :is="props.name" :size="props.size" :weight="props.weight" color="currentColor" />
</template>

<script setup lang="ts">
  import { BaseIconProps } from "~/types/componentProps";

  const props = withDefaults(defineProps<BaseIconProps>(), {
    size: 28,
    weight: "duotone"
  });
</script>
