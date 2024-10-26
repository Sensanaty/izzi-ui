import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { z } from "zod";

import type { LoginResponse } from "@/api/auth";
import extractDefaults from "@/utils/zodUtils";
import { useRouter } from "vue-router";
import { ROUTE } from "@/router/routes";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().optional(),
  admin: z.boolean(),
});

type User = z.infer<typeof userSchema>;

const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const token = ref(localStorage.getItem("token") || "");
  const user = ref<User>(getUserFromLocalStorage());
  const hasCalledAuthOrLogin = ref(false);
  const loggedIn = computed(() => hasCalledAuthOrLogin.value && token?.value !== "");

  function getUserFromLocalStorage(): User {
    const storedUser = localStorage.getItem("user");

    if (typeof storedUser === "string") {
      return JSON.parse(storedUser) as User;
    }

    return extractDefaults(userSchema);
  }

  function setToken(payload: string) {
    token.value = payload;
    localStorage.setItem("token", payload);

    hasCalledAuthOrLogin.value = true;
  }

  function setAuthStore(payload: LoginResponse) {
    token.value = payload.token;
    user.value = payload.user;

    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));

    hasCalledAuthOrLogin.value = true;
  };

  function setAuthFromLocal() {
    if (!user.value.username) {
      user.value = getUserFromLocalStorage();
    }

    hasCalledAuthOrLogin.value = true;
  }

  async function logout() {
    token.value = "";
    user.value = extractDefaults(userSchema);

    localStorage.removeItem("token");
    hasCalledAuthOrLogin.value = false;

    await router.push(ROUTE.LOGIN);
  }

  return {
    token,
    user,
    loggedIn,

    setAuthStore,
    setToken,
    setAuthFromLocal,
    logout,
  };
});

export default useAuthStore;
