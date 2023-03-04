<template>
  <h1 class="mx-auto font-bold text-4xl text-center mb-5">IZZICUP D.O.O. is a limited liability company established December 18th, 2003.</h1>

  <div class="mx-auto flex justify-between w-1/2 mb-3">
    <AddressBox
      title="Main Office"
      address="Koste Cukića #14"
      sub-address="11080 Zemun, Belgrade, Serbia"
    />
    <AddressBox
      title="Representative Office"
      address="Jalan Sekuta #23"
      sub-address="80228 Sanur, Bali, Indonesia"
    />
  </div>

  <div class="flex flex-col justify-center items-center mx-auto w-1/2 bg-neutral-800 p-4 rounded">
    <h1 class="text-3xl font-bold text-center">Contact Us</h1>
    <a href="mailto:izzicup@gmail.com" class="font-bold text-xl underline text-center">izzicup@gmail.com</a>

    <form class="w-full mt-4">
      <div class="flex flex-row justify-between">
        <div class="flex flex-col min-w-[45%]">
          <label for="name">name</label>
          <input id="name" v-model="name" type="text">
        </div>

        <div class="flex flex-col min-w-[45%]">
          <label for="email">email</label>
          <input id="email" v-model="email" type="email">
        </div>
      </div>

      <div class="flex flex-col mt-3">
        <label for="message">message</label>
        <textarea
          id="message"
          v-model="message"
          name="message"
          cols="40"
          rows="10"
          class="rounded text-black p-2 mt-1 resize-none"
        />
      </div>

      <BaseButton class="w-fit h-fit self-center justify-self-center" @click.prevent="clicked">Send</BaseButton>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue";

  import AddressBox from "~/pages/AddressBox.vue";
  import BaseButton from "~components/base/BaseButton.vue";

  const name = ref("");
  const email = ref("");
  const message = ref("");

  const clicked = () => {
    console.log(name.value);
    console.log(email.value);
    console.log(message.value);
  };
</script>

<style scoped>
  form {
    display: grid;
    grid-template: 1fr 4fr 1fr / 1fr;
  }

  input { @apply rounded h-fit text-lg text-black p-1 mt-1 }
</style>
