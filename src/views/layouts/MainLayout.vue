<template>
  <header class="flex w-full items-center border-b border-r bg-neutral-900 px-4 py-1">
    <nav class="flex w-full items-center">
      <template v-for="route in navlinks" :key="route.route">
        <div class="mr-4 flex items-center">
          <RouterLink
            :to="route.route"
            class="flex items-center text-lg font-bold underline decoration-transparent decoration-2 hover:!decoration-emerald-500"
            exact-active-class="!decoration-emerald-700 text-emerald-600"
          >
            <component
              :is="route.icon"
              v-if="route.icon"
              class="mr-1.5 transition-colors duration-75"
              v-bind="{ weight: 'duotone', color: 'currentColor' }"
            />
            <span class="text-white">{{ route.text }}</span>
          </RouterLink>

          <template v-if="route.subroutes && isRouteActive(route.route)">
            <span class="mx-2 select-none text-neutral-500">|</span>

            <RouterLink
              v-for="subRoute in route.subroutes"
              :key="subRoute.route"
              :to="subRoute.route"
              class="mr-2 text-lg font-semibold underline decoration-transparent decoration-2 last:mr-0 hover:!decoration-emerald-500"
              exact-active-class="!decoration-emerald-700 text-emerald-600"
            >
              <span class="text-white">{{ subRoute.text }}</span>
            </RouterLink>
          </template>
        </div>
      </template>

      <RouterLink
        v-if="!authStore.loggedIn"
        :to="ROUTE_PATH.LOGIN"
        class="ml-auto flex items-center text-lg font-bold underline decoration-transparent decoration-2 hover:!decoration-emerald-500"
        exact-active-class="!decoration-emerald-700"
      >
        Login
      </RouterLink>

      <button
        v-else
        type="button"
        class="ml-auto flex items-center text-lg font-bold underline decoration-transparent decoration-2 hover:!decoration-emerald-500"
        @click.prevent="authStore.logout"
      >
        Logout
      </button>
    </nav>
  </header>

  <main class="mx-2.5 mb-4 mt-2 flex flex-col">
    <slot />
  </main>
</template>

<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routes";
import { PhAirplaneTilt } from "@phosphor-icons/vue";
import { useRoute } from "vue-router";

import type { Component } from "vue";
import useAuthStore from "@/stores/auth";

type SubNavlink = Omit<AdminNavlinks, "icon" | "subroutes"> & { isSubLink: true };

type AdminNavlinks = {
  text: string;
  route: string;
  classes?: string;
  icon?: Component;
  subroutes?: SubNavlink[];
};

const navlinks: AdminNavlinks[] = [
  {
    text: "Parts",
    route: ROUTE_PATH.HOME,
    icon: PhAirplaneTilt,
    subroutes: [{ text: "Create", route: ROUTE_PATH.PART_CREATE, isSubLink: true }],
  },
];

const route = useRoute();
const authStore = useAuthStore();

const isRouteActive = (path: string) => {
  return route.path.startsWith(path);
};
</script>
