<template>
  <div id="login">
    <img src="/logo.svg" alt="" aria-hidden="true">

    <form>
      <div class="input-wrapper username">
        <label for="username">
          Username
          <Transition name="fade" mode="out-in">
            <span v-if="nameError" class="error-message">can't be blank</span>
          </Transition>
        </label>

        <input
          id="username"
          v-model="username"
          :class="{error: nameError}"
          type="text"
          autocomplete="username"
          @blur="nameError = validatePresence(username)"
          @keyup.enter.prevent="login"
        >
      </div>

      <div class="input-wrapper password">
        <label for="password">
          Password
          <Transition name="fade" mode="out-in">
            <span v-if="passwordError" class="error-message">can't be blank</span>
          </Transition>
        </label>

        <input
          id="password"
          v-model="password"
          :class="{error: passwordError}"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          @blur="passwordError = validatePresence(password)"
          @keyup.enter.prevent="login"
        >
      </div>

      <div class="remember-wrapper">
        <label for="remember">
          <input id="remember" v-model="remember" class="check" type="checkbox">Remember me?
        </label>
      </div>

      <button @click.prevent="login">login</button>
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

  const login = () => {
    auth.login(username.value, password.value, remember.value);
  };

  const showPassword = ref(false);
  const passwordError = ref(false);
  const nameError = ref(false);
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
      outline: none;
      border: none;
      box-shadow: var(--subtle-shadow);
    }
  }

   .check { margin: 0 10px 15px 0 }

   button {
     padding: 8px 15px;
     border-radius: 4px;
     font-weight: bold;
     transition: background 110ms ease-in-out;

     &:hover { background: var(--accent) }
     &:active { background: var(--dark-accent) }
   }

  .error { outline: 2px solid red !important }
  .error-message {
    color: red;
    font-size: 1.2rem;
  }

  .fade-enter-active, .fade-leave-active { transition: opacity 100ms ease-in-out }
  .fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
