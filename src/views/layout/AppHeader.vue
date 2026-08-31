<template>
  <header
    class="bg-surface-raised border-border flex items-center justify-between gap-2 border-b-2 border-b-accent px-3.5 py-1.5 text-accent"
  >
    <nav aria-label="Main navigation" class="flex items-center gap-3">
      <RouterLink
        class="text-lg font-bold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.HOME"
      >
        PARTS
      </RouterLink>

      <RouterLink
        class="border-border inline-flex items-center border-l pl-3 text-sm font-semibold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.PART_NEW"
      >
        <PackagePlus aria-hidden="true" class="mr-2 size-4" />Part
      </RouterLink>

      <RouterLink
        class="border-border ml-8 border-l pl-3 text-lg font-bold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.COMPANIES"
      >
        COMPANIES
      </RouterLink>

      <RouterLink
        class="border-border inline-flex items-center border-l pl-3 text-sm font-semibold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.COMPANY_NEW"
      >
        <Hospital aria-hidden="true" class="mr-2 size-4" />Company
      </RouterLink>
    </nav>

    <div class="flex items-center gap-2">
      <RouterLink
        v-if="auth.isAdmin"
        class="border-border border-r pr-3 mr-4 text-sm text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.USERS"
      >
        Users
      </RouterLink>

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
import { Crown, Hospital, PackagePlus } from "@lucide/vue";
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
