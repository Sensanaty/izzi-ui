<template>
  <header class="flex items-center bg-neutral-800 w-full h-14 px-4 mb-4">
    <h1 class="font-bold text-center">
      <RouterLink class="mr-12 text-2xl hover:text-amber-400" :to="auth.loggedIn ? '/admin' : '/'">
        IZZICUP
      </RouterLink>
      <RouterLink v-if="auth.loggedIn" class="text-xl hover:text-amber-400" to="/admin/new">New Part</RouterLink>
    </h1>

    <div class="flex flex-row items-center ml-auto">
      <ph-lightbulb-filament
        v-if="auth.loggedIn"
        :size="20"
        class="mr-5 cursor-pointer hover:text-yellow-400"
        @click="toggleModal"
      />

      <RouterLink v-if="!auth.loggedIn" :to="{ name: 'Login' }">
        <BaseButton class="ml-auto">
          LOGIN
        </BaseButton>
      </RouterLink>

      <BaseButton v-else class="ml-auto" @click="logout">LOGOUT</BaseButton>
    </div>

    <ShortcutModal :is-open="isModalOpen" @close="toggleModal" />
  </header>
</template>

<script setup lang="ts">
  import { PhLightbulbFilament } from "@phosphor-icons/vue";

  import useModal from "~/composables/useModal";
  import router from "~/modules/router";
  import useAuthStore from "~/store/auth";
  import BaseButton from "~components/base/BaseButton.vue";
  import ShortcutModal from "~components/base/ShortcutModal.vue";

  const auth = useAuthStore();

  const logout = () => {
    auth.logout();
    router.push("/");
  };

  const { isModalOpen, toggleModal } = useModal();
</script>
