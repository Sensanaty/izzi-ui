import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  admin: z.boolean(),
});

export const usersResponseSchema = z.array(userSchema);

export const userResponseSchema = z.object({
  user: userSchema,
});

export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
