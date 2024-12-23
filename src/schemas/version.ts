import {
  object,
  string,
  date,
  number,
  record,
  array,
  enum as ZodEnum,
  unknown,
  ZodType,
  type infer as ZodInfer,
} from "zod";

export type Version<T> = {
  id: number;
  whodunnit?: string;
  created_at: Date;
  item_id: number;
  item_type: string;
  event: "create" | "update" | "destroy";
  object: T;
  object_changes?: Record<keyof T, [unknown, unknown]>;
};

export const VersionSchema = <T extends ZodType>(modelSchema: T) => {
  return object({
    id: number().int(),
    whodunnit: string().nullable(),
    created_at: date(),
    item_id: number().int(),
    item_type: string(),
    event: ZodEnum(["create", "update", "destroy"]),
    object: modelSchema,
    object_changes: record(string(), array(unknown())).optional(),
  });
};
