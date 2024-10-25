<template>
  <Transition>
    <div v-if="model" ref="modalContainer" class="flex fixed top-0 left-0 bg-neutral-950/50 w-screen h-screen z-30" @click.prevent="onBackdropClick">
      <div
        class="m-auto mt-64 border rounded bg-neutral-900 z-40"
        :class="{ 'w-1/4': size === 'small', 'w-1/3': size === 'large' }"
        @click.stop.prevent
      >
        <header v-if="title" class="border-b-2 px-2.5 pt-1 font-semibold text-lg">
          {{ title }}
        </header>

        <div class="flex flex-col max-h-96 overflow-auto py-3.5 px-2.5">
          <slot />
        </div>

        <footer class="flex border-t-2 px-2.5 py-2">
          <div class="ml-auto">
            <slot name="footer">
              <BaseButton @click.prevent="emit('close')">
                Close
              </BaseButton>
            </slot>
          </div>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from "vue";

const model = defineModel<boolean>();

type ModalProps = {
  title?: string;
  size?: "large" | "small";
  closeOnBackdrop?: boolean;
};

const props = withDefaults(defineProps<ModalProps>(), {
  title: "",
  size: "small",
  closeOnBackdrop: true,
});

const emit = defineEmits<{ (e: "close"): void }>();

function onBackdropClick() {
  if (props.closeOnBackdrop) {
    emit("close");
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && model.value) {
    emit("close");
  }
};

watch(model, (value) => {
  if (value) {
    window.addEventListener("keydown", handleEscape);
  } else {
    window.removeEventListener("keydown", handleEscape);
  }
}, { immediate: true });
</script>

<style scoped lang="postcss">
.v-enter-active,
.v-leave-active {
  transition: opacity 100ms ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
