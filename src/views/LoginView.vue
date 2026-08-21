<template>
  <main class="flex min-h-screen items-center justify-center px-4 py-8">
    <section
      class="bg-surface-raised border-border w-full max-w-md rounded-sm border-2 p-6 shadow-md"
    >
      <div class="mb-6">
        <h1 class="text-3xl font-black">Sign in</h1>
        <p class="text-text-muted mt-2">Sign in to access the IZZI application.</p>
      </div>

      <form class="grid gap-4" novalidate @submit.prevent="submitLogin">
        <IzziInput
          id="username"
          v-model="username"
          autocomplete="username"
          label="Username"
          :aria-describedby="loginErrorDescriptionId"
          :disabled="auth.isLoading"
          :invalid="Boolean(validationError)"
          required
        />

        <IzziInput
          id="password"
          v-model="password"
          autocomplete="current-password"
          label="Password"
          :aria-describedby="loginErrorDescriptionId"
          :disabled="auth.isLoading"
          :invalid="Boolean(validationError)"
          required
          type="password"
        />

        <p id="login-error" v-if="validationError" class="text-danger" role="alert">
          {{ validationError }}
        </p>
        <p id="login-error" v-else-if="auth.error" class="text-danger" role="alert">
          {{ auth.error.message }}
        </p>

        <IzziButton class="mt-2 w-full" type="submit" :disabled="auth.isLoading">
          {{ auth.isLoading ? "Signing in..." : "Sign in" }}
        </IzziButton>
      </form>

      <IzziButton
        v-if="auth.canAutoLogin"
        class="mt-4 w-full"
        variant="secondary"
        :disabled="auth.isLoading"
        @click="submitAutoLogin"
      >
        {{ auth.isLoading ? "Signing in..." : "Development sign in" }}
      </IzziButton>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import IzziInput from "@/components/ui/IzziInput.vue";
import { RoutePath } from "@/router/constants";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const username = ref("");
const password = ref("");
const validationError = ref<string | null>(null);
const loginErrorDescriptionId = computed(() =>
  validationError.value || auth.error ? "login-error" : undefined,
);

const getSafeRedirect = (): string => {
  const redirect = route.query.redirect;

  return typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : RoutePath.HOME;
};

async function redirectAfterLogin(loggedIn: boolean): Promise<void> {
  if (loggedIn) {
    await router.replace(getSafeRedirect());
  }
}

async function submitLogin(): Promise<void> {
  validationError.value = null;

  if (!username.value.trim() || !password.value) {
    validationError.value = "Username and password are required.";

    return;
  }

  const loggedIn = await auth.login(username.value.trim(), password.value);
  password.value = "";
  await redirectAfterLogin(loggedIn);
}

async function submitAutoLogin(): Promise<void> {
  validationError.value = null;
  await redirectAfterLogin(await auth.autoLogin());
}
</script>
