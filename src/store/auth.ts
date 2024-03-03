import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";

import catchResponse from "~/modules/catchResponse";
import { api } from "~/modules/fetch";
import useNotificationStore from "~/store/notification";
import { LoginData } from "~/types/endpoints";
import { User } from "~/types/store/auth";

type LoginResponse = AxiosResponse<{
  user: User;
  token: string;
}>

const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      loggedIn: false,
      token: null as string | null,
      user: {
        id: 0,
        username: "",
        email: ""
      } as User
    };
  },
  actions: {
    async authenticated(): Promise<boolean> {
      const token = window.localStorage.getItem("token") ?? this.token;

      if (!token) { return Promise.resolve(false); }

      try {
        const response = await api.get("auth/authenticate", { headers: { "Authorization": token } });
        this.setToken(response.data.token || token);

        return Promise.resolve(true);
      } catch (err: unknown) {
        catchResponse(err);

        return Promise.resolve(false);
      }
    },
    async login(username: LoginData["username"], password: LoginData["password"], remember: LoginData["remember"] = false) {
      const { createNotification } = useNotificationStore();

      await api.post("auth/login", { username, password, remember }).then((response: LoginResponse) => {
        this.setUser(response.data.user);
        this.setToken(response.data.token);
        createNotification("You have successfully logged in", "succ");
      }).catch((err: unknown) => {
        catchResponse(err);
      })
    },
    logout() {
      const { createNotification } = useNotificationStore();

      window.localStorage.removeItem("token");
      this.$reset();
      createNotification("You have been logged out", "info");
    },
    setUser(user: User) {
      this.user.id = user.id;
      this.user.username = user.username;
      this.user.email = user.email;
    },
    setToken(token: string) {
      this.token = token;
      window.localStorage.setItem("token", this.token);
      this.loggedIn = true;
    }
  }
});

export default useAuthStore;
