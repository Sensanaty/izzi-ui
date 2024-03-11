<template>
  <div class="flex flex-col justify-center space-x-4 items-center mx-auto my-6">
    <h1 class="mx-1000 pt-3 font-medium text-4xl text-center text-yellow-500">CONTACT US</h1>
    <p class="text-lg font-light text-center text-yellow-500 mx-auto px-4">Feel free to contact us and we will get back to you as soon as we can.</p>
  </div>


  <div class="mx-auto w-1/2 m-4 rounded text-xl font-light bg-neutral-800 shadow-lg shadow-black/90">
    <AddressBox class="bg-neutral-800 text-yellow-500" title="MAIN OFFICE"
      address="Jl. Tukad Buana Gunung Sari, Gg. Baja No.1 Batukandik" sub-address="80117, Denpasar, Bali, Indonesia" />
  </div>

  <div
    class="flex flex-col justify-center items-center mx-auto w-1/2 bg-neutral-800 shadow-lg shadow-black/90 text-yellow-600 p-4 rounded">
    <h1 class="text-2xl font-semibold text-center text-yellow-600">E-MAIL</h1>
    <a href="mailto:dharmaangkasaputra@gmail.com"
      class="font-normal text-xl text-center hover:underline hover:decoration-blue-300 hover:text-blue-300 hover:font-semibold">
      dharmaangkasaputra@gmail.com</a>

    <form class="w-full mt-4 ">
      <div class="flex flex-row justify-between">
        <div class="flex flex-col min-w-[45%]">
          <label for="name">Name</label>
          <input id="name" v-model="name" type="text">
        </div>

        <div class="flex flex-col min-w-[45%]">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email">
        </div>
      </div>

      <div class="flex flex-col mt-3">
        <label for="message">Message</label>
        <textarea id="message" v-model="message" name="message" cols="40" rows="10"
          class="rounded text-black p-2 mt-1 resize-none bg-gray-300" />
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

input {
  @apply rounded h-fit text-lg text-neutral-800 bg-gray-300 p-1 mt-1
}
</style>
