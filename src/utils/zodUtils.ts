import { ref } from "vue";
import { z, ZodError, type ZodIssue, type ZodRawShape } from "zod";
import { labelize } from "@/utils/stringUtils.ts";

type ZodArrayDef = z.ZodArray<z.ZodTypeAny>;
type ZodObjectDef = z.ZodObject<z.ZodRawShape>;

// Union type of all supported Zod types
type ZodTypeDef = z.ZodString
  | z.ZodNumber
  | z.ZodBoolean
  | ZodArrayDef
  | ZodObjectDef
  | z.ZodDate
  | z.ZodEnum<[string, ...string[]]>
  | z.ZodLiteral<unknown>;

function getDefaultForType(schema: ZodTypeDef): unknown {
  switch (schema.constructor) {
    case z.ZodString:
      return "";
    case z.ZodNumber:
      return 0;
    case z.ZodBoolean:
      return false;
    case z.ZodArray:
      return [];
    case z.ZodObject:
      return extractDefaults(schema as ZodObjectDef);
    case z.ZodDate:
      return new Date();
    case z.ZodEnum:
      return (schema as z.ZodEnum<[string, ...string[]]>).options[0];
    case z.ZodLiteral:
      return (schema as z.ZodLiteral<unknown>)._def.value;
    default:
      return undefined;
  }
}

function unwrapSchema<T extends z.ZodTypeAny>(schema: T): z.ZodTypeAny {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return unwrapSchema(schema.unwrap());
  }
  if (schema instanceof z.ZodEffects) {
    return unwrapSchema(schema.innerType());
  }
  return schema;
}

export default function extractDefaults<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  const unwrapped = unwrapSchema(schema);

  // Handle explicit defaults first
  if (unwrapped instanceof z.ZodDefault) {
    return unwrapped._def.defaultValue();
  }

  // Handle objects
  if (unwrapped instanceof z.ZodObject) {
    const defaults = {} as z.infer<T>;

    for (const [key, field] of Object.entries(unwrapped.shape)) {
      defaults[key as keyof typeof defaults] = extractDefaults(field as z.ZodTypeAny);
    }

    return defaults;
  }

  // Handle all other types
  return getDefaultForType(unwrapped as ZodTypeDef) as z.infer<T>;
}

interface FieldDefinition {
  key: string;
  label: string;
}

interface ExtraField extends FieldDefinition {
  afterKey?: string; // Insert after this key. If not specified, adds to end
}

interface SchemaFieldsOptions {
  exclude?: string[];
  extraFields?: ExtraField[];
}

export function generateFieldsFromSchema(
  schema: z.ZodObject<ZodRawShape>,
  options?: SchemaFieldsOptions,
): FieldDefinition[] {
  // Get base fields from schema, excluding specified keys
  const baseFields = Object.keys(schema.shape)
    .filter(key => !options?.exclude?.includes(key))
    .map(key => ({
      key,
      label: labelize(key),
    }));

  // Handle extra fields with positioning
  const result: FieldDefinition[] = [...baseFields];

  if (options?.extraFields) {
    options.extraFields.forEach(extraField => {
      const { afterKey, ...fieldDefinition } = extraField;

      if (afterKey) {
        const insertIndex = result.findIndex(field => field.key === afterKey);
        if (insertIndex !== -1) {
          result.splice(insertIndex + 1, 0, fieldDefinition);
        } else {
          result.push(fieldDefinition);
        }
      } else {
        result.push(fieldDefinition);
      }
    });
  }

  return result;
}

export function useZodValidation<T extends z.ZodType>(schema: T) {
  type SchemaType = z.infer<T>;

  const errors = ref<Partial<Record<keyof SchemaType, string>>>({});

  const validate = (form: SchemaType) => {
    try {
      schema.parse(form);
      errors.value = {};
      return true;
    } catch (e) {
      if (e instanceof ZodError) {
        errors.value = e.errors.reduce<Partial<Record<keyof SchemaType, string>>>((acc, curr: ZodIssue) => {
          const path = curr.path[0] as keyof SchemaType;
          acc[path] = curr.message;
          return acc;
        }, {});
        return false;
      }

      // Re-throw unexpected errors
      throw e;
    }
  };

  return {
    errors,
    validate,
  };
}
