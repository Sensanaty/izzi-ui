<template>
  <Teleport to="body">
    <Transition>
      <div
        v-if="isOpen"
        class="fixed flex content-center justify-center z-[1] left-0 top-0 w-full h-full bg-neutral-900/80"
        @click.prevent.once="emit('closeModal', false)"
      >
        <div class="bg-white rounded h-min m-auto px-4 py-2 min-w-[25%]">
          <h1 class="text-black">hello</h1>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
  const emit = defineEmits(["closeModal"]);

  withDefaults(defineProps<{
    isOpen: boolean
  }>(), { isOpen: false });
</script>

<style scoped>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.1s ease-in-out;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
