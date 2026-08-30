import { z } from "zod";

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()),
  }),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
