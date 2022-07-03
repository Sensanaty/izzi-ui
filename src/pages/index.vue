<template>
  <div class="wrapper">
    <h1>IZZICUP D.O.O. is a limited liability company established December 18th, 2003.</h1>

    <div class="offices">
      <div class="office">
        <h2>Main Office</h2>
        <p>Koste Cukića #14</p>
        <p>11080 Zemun, Beograd, Serbia</p>
      </div>

      <div class="office">
        <h2>Representative Office</h2>
        <p>Jalan Sekuta #23</p>
        <p>80228 Sanur, Bali, Indonesia</p>
      </div>

      <div class="office contact">
        <h2>Contact Us</h2>

        <p><a href="mailto:izzicup@gmail.com">izzicup@gmail.com</a></p>

        <Transition name="fade" mode="out-in">
          <form v-if="!sent">
            <div>
              <FormLabel text="name" label-for="name" :condition="nameError" />
              <input
                id="name"
                v-model="name"
                :class="{error: nameError}"
                type="text"
                autocomplete="name"
                @blur="nameError = validatePresence(name)"
              >
            </div>

            <div>
              <FormLabel text="email" label-for="email" :condition="emailError" />
              <input
                id="email"
                v-model="email"
                :class="{error: emailError}"
                type="text"
                autocomplete="email"
                @blur="emailError = validatePresence(email)"
              >
            </div>

            <div class="text">
              <FormLabel text="message" label-for="message" :condition="messageError" />
              <textarea
                id="message"
                v-model="message"
                :class="{error: messageError}"
                autocomplete="off"
                rows="8"
                @blur="messageError = validatePresence(message)"
              />
            </div>

            <ButtonComponent text="send" @click.prevent="sendMessage" />
          </form>
          <div v-else class="response">
            <h3>Thank you! We'll be in contact with you as soon as possible</h3>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { validatePresence } from "#composables/validation";

  const name = ref("");
  const email = ref("");
  const message = ref("");
  const nameError = ref(false);
  const emailError = ref(false);
  const messageError = ref(false);
  const sent = ref(false);

  const sendMessage = () => {
    sent.value = true;
    console.log("TODO");
  };
</script>

<style lang="scss" scoped>
  h1 { margin-top: 10px; font-size: 2.4rem; text-align: center }

  .wrapper {
    display: flex;
    align-items: center;
    flex-flow: column wrap;
  }

  .offices {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: row wrap;
    margin: 30px 0;
    width: 60%;
  }

  .office {
    padding: 20px 35px;
    border-radius: 7px;
    box-shadow: var(--subtle-shadow);
    background: var(--background-accent);
    color: var(--color-accent);
    margin: 0 25px;
    min-height: 100px;
    flex: 1 0 calc(50% - 50px);
  }

  .contact {
    display: flex;
    flex-flow: column wrap;
    margin-top: 25px;

    h2 { text-align: center; }
    p { text-align: center; margin-bottom: 20px; font-weight: bold }
  }

  a {
    color: var(--color-accent);
    text-decoration: white solid 2px underline;
    transition: text-decoration 100ms ease-in-out;

    &:hover { text-decoration-color: var(--accent) }
  }

  h2 { font-size: 1.9rem; margin-bottom: 10px }
  p { font-size: 1.2rem }

  form {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;

    div {
      display: flex;
      flex-flow: column wrap;
      flex: 1 1 40%;

      &:nth-child(1) { margin-right: 20px; }
    }

    .text { flex: 1 0 100%; margin-bottom: 30px }
  }

  label {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;

    span { color: red }
  }

  input, textarea {
    border-radius: 6px;
    border: none;
    outline: transparent 3px solid;
    padding: 10px;
    transition: outline-color 110ms ease-in-out;
  }

  input { margin-bottom: 25px; }
  textarea { resize: none; }
  .error { outline: red 3px solid }
  .response { text-align: center }

  .fade-enter-active, .fade-leave-active { transition: opacity 100ms ease-in-out }
  .fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
