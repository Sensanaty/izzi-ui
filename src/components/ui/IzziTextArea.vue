<template>
  <div class="grid content-start gap-1">
    <div v-if="label" class="min-h-6">
      <label class="font-bold" :for="textareaId">
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

    <textarea
      ref="textareaElement"
      v-bind="$attrs"
      :id="textareaId"
      v-model="model"
      :aria-describedby="describedBy"
      :aria-errormessage="error ? errorId : undefined"
      :aria-invalid="Boolean(error) || invalid"
      :aria-required="required || undefined"
      class="bg-input focus:ring-focus-ring min-h-24 w-full rounded-sm border-2 px-3 py-2 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:text-text-muted"
      :class="error || invalid ? 'border-danger!' : 'border-border!'"
      :disabled="disabled"
      :required="required"
    />

    <p v-if="error" :id="errorId" class="text-danger" role="alert" aria-live="polite">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useId, useTemplateRef } from "vue";

defineOptions({ inheritAttrs: false });

export type IzziTextAreaProps = {
  id?: string;
  label?: string;
  description?: string;
  error?: string | null;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
};

const props = withDefaults(defineProps<IzziTextAreaProps>(), {
  id: undefined,
  label: undefined,
  description: undefined,
  error: null,
  invalid: false,
  required: false,
  disabled: false,
});

const model = defineModel<string>({ default: "" });
const attrs = useAttrs();

const textareaElement = useTemplateRef<HTMLTextAreaElement>("textareaElement");
const textareaId = computed(() => props.id ?? `izzi-textarea-${useId()}`);
const descriptionId = computed(() => `${textareaId.value}-description`);
const errorId = computed(() => `${textareaId.value}-error`);

const describedBy = computed(() => {
  const externalDescription = attrs["aria-describedby"];
  const ids = [
    props.description ? descriptionId.value : undefined,
    props.error ? errorId.value : undefined,
    typeof externalDescription === "string" ? externalDescription : undefined,
  ];

  return ids.filter((value): value is string => Boolean(value)).join(" ") || undefined;
});

defineExpose({
  focus: (): void => textareaElement.value?.focus(),
  textareaElement,
});
</script>
