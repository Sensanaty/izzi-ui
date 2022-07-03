<template>
  <div id="login">
    <img src="/logo.svg" alt="" aria-hidden="true">

    <form>
      <div class="input-wrapper username">
        <FormLabel text="Username" label-for="name" :condition="nameError" />
        <input
          id="username"
          v-model="username"
          :class="{error: nameError}"
          type="text"
          autocomplete="username"
          @blur="nameError = validatePresence(username)"
          @keydown.enter.prevent="login"
        >
      </div>

      <div class="input-wrapper password">
        <FormLabel text="Password" label-for="password" :condition="passwordError" />
        <input
          id="password"
          v-model="password"
          :class="{error: passwordError}"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          @blur="passwordError = validatePresence(password)"
          @keydown.enter.prevent="login"
        >
      </div>

      <div>
        <label for="show" class="check-wrapper">
          <input id="show" v-model="showPassword" class="check" type="checkbox">Show Password
        </label>
      </div>

      <div>
        <label for="remember" class="check-wrapper">
          <input id="remember" v-model="remember" class="check" type="checkbox">Remember Me
        </label>
      </div>

      <ButtonComponent text="login" @click.prevent="login" />
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import useAuthStore from "#store/auth";
  import { validatePresence } from "#composables/validation";

  const auth = useAuthStore();

  const password = ref("");
  const username = ref("");
  const remember = ref(false);
  const showPassword = ref(false);
  const passwordError = ref(false);
  const nameError = ref(false);

  async function login() {
    nameError.value = validatePresence(username.value);
    passwordError.value = validatePresence(password.value);

    if (!nameError.value && !passwordError.value) {
      await auth.login(username.value, password.value, remember.value);
    }
  }
</script>

<style lang="scss" scoped>
   #login, form {
     display: flex;
     flex-flow: column wrap;
     align-items: center;
     width: 100%;
   }

   img {
     height: 200px;
     width: auto;
     margin-bottom: 50px;
   }

  .input-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column wrap;
    width: 17%;

    label {
      align-self: flex-start;
      font-weight: bold;
      font-size: 1.4rem;
      margin-bottom: 10px;
    }

    input {
      font-family: monospace;
      font-size: 1.1rem;
      width: 100%;
      margin-bottom: 30px;
      padding: 10px 15px;
      border-radius: 4px;
      outline: 2px solid transparent;
      border: none;
      box-shadow: var(--subtle-shadow);
      transition: outline-color 100ms ease-in-out;

      &:focus { outline-color: var(--light-accent) }
    }
  }

   .check-wrapper { cursor: pointer; }
   .check { margin: 0 10px 15px 0; }

  .error { outline: 2px solid red !important }
</style>
