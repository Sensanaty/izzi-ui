<template>
  <header
    class="bg-surface-raised border-border flex items-center justify-between gap-2 border-b-2 border-b-accent px-3.5 py-1.5 text-accent"
  >
    <nav aria-label="Main navigation" class="flex items-center gap-3">
      <RouterLink
        class="inline-flex items-center text-lg font-bold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="{ path: RoutePath.HOME, query: route.query }"
      >
        <Package aria-hidden="true" class="mr-2 size-5" /> Parts
      </RouterLink>

      <RouterLink
        class="border-border inline-flex items-center border-l pl-3 text-sm font-semibold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="{ path: RoutePath.PART_NEW, query: route.query }"
      >
        <PackagePlus aria-hidden="true" class="mr-2 size-4" /> New Part
      </RouterLink>

      <RouterLink
        class="border-border ml-8 inline-flex items-center border-l pl-3 text-lg font-bold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.COMPANIES"
      >
        <Building2 aria-hidden="true" class="mr-2 size-5" /> Companies
      </RouterLink>

      <RouterLink
        class="border-border inline-flex items-center border-l pl-3 text-sm font-semibold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.COMPANY_NEW"
      >
        <Hospital aria-hidden="true" class="mr-2 size-4" /> New Company
      </RouterLink>

      <RouterLink
        class="ml-8 inline-flex items-center border-l pl-3 text-lg font-bold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.CLIENTS"
      >
        <ContactRound aria-hidden="true" class="mr-2 size-5" /> Contacts
      </RouterLink>

      <RouterLink
        class="border-border inline-flex items-center border-l pl-3 text-sm font-semibold text-text hover:text-accent"
        exact-active-class="!text-accent"
        :to="RoutePath.CLIENT_NEW"
      >
        <UserPlus aria-hidden="true" class="mr-2 size-4" /> New Contact
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

      <IzziButton
        size="sm"
        variant="ghost"
        rounded
        flat
        aria-label="Open page help"
        title="Page help (?)"
        @click="isHelpOpen = true"
      >
        <CircleHelp aria-hidden="true" class="size-5" />
      </IzziButton>

      <IzziButton size="sm" variant="outline" :disabled="auth.isLoading" @click="signOut">
        Sign out
      </IzziButton>
    </div>
  </header>

  <PageHelpModal v-model="isHelpOpen" :route-name="route.name" :route-path="route.path" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Building2,
  CircleHelp,
  ContactRound,
  Crown,
  Hospital,
  Package,
  PackagePlus,
  UserPlus,
} from "@lucide/vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import PageHelpModal from "@/components/ui/PageHelpModal.vue";
import ThemeToggle from "@/components/ui/ThemeToggle.vue";
import { notifyApiErrorDetails } from "@/lib/notifications";
import { RoutePath } from "@/router/constants";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const isHelpOpen = ref(false);

async function signOut(): Promise<void> {
  await auth.logout();

  if (auth.error) {
    notifyApiErrorDetails(auth.error, "Unable to sign out");
  }

  await router.replace(RoutePath.LOGIN);
}
</script>
