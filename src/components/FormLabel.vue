<template>
  <label :for="labelFor">
    {{ text }}
    <Transition name="fade" mode="out-in">
      <span v-if="condition">can't be blank</span>
    </Transition>
  </label>
</template>

<script setup lang="ts">
  import { defineProps } from "vue";

  defineProps<{
    text: string,
    labelFor: string,
    condition: boolean
  }>();
</script>

<style lang="scss" scoped>
  span { color: red; font-size: 1.2rem }

  .fade-enter-active, .fade-leave-active { transition: opacity 110ms ease-in-out }
  .fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
