<template>
  <header>
    <div class="wrapper links">
      <RouterLink class="link" to="/">home</RouterLink>
      <RouterLink class="link" to="/contact">contact</RouterLink>
    </div>

    <div class="wrapper actions">
      <RouterLink v-if="!auth.loggedIn" class="link" to="/login">login</RouterLink>
      <button v-else class="link" @click.prevent="auth.logout()">logout</button>

      <MoonIcon v-if="isDark" class="icon" @click.prevent="toggleDark()" />
      <SunIcon v-else class="icon" @click.prevent="toggleDark()" />
    </div>
  </header>
</template>

<script setup lang="ts">
  import useAuthStore from "#store/auth";
  import { toggleDark, isDark } from "#composables/dark";

  import SunIcon from "#components/icons/SunIcon.vue";
  import MoonIcon from "#components/icons/MoonIcon.vue";

  const auth = useAuthStore();
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
    padding: 9px 20px;
    margin: 0 10px;
    transition: background 100ms ease-in-out, color 100ms ease-in-out;

    &:hover {
      color: var(--accent);
    }
  }

  .router-link-exact-active {
    background: var(--accent);
    &:hover { color: var(--color) }
  }

  .icon {
    cursor: pointer;
    margin-left: 20px;
    height: auto;
    width: 10%;
    transition: fill 110ms ease-in-out;
  }
</style>
