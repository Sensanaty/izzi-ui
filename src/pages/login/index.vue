<template>
  <img src="/logo.svg" aria-hidden="true" alt="Izzicup logo" class="w-60 m-auto">

  <form class="flex items-center justify-center flex-col bg-neutral-800 mx-auto py-5 my-4 w-1/2">
    <label for="username" class="mb-1.5 text-xl">Username</label>
    <input id="username" v-model="username" class="w-80 px-3 py-1 my-1 text-black" autocomplete="on">

    <label for="password" class="mb-1.5 text-xl">Password</label>
    <input id="password" v-model="password" type="password" class="w-80 px-3 py-1 my-1 text-black" autocomplete="on">

    <label for="remember" class="my-2">Keep me logged in</label>
    <input id="remember" v-model="remember" type="checkbox" class="mb-3">

    <BaseButton class="flex items-center justify-center font-bold uppercase p-4 bg-red-900 hover:bg-red-800 w-32" @click.prevent="login()">login</BaseButton>
  </form>
</template>

<script setup lang="ts">
  import BaseButton from "~components/base/BaseButton.vue";
  import { LoginData } from "~/types/endpoints";
  import { ref } from "vue";
  import useAuthStore from "~/store/auth";
  import router from "~/modules/router";

  const auth = useAuthStore();

  const username = ref<LoginData["username"]>("");
  const password = ref<LoginData["password"]>("");
  const remember = ref<LoginData["remember"]>(true);

  async function login() {
    await auth.login(username.value, password.value, remember.value).then(() => {
      if (auth.loggedIn) { router.push("/admin"); }
    });
  }
</script>
