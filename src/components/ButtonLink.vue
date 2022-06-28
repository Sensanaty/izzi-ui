<template>
  <RouterLink :to="url">{{ text }}</RouterLink>
</template>

<script setup lang="ts">
  import { defineProps } from "vue";

  defineProps<{
    text: string,
    url: string
  }>();
</script>

<style lang="scss" scoped>
  a {
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 3px;
    display: flex;
    align-items: center;
    background: var(--color);
    color: var(--background);
    padding: 9px 20px;
    margin: 0 10px;
    transition: background 100ms ease-in-out, color 100ms ease-in-out;

    &:hover { color: var(--accent) }
    &:active { color: var(--dark-accent) }
  }

  .router-link-exact-active {
    background: var(--accent);
    &:hover { color: var(--color) }
  }
</style>
