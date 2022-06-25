<template>
  <header>
    <div class="wrapper links">
      <RouterLink class="link" to="/">home</RouterLink>
    </div>

    <div class="wrapper actions">
      <RouterLink class="link" to="/login">login</RouterLink>

      <button class="icons" @click.prevent="toggleDark()">
        <MoonIcon v-if="isDark" class="icon" />
        <SunIcon v-else class="icon" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { toggleDark, isDark } from "~/composables/dark";
  import SunIcon from "#components/icons/SunIcon.vue";
  import MoonIcon from "#components/icons/MoonIcon.vue";
</script>

<style lang="scss" scoped>
  header {
    display: grid;
    grid-template: 1fr / 1fr 0.25fr;
    background: var(--background-accent);
    padding: 10px 20px;
    min-height: 60px;
    width: 100%;
  }

  .wrapper {
    display: flex;
    align-items: center;

    &.actions { justify-content: flex-end; }
  }

  .link {
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 3px;
    display: flex;
    align-items: center;
    background: var(--color);
    color: var(--background);
    padding: 8px 20px;
    margin: 0 10px;

    &:hover {
      color: var(--accent);
    }
  }

  .icons {
    margin-left: 20px;
    height: 70%;
    max-height: 40px;
    width: auto;
    background: transparent;
  }

  .icon {
    height: 100%;
    width: auto;
    transition: fill 110ms ease-in-out;
  }
</style>
