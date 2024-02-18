<template>
  <BaseModal :is-open="isOpen" :large="false" title="Keyboard Shortcuts" @close="$emit('close')">
    <p>
      <code>CTRL/⌘ + K</code>
      Focus on Searchbar
    </p>

    <p>
      <code>Shift + -&gt;</code>
      Fetch next page
    </p>

    <p>
      <code>Shift + &lt;-</code>
      Fetch previous page
    </p>
  </BaseModal>
</template>

<script setup lang="ts">
  import BaseModal from "~components/base/BaseModal.vue";

  defineProps<{ isOpen: boolean }>();
  defineEmits(["close"]);
</script>

<style scoped>
p { @apply mb-4 font-mono font-bold; }
p > code { @apply bg-stone-900 p-2 mr-3 rounded text-center; }
</style>
