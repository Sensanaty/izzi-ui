<template>
  <header class="flex items-center bg-neutral-800 w-full h-14 px-4 mb-4">
    <h1 class="font-bold text-center">
      <RouterLink class="mr-12 text-2xl hover:text-amber-400" :to="auth.loggedIn ? '/admin' : '/'">IZZICUP</RouterLink>
      <RouterLink class="text-xl hover:text-amber-400" to="/admin/new">New Part</RouterLink>
    </h1>

    <div class="flex flex-row items-center ml-auto">
      <ph-lightbulb-filament v-if="auth.loggedIn" :size="20" class="mr-5 cursor-pointer hover:text-yellow-400" @click="toggleShortcuts" />

      <BaseButton v-if="!auth.loggedIn" class="ml-auto">
        <RouterLink to="/login">LOGIN</RouterLink>
      </BaseButton>

      <BaseButton v-else class="ml-auto" @click="logout">LOGOUT</BaseButton>
    </div>
  </header>

  <BaseModal :is-open="isModalOpen" title="Keyboard Shortcuts" @close="toggleShortcuts">
    <p class="mb-4 font-mono font-bold"><code class="bg-stone-900 p-2 mr-3 rounded text-center">CTRL/⌘ + K</code> Focus on Searchbar</p>
    <p class="mb-4 font-mono font-bold"><code class="bg-stone-900 p-2 mr-3 rounded text-center">Shift + -&gt;</code> Fetch next page</p>
    <p class="mb-4 font-mono font-bold"><code class="bg-stone-900 p-2 mr-3 rounded text-center">Shift + &lt;-</code> Fetch previous page</p>
  </BaseModal>
</template>

<script setup lang="ts">
  import { PhLightbulbFilament } from "@phosphor-icons/vue";

  import useModal from "~/composables/useModal";
  import router from "~/modules/router";
  import useAuthStore from "~/store/auth";
  import BaseButton from "~components/base/BaseButton.vue";
  import BaseModal from "~components/base/BaseModal.vue";

  const auth = useAuthStore();

  const logout = () => {
    auth.logout();
    router.push("/");
  };

  const { isModalOpen, toggleModal } = useModal();

  const toggleShortcuts = () => {
    toggleModal();
  };
</script>
