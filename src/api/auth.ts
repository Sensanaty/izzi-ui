import useFetch from "@/composables/useFetch";
import { z } from "zod";
import { userSchema } from "@/stores/auth";

type LoginPayload = {
  username: string;
  password: string;
};

const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

const authenticateResponseScheme = z.object({
  token: z.string().optional(),
});
export type AuthenticateResponse = z.infer<typeof authenticateResponseScheme>;

const useAuthApi = () => {
  const { isFetching: isFetchingLogin, fetch } = useFetch(false);
  async function login(payload: LoginPayload) {
    return fetch<LoginResponse>("/auth/login", "POST", { data: payload });
  }

  const { fetch: fetchAuthenticate } = useFetch();
  async function authenticate(skipError?: boolean) {
    return fetchAuthenticate<AuthenticateResponse>("/auth/authenticate", "GET", { skipError });
  }

  return {
    isFetchingLogin,
    login,

    authenticate,
  };
};

export default useAuthApi;
