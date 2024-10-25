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
      :disabled="isSending"
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
      :disabled="isSending"
      @blur="validateField('password')"
      @input="validateField('password')"
      @keydown.enter.prevent="onSubmit"
    />

    <BaseButton
      class="mx-auto"
      :disabled="isSending"
      @click.prevent="onSubmit"
    >
      Login
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import useForm from "@/composables/useForm";
import { object, string } from "zod";
import { ref } from "vue";

const loginSchema = object({
  username: string().min(1, "Username is required"),
  password: string().min(1, "Password is required"),
});

const { values, errors, validateAll, validateField } = useForm(loginSchema);

const isSending = ref(false);

function onSubmit() {
  if (isSending.value || !validateAll()) {
    return;
  }

  isSending.value = true;

  console.log("success");

  setTimeout(() => {
    isSending.value = false;
  }, 1000);
}
</script>
