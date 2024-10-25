import { z } from "zod";

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
