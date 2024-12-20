<template>
  <label
    :for="htmlFor"
    class="cursor-pointer whitespace-nowrap"
    :class="[{ 'font-mono': mono }, labelClass]"
  >
    <slot />
    <sup v-if="required" aria-hidden="true" class="text-red-600">*</sup>
  </label>
</template>

<script setup lang="ts">
interface LabelProps {
  htmlFor: string;
  required?: boolean;
  mono?: boolean;
  labelClass?: string;
}

defineProps<LabelProps>();
</script>
