<template>
  <div class="relative">
    <select
      :id="id"
      ref="select"
      v-model="model"
      :name="name"
      :required="required"
      :disabled="disabled"
      :aria-invalid="invalid"
      :aria-errormessage="errorId"
      class="w-full appearance-none rounded border bg-neutral-800 font-mono transition-colors hover:bg-neutral-800/80 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
      :class="[
        selectClass,
        {
          'border-red-500 outline-none': invalid,
          'p-1 text-xs': size === 'xsmall',
          'p-1 text-sm': size === 'small',
          'p-1.5': size === 'medium',
          'p-2': size === 'large'
        }
      ]"
      @change="emit('change', $event)"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
      <option v-if="placeholder" value="" disabled selected>
        {{ placeholder }}
      </option>
      <slot />
    </select>

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

export type SelectProps = {
  id: string;
  name?: string;
  placeholder?: string;
  errorMessage?: string;
  size?: "xsmall" | "small" | "medium" | "large";
  selectClass?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  autofocus?: boolean;
};

const props = withDefaults(defineProps<SelectProps>(), {
  name: "",
  size: "medium",
  placeholder: "",
  errorMessage: "",
  selectClass: "",
});

const model = defineModel<unknown>({ required: true });

const emit = defineEmits<{
  (e: "change", event: Event): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
}>();

const select = ref<HTMLSelectElement | null>(null);
const errorId = computed(() => `${props.id}-error`);

onMounted(() => {
  if (select.value && props.autofocus) {
    select.value.focus();
  }
});
</script>
