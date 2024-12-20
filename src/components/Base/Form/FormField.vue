<template>
  <div class="flex items-baseline gap-2">
    <SoloLabel
      :html-for="id"
      :required="required"
      :class="[labelClass]"
      mono
    >
      {{ label }}
    </SoloLabel>

    <SoloInput
      :id="id"
      v-model="model"
      :type="type"
      :required="required"
      :invalid="invalid"
      :error-message="errorMessage"
      class="flex-1"
      :size="size ?? 'small'"
      :class="[inputClass]"
    />
  </div>
</template>

<script setup lang="ts">
import SoloLabel from "@/components/Base/Form/SoloLabel.vue";
import SoloInput, { type InputProps, type InputType } from "@/components/Base/Form/SoloInput.vue";

interface FormFieldProps {
  id: string;
  label: string;
  type?: InputType;
  required?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  labelClass?: string;
  inputClass?: string;
  size?: InputProps["size"];
}

const model = defineModel<unknown>({ required: true });

defineProps<FormFieldProps>();
</script>
