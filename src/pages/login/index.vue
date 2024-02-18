<template>
  <img src="/logo.svg" height="15rem" width="15rem" aria-hidden="true" alt="Izzicup logo" class="w-60 m-auto">

  <form class="flex items-center justify-center flex-col bg-neutral-800 mx-auto py-5 my-4 w-1/2">
    <label for="username" class="mb-1.5 text-xl">Username</label>
    <input id="username" v-model="username" class="w-80 px-3 py-1 my-1 text-black" autocomplete="on">

    <label for="password" class="mb-1.5 text-xl">Password</label>
    <input id="password" v-model="password" type="password" class="w-80 px-3 py-1 my-1 text-black" autocomplete="on">

    <label for="remember" class="my-2">Keep me logged in</label>
    <input id="remember" v-model="remember" type="checkbox" class="mb-3">

    <BaseButton
      class="font-bold w-32"
      background-color="bg-green-500"
      background-hover="hover:bg-green-600"
      background-active="active:bg-green-700"
      @click.prevent="login()"
    >
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

  async function login() {
    if (!username.value || !password.value) {
      if (notification.notifications.length !== 0) { return; }

      notification.createNotification("Username and Password fields can't be blank", "dang");
      return;
    }

    await auth.login(username.value, password.value, remember.value).then(() => {
      if (auth.loggedIn) { router.push("/admin"); }
    });
  }
</script>
