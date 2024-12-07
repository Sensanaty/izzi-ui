<template>
  <div class="flex items-center" :class="{ 'flex-col': column }">
    <label v-if="label" :for="id" class="cursor-pointer" :class="{ 'font-mono': mono, 'mr-auto': column, 'mr-3': !column }">
      {{ label }}<sup v-if="required" aria-hidden="true" class="text-red-600">*</sup>
    </label>

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
      class="
        w-full rounded border bg-neutral-800 font-mono transition-colors
        hover:bg-neutral-800/80
        disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
      :class="{ 'border-red-500 outline-none': invalid, 'p-1 text-xs': size === 'xsmall', 'p-1 text-sm': size === 'small', 'p-1.5': size === 'medium', 'p-2': size === 'large' }"
      @input="emit('input', $event)"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >

    <div role="alert" class="mb-1 mr-auto mt-0.5 min-h-5 text-sm text-red-500" aria-live="polite">
      {{ invalid && required ? errorMessage : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

type InputType = "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

type BaseInputProps = {
  id: string;
  autocomplete?: string;
  label?: string;
  name?: string;
  type?: InputType;
  placeholder?: string;
  errorMessage?: string;
  size?: "xsmall" | "small" | "medium" | "large";

  invalid?: boolean;
  column?: boolean;
  autofocus?: boolean;
  required?: boolean;
  disabled?: boolean;
  mono?: boolean;
  validateOnMount?: boolean;
};

const model = defineModel<unknown>({ required: true });

const props = withDefaults(defineProps<BaseInputProps>(), {
  autocomplete: "off",
  label: "",
  name: "",
  type: "text",
  size: "medium",
  placeholder: "",
  errorMessage: "",
});

const emit = defineEmits<{
  (e: "input", event: Event): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
}>();

const input = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (input.value && props?.autofocus) {
    input.value.focus();
  }
});
</script>
