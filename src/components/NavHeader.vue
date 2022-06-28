<template>
  <header>
    <div class="wrapper links">
      <ButtonLink url="/" text="home" />
      <ButtonLink url="/contact" text="contact" />
    </div>

    <div class="wrapper actions">
      <ButtonLink v-if="auth.loggedIn" url="/admin" text="admin" />

      <ButtonLink v-if="!auth.loggedIn" url="/login" text="login" />
      <ButtonComponent v-else text="logout" @click="auth.logout()" />

      <MoonIcon v-if="isDark" class="icon" @click.prevent="toggleDark()" />
      <SunIcon v-else class="icon" @click.prevent="toggleDark()" />
    </div>
  </header>
</template>

<script setup lang="ts">
  import useAuthStore from "#store/auth";
  import { toggleDark, isDark } from "#composables/dark";


  import ButtonComponent from "#components/ButtonComponent.vue";
  import ButtonLink from "#components/ButtonLink.vue";
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

  .icon {
    cursor: pointer;
    margin-left: 20px;
    height: auto;
    width: 7%;
    transition: fill 110ms ease-in-out;
  }
</style>
