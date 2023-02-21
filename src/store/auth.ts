import { defineStore } from "pinia";
import { api } from "~/modules/fetch";
import { User } from "~/types/store/auth";
import { LoginData } from "~/types/endpoints";
import { AxiosError } from "axios";
import useNotificationStore from "~/store/notification";

const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      loggedIn: false,
      token: "",
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
        const { createNotification } = useNotificationStore();

        return Promise.resolve(false);
      }
    },
    async login(username: LoginData["username"], password: LoginData["password"], remember: LoginData["remember"] = false) {
      const { createNotification } = useNotificationStore();

      try {
        const response = await api.post("auth/login", { username, password, remember });
        this.setUser(response.data.user);
        this.setToken(response.data.token);
        createNotification("You have successfully logged in", "succ");
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          createNotification(err?.response?.data.error, "dang");
        } else {
          createNotification("Something went wrong, please try again", "warn");
        }
      }
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
