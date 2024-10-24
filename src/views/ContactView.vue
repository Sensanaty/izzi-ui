<template>
  <h1 class="mx-auto text-2xl font-bold">
    Feel free to contact us and we will get back to you as soon as we can
  </h1>

  <div class="flex flex-col mx-auto bg-neutral-900 w-fit p-3.5 border rounded mt-5 mb-6">
    <h2 class="mx-auto font-bold text-emerald-600 mb-2">
      Main Office
    </h2>

    <p class="text-center">
      Jl. Tukad Buana Gunung Sari, Gg. Baja No.1 Batukandik
    </p>

    <p class="text-center">
      80117, Denpasar, Bali, Indonesia
    </p>
  </div>

  <div class="flex flex-col mx-auto bg-neutral-900 w-fit p-3.5 border rounded">
    <h2 class="mx-auto font-bold text-emerald-600 mb-2">
      Email
    </h2>
    <a href="mailto:sale@dap-aero.com" class="underline mx-auto decoration-2 hover:decoration-emerald-600 mb-4">
      sale@dap-aero.com
    </a>

    <h2 class="mx-auto font-bold text-emerald-600 mb-2">
      Contact Form
    </h2>

    <form v-if="!hasSubmitted" class="flex flex-col" @submit.prevent>
      <div class="flex items-center">
        <label class="flex flex-col font-medium" for="name">
          Name
          <input id="name" v-model="name" type="text" class="mt-1 rounded text-black font-normal px-2 py-0.5">
        </label>

        <label class="flex flex-col font-medium ml-4" for="email">
          Email
          <input id="email" v-model="email" type="email" class="mt-1 rounded text-black font-normal px-2 py-0.5">
        </label>
      </div>

      <label for="message" class="flex flex-col font-medium mt-4">
        Message
        <textarea id="message" v-model="message" name="message" rows="5" class="mt-1 rounded text-black font-normal px-2 py-0.5" />
      </label>

      <BaseButton class="mt-4 mx-auto" @click.prevent="submitContactForm">
        Submit
      </BaseButton>
    </form>

    <p v-else>
      Thank you for your submission. We will get back to you as soon as possible.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "@/components/Base/BaseButton.vue";

const name = ref("");
const email = ref("");
const message = ref("");

const hasSubmitted = ref(checkIfSubmitted() || false);

function checkIfSubmitted() {
  const lastSubmitted = localStorage?.getItem("submittedContactForm");

  if (!lastSubmitted) {
    return false;
  }

  return new Date().getTime() - new Date(lastSubmitted).getTime() < (5 * 24 * 3600 * 1000);
}

function submitContactForm() {
  if (!name.value || !email.value || !message.value) {
    return;
  }

  hasSubmitted.value = true;
  localStorage.setItem("submittedContactForm", String(new Date()));
}
</script>
