import { api } from "@/lib/api";
import { userSchema, usersResponseSchema } from "@/lib/schemas/user";

import type { User } from "@/lib/schemas/user";

export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  admin: boolean;
};

export type UpdateUserPayload = {
  username?: string;
  email?: string;
  password?: string;
  admin?: boolean;
};

export async function getUser(id: number): Promise<User> {
  return api.get(`/users/${id}`, userSchema);
}

export async function getUsers(): Promise<User[]> {
  return api.get("/users", usersResponseSchema);
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  return api.post("/users", payload, userSchema);
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  return api.patch(`/users/${id}`, payload, userSchema);
}
