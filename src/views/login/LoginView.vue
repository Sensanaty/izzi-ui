<template>
  <img src="/images/logo.svg" alt="DAP Logo" class="w-32 mx-auto mb-8">

  <form class="flex flex-col border w-fit rounded mx-auto p-4 bg-neutral-900" @submit.prevent>
    <BaseInput
      id="username"
      v-model="values.username"
      mono
      column
      required
      label="Username"
      :error-message="errors.username"
      :invalid="!!errors.username"
      :disabled="isFetchingLogin"
      autofocus
      @blur="validateField('username')"
      @input="validateField('username')"
      @keydown.enter.prevent="onSubmit"
    />

    <BaseInput
      id="password"
      v-model="values.password"
      type="password"
      mono
      column
      required
      label="Password"
      :error-message="errors.password"
      :invalid="!!errors.password"
      :disabled="isFetchingLogin"
      @blur="validateField('password')"
      @input="validateField('password')"
      @keydown.enter.prevent="onSubmit"
    />

    <BaseButton
      class="mx-auto"
      :disabled="isFetchingLogin"
      @click.prevent="onSubmit"
    >
      Login
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import useForm from "@/composables/useForm";
import { object, string } from "zod";
import useAuthStore from "@/stores/auth";
import useAuthApi from "@/api/auth";
import { useRouter } from "vue-router";
import { ROUTE } from "@/router/routes";

const loginSchema = object({
  username: string().min(1, "Username is required"),
  password: string().min(1, "Password is required"),
});

const { values, errors, validateAll, validateField } = useForm(loginSchema);

const { login, isFetchingLogin } = useAuthApi();
const authStore = useAuthStore();

const router = useRouter();

async function onSubmit() {
  if (isFetchingLogin.value || !validateAll()) {
    return;
  }

  login({
    username: values.value.username,
    password: values.value.password,
  }).then((response) => {
    router.push({ name: ROUTE.HOME });
    authStore.setAuthStore(response);
  });
}
</script>
