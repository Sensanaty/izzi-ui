<template>
  <div class="grid content-start gap-1">
    <div v-if="label" class="min-h-6">
      <label class="font-bold" :for="inputId">
        {{ label }}
        <sup v-if="required" aria-hidden="true">*</sup>

        <span v-if="required" class="sr-only">(required)</span>
      </label>
    </div>

    <div v-if="description" class="min-h-5">
      <p :id="descriptionId" class="text-text-muted text-sm">
        {{ description }}
      </p>
    </div>

    <div class="relative">
      <span
        v-if="$slots.prefix"
        class="absolute inset-y-0 left-3 inline-flex items-center"
        aria-hidden="true"
      >
        <slot name="prefix" />
      </span>

      <input
        ref="inputElement"
        v-bind="$attrs"
        :id="inputId"
        v-model="model"
        :aria-describedby="describedBy"
        :aria-errormessage="error ? errorId : undefined"
        :aria-invalid="Boolean(error) || props.invalid"
        :aria-required="required || undefined"
        class="bg-input focus:ring-focus-ring w-full rounded-sm border-2 px-3 py-2 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:text-text-muted"
        :class="{
          'border-border!': !error && !props.invalid,
          'border-danger!': Boolean(error) || props.invalid,
          'pl-10': $slots.prefix,
          'pr-10': $slots.suffix || clearable || isPassword,
        }"
        :disabled="disabled"
        :required="required"
        :type="inputType"
      />

      <div
        v-if="$slots.suffix || clearable || isPassword"
        class="absolute inset-y-0 right-3 inline-flex items-center gap-1"
      >
        <slot name="suffix" />

        <button
          v-if="clearable && model"
          class="text-text-muted hover:text-text focus:ring-focus-ring rounded-sm p-1 outline-none focus:ring-2"
          type="button"
          aria-label="Clear input"
          :disabled="disabled"
          @click="clearInput"
        >
          <X class="size-4" aria-hidden="true" />
        </button>

        <button
          v-if="isPassword"
          class="text-text-muted hover:text-text focus:ring-focus-ring rounded-sm p-1 outline-none focus:ring-2"
          type="button"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          :aria-pressed="showPassword"
          :disabled="disabled"
          @click="togglePasswordVisibility"
        >
          <EyeOff v-if="showPassword" class="size-4" aria-hidden="true" />
          <Eye v-else class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <p v-if="error" :id="errorId" class="text-danger" role="alert" aria-live="polite">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, useTemplateRef } from "vue";
import { Eye, EyeOff, X } from "@lucide/vue";

defineOptions({ inheritAttrs: false });

export type IzziInputProps = {
  id?: string;
  label?: string;
  description?: string;
  error?: string | null;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  type?: HTMLInputElement["type"];
};

const props = withDefaults(defineProps<IzziInputProps>(), {
  id: undefined,
  label: undefined,
  description: undefined,
  error: null,
  type: "text",
});

const model = defineModel<string>({ default: "" });

const attrs = useAttrs();

const emit = defineEmits<{
  clear: [];
}>();

const inputElement = useTemplateRef<HTMLInputElement>("inputElement");

const showPassword = ref(false);

const inputId = computed(() => props.id ?? `izzi-input-${useId()}`);
const descriptionId = computed(() => `${inputId.value}-description`);
const errorId = computed(() => `${inputId.value}-error`);

const isPassword = computed(() => props.type === "password");
const inputType = computed(() => (isPassword.value && showPassword.value ? "text" : props.type));

const describedBy = computed(() => {
  const externalDescription = attrs["aria-describedby"];

  const ids = [
    props.description ? descriptionId.value : undefined,
    props.error ? errorId.value : undefined,
    typeof externalDescription === "string" ? externalDescription : undefined,
  ];

  return ids.filter((value): value is string => Boolean(value)).join(" ") || undefined;
});

const clearInput = (): void => {
  model.value = "";
  inputElement.value?.focus();
  emit("clear");
};

async function togglePasswordVisibility(): Promise<void> {
  showPassword.value = !showPassword.value;

  await nextTick();
  inputElement.value?.focus();
}

defineExpose({
  focus: (): void => inputElement.value?.focus(),
  inputElement,
});
</script>
