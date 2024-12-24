<template>
  <Transition>
    <div v-if="model" ref="modalContainer" class="fixed left-0 top-0 z-30 flex h-screen w-screen bg-neutral-950/60" @click.prevent="onBackdropClick">
      <div
        class="z-40 m-auto rounded border bg-neutral-900"
        :class="{ 'w-1/4': size === 'small', 'w-1/3': size === 'large', 'w-1/2': size === 'xlarge', 'w-5/6': size === '2xlarge' }"
        @click.stop.prevent
      >
        <header v-if="title" class="border-b-2 px-2.5 pt-1 text-lg font-semibold">
          {{ title }}
        </header>

        <div class="flex max-h-[48rem] flex-col overflow-auto px-2.5 py-3.5" :class="slotClass">
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
  size?: "2xlarge" | "xlarge" | "large" | "small";
  closeOnBackdrop?: boolean;
  slotClass?: string;
};

const props = withDefaults(defineProps<ModalProps>(), {
  title: "",
  size: "small",
  closeOnBackdrop: true,
  slotClass: "",
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
