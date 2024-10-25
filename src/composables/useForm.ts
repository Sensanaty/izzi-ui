import { ref, computed } from "vue";
import { z } from "zod";
import extractDefaults from "@/utils/zodUtils";

type UseFormOptions = {
  validateImmediately?: boolean;
};

export default function useForm<TSchema extends z.ZodSchema>(
  schema: TSchema,
  options: UseFormOptions = {},
) {
  type FormType = z.infer<TSchema>;

  const values = ref<FormType>(extractDefaults(schema));
  const errors = ref<Partial<Record<keyof FormType, string>>>({});

  const isValid = computed(() => {
    return schema.safeParse(values.value);
  });

  function validateField(field: keyof FormType) {
    if (!isValid.value.success) {
      const fieldError = isValid.value.error.errors.find((err) => err.path[0] === field);

      if (fieldError) {
        errors.value[field] = fieldError.message;
      } else {
        delete errors.value[field];
      }
    } else {
      delete errors.value[field];
    }

    return !errors.value[field];
  }

  function validateAll() {
    if (!isValid.value.success) {
      isValid.value.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormType;

        errors.value[field] = err.message;
      });
    } else {
      errors.value = {};
    }

    return isValid.value.success;
  }

  if (options?.validateImmediately) {
    validateAll();
  }

  return {
    values,
    errors,
    isValid,

    validateField,
    validateAll,
  };
};
