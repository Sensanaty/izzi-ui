<template>
  <Teleport to="body">
    <Transition>
      <div
        v-if="isOpen"
        class="fixed flex content-center justify-center left-0 top-0 w-full h-full bg-neutral-900/80"
      >
        <div class="flex flex-col bg-stone-800 rounded h-min m-auto px-4 py-2" :class="[large ? 'min-w-[45%]' : 'min-w-[25%]']">
          <div class="flex flex-row items-center mb-3">
            <h1 class="font-mono text-2xl font-black">{{ title }}</h1>
            <button class="rounded-xl w-fit px-4 py-2 ml-auto font-mono font-bold bg-stone-900 hover:text-orange-400 transition-colors transition-100" @click.prevent.once="emit('close')">X</button>
          </div>

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue";

  const emit = defineEmits(["close"]);

  const props = withDefaults(defineProps<{
    isOpen: boolean,
    title: string,
    large: boolean
  }>(), { isOpen: false, title: "Title", large: false });

  onMounted(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && props.isOpen) {
        emit("close");
      }
    });
  });
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
