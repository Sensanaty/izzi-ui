<template>
  <header class="flex items-center bg-neutral-900 w-full px-4 py-1 border-b border-r">
    <nav class="flex items-center">
      <RouterLink
        :to="ROUTE_PATH.HOME"
        class="font-bold underline decoration-2 text-xl decoration-transparent hover:decoration-emerald-500"
        exact-active-class="decoration-emerald-700"
      >
        DAP Aero
      </RouterLink>

      <RouterLink
        :to="ROUTE_PATH.CONTACT"
        class="font-bold ml-4 underline decoration-2 text-lg decoration-transparent hover:decoration-emerald-500"
        exact-active-class="decoration-emerald-700"
      >
        Contact Us
      </RouterLink>
    </nav>
  </header>

  <main class="flex flex-col mx-4 mt-2">
    <slot />
  </main>
</template>

<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routes";
</script>
