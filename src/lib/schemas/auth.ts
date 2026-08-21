import { z } from "zod";

import { userSchema } from "./user";

export const authenticationResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});

export type AuthenticationResponse = z.infer<typeof authenticationResponseSchema>;
