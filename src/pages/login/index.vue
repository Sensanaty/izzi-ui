<template>
  <img src="/DAP-logo-yellow.png" height="20rem" width="20rem" aria-hidden="true" alt="DAP Logo" class="w-60 m-auto py-8">

  <form
    class="flex items-center justify-center flex-col rounded bg-neutral-800 shadow-lg shadow-neutral-700/60 mx-auto my-4 py-3 w-1/4">
    <label for="username" class="mb-1.5 text-xl text-yellow-500">Username</label>
    <input id="username" v-model="username" class="w-80 px-3 py-1 my-1 text-black" autocomplete="on">

    <label for="password" class="mb-1.5 text-xl text-yellow-500">Password</label>
    <input id="password" v-model="password" type="password" class="w-80 px-3 py-1 my-1 text-black" autocomplete="on">

    <label for="remember" class="my-2 text-yellow-500">Keep me logged in</label>
    <input id="remember" v-model="remember" type="checkbox" class="mb-3">

    <BaseButton class="font-bold w-32" background-color="bg-yellow-500" background-hover="hover:bg-yellow-600"
      background-active="active:bg-yellow-700" background-disabled="disabled:bg-yellow-950" :disabled="isLoggingIn"
      @click.prevent="login">
      Login
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

import router from "~/modules/router";
import useAuthStore from "~/store/auth";
import useNotificationStore from "~/store/notification";
import { LoginData } from "~/types/endpoints";
import BaseButton from "~components/base/BaseButton.vue";

const auth = useAuthStore();
const notification = useNotificationStore();

const username = ref<LoginData["username"]>("");
const password = ref<LoginData["password"]>("");
const remember = ref<LoginData["remember"]>(true);

const isLoggingIn = ref(false);

async function login() {
  if (!username.value || !password.value) {
    if (notification.notifications.length !== 0) { return; }

    notification.createNotification("Username and Password fields can't be blank", "dang");
    return;
  }

  if (isLoggingIn.value) {
    return;
  }

  isLoggingIn.value = true;

  await auth.login(username.value, password.value, remember.value).then(() => {
    if (auth.loggedIn) { router.push("/admin"); }
  }).finally(() => isLoggingIn.value = false);
}
</script>
