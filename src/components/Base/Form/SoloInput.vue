<template>
  <div class="relative">
    <input
      :id="id"
      ref="input"
      v-model="model"
      :type="type"
      :name="name"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="invalid"
      :aria-errormessage="errorId"
      class="w-full rounded border bg-neutral-800 font-mono transition-colors hover:bg-neutral-800/80 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
      :class="[
        inputClass,
        {
          'border-red-500 outline-none': invalid,
          'p-1 text-xs': size === 'xsmall',
          'p-1 text-sm': size === 'small',
          'p-1.5': size === 'medium',
          'p-2': size === 'large'
        }
      ]"
      @input="emit('input', $event)"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >

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

export type InputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" |
  "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" |
  "url" | "week";

export type InputProps = {
  id: string;
  name?: string;
  type?: InputType;
  placeholder?: string;
  errorMessage?: string;
  size?: "xsmall" | "small" | "medium" | "large";
  inputClass?: string;
  autocomplete?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  autofocus?: boolean;
};

const props = withDefaults(defineProps<InputProps>(), {
  name: "",
  type: "text",
  size: "medium",
  placeholder: "",
  errorMessage: "",
  inputClass: "",
  autocomplete: "off",
});

const model = defineModel<unknown>({ required: true });

const emit = defineEmits<{
  (e: "input", event: Event): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
}>();

const input = ref<HTMLInputElement | null>(null);
const errorId = computed(() => `${props.id}-error`);

onMounted(() => {
  if (input.value && props.autofocus) {
    input.value.focus();
  }
});
</script>
