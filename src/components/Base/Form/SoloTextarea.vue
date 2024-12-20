<template>
  <div class="relative">
    <textarea
      :id="id"
      ref="textarea"
      v-model="model"
      :name="name"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      :rows="rows"
      :aria-invalid="invalid"
      :aria-errormessage="errorId"
      class="w-full rounded border bg-neutral-800 font-mono transition-colors hover:bg-neutral-800/80 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
      :class="[
        textareaClass,
        {
          'border-red-500 outline-none': invalid,
          'p-1 text-xs': size === 'xsmall',
          'p-1 text-sm': size === 'small',
          'p-1.5': size === 'medium',
          'p-2': size === 'large'
        }
      ]"
      @input="handleInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />

    <div
      v-if="invalid && errorMessage"
      :id="errorId"
      role="alert"
      class="absolute left-0 top-full mt-0.5 text-sm text-red-500"
      aria-live="polite"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

export type TextareaProps = {
  id: string;
  name?: string;
  placeholder?: string;
  errorMessage?: string;
  size?: "xsmall" | "small" | "medium" | "large";
  textareaClass?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  autofocus?: boolean;
  rows?: number;
  autoResize?: boolean;
};

const props = withDefaults(defineProps<TextareaProps>(), {
  name: "",
  size: "medium",
  placeholder: "",
  errorMessage: "",
  textareaClass: "",
  rows: 3,
  autoResize: true,
});

const model = defineModel<string | undefined>({ required: true });

const emit = defineEmits<{
  (e: "input", event: Event): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
}>();

const textarea = ref<HTMLTextAreaElement | null>(null);
const errorId = computed(() => `${props.id}-error`);

const handleInput = (event: Event) => {
  emit("input", event);

  if (props.autoResize && textarea.value) {
    textarea.value.style.height = "auto";
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
  }
};

onMounted(() => {
  if (textarea.value) {
    if (props.autofocus) {
      textarea.value.focus();
    }

    if (props.autoResize) {
      textarea.value.style.height = "auto";
      textarea.value.style.height = `${textarea.value.scrollHeight}px`;
    }
  }
});
</script>
