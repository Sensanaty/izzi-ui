<template>
  <header
    class="bg-surface-raised border-border flex items-center justify-between gap-2 border-b-2 border-b-accent px-3.5 py-1.5 text-accent"
  >
    <nav aria-label="Main navigation" class="flex items-center gap-3">
      <RouterLink class="font-black" to="/">IZZICUP</RouterLink>
      <RouterLink
        class="border-border border-l pl-3 text-sm text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.PART_NEW"
      >
        New Part
      </RouterLink>
    </nav>

    <div class="flex items-center gap-2">
      <span class="text-text relative mr-4 hidden text-sm sm:inline-flex">
        {{ auth.user?.username }}

        <Crown
          v-if="auth.isAdmin"
          aria-hidden="true"
          class="text-primary absolute -left-2 -top-1 size-4 -rotate-30 fill-current"
        />
      </span>

      <ThemeToggle class="mr-2" />

      <IzziButton size="sm" variant="outline" :disabled="auth.isLoading" @click="signOut">
        Sign out
      </IzziButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Crown } from "@lucide/vue";
import { RouterLink, useRouter } from "vue-router";
import ThemeToggle from "@/components/ui/ThemeToggle.vue";
import { notifyApiErrorDetails } from "@/lib/notifications";
import { RoutePath } from "@/router/constants";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

async function signOut(): Promise<void> {
  await auth.logout();

  if (auth.error) {
    notifyApiErrorDetails(auth.error, "Unable to sign out");
  }

  await router.replace(RoutePath.LOGIN);
}
</script>
