<template>
  <div class="container mx-auto px-4">
    <h1 class="pt-2 text-3xl text-yellow-500">WELCOME TO PT DHARMA ANGKASA PUTRA</h1>
    <h2 class="text-2xl font-medium text-yellow-500 py-4">WHAT WE DO</h2>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 m-auto py-6">
      <div>
        <h3>PURCHASING</h3>
        <p>Send us your material requirements - individual items or lists. We will check market availability and submit our quotations to your email inbox in 1-3 days.</p>
      </div>

      <div>
        <h3>SALES</h3>
        <p>Send us your surplus list and we will try to find it a new home, either through individual parts sales, or as a package deal.</p>
      </div>

      <div>
        <h3>REPAIRS AND OVERHAULS MANAGEMENT </h3>
        <p>We can handle parts maintenance on your behalf, including MRO selection, repair quote approval, and the return of the re-certified part back to your stock.</p>
      </div>

      <div>
        <h3>MARKET RESEARCH</h3>
        <p>We do market research and provide pricing & delivery times for lists of material. We charge $5.00 per line item, with a $100 minimum, payable in advance.</p>
      </div>

      <div>
        <h3>WORK OUTSOURCING</h3>
        <p>We do market research and provide pricing & delivery times for lists of material. We charge $5.00 per line item, with a $100 minimum, payable in advance.</p>
      </div>

      <div>
        <h3>QUALITY AND CERTIFICATION</h3>
        <p>We are strictly brokers. We purchase parts for a known customer from an approved source and have the parts drop-shipped directly from our approved suppliers to end users. We never come in contact with parts at any stage of the process. We do not perform receiving inspection, or store, or ship, or manipulate the parts in any way. For this reason we do not have and we do not need any manuals, tools & equipment, facilities, training or personnel to manipulate the parts, nor do we require any sort of certification.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import useAuthStore from "~/store/auth";
  import { onMounted } from "vue";

  // Fetch user details if token is present in localStorage upon index page mount
  const { token, loggedIn, checkAuthenticatedStatus, setToken, getUserDetails } = useAuthStore();
  onMounted(async () => {
    const localToken = localStorage.getItem("token");

    if (!loggedIn && localToken) {
      await checkAuthenticatedStatus(true)
        .then(async (isAuthed) => {
          if (isAuthed) {
            if (!token) { setToken(localToken); }

            await getUserDetails();
          } else {
            localStorage.removeItem("token");
          }
        });
    }
  });
</script>

<style scoped>
h3 {
  @apply text-xl font-medium text-yellow-500 py-2;
}

p {
  @apply text-base font-medium text-neutral-200;
}
</style>
