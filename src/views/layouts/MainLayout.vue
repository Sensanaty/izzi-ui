<template>
  <header class="flex items-center bg-neutral-900 w-full px-4 py-1 border-b border-r">
    <nav class="flex items-center">
      <RouterLink
        v-for="route in navlinks"
        :key="route.route"
        :to="route.route"
        class="font-bold underline decoration-2 decoration-transparent text-lg mr-4 last:mr-0 hover:decoration-emerald-500"
        exact-active-class="decoration-emerald-700"
      >
        {{ route.text }}
      </RouterLink>
    </nav>
  </header>

  <main class="flex flex-col mx-4 mt-2">
    <slot />
  </main>
</template>

<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routes";

type AdminNavlinks = {
  text: string;
  route: string;
  classes?: string;
};

const navlinks: AdminNavlinks[] = [
  { text: "Parts", route: ROUTE_PATH.ADMIN },
];
</script>
