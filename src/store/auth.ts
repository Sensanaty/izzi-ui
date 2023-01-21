import { defineStore } from "pinia";
import { api } from "~/modules/fetch";
import { User } from "~/types/store/auth";
import { LoginData } from "~/types/endpoints";
import { AxiosError } from "axios";

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

      if (!token) { return false; }

      try {
        const response = await api.get("auth/authenticate", { headers: { "Authorization": token } });
        this.setToken(response.data.token || window.localStorage.getItem("token"));

        return true;
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(err.message);
        } else {
          console.log(err);
        }

        return false;
      }
    },
    async login(username: LoginData["username"], password: LoginData["password"], remember: LoginData["remember"] = false) {
      try {
        const response = await api.post("auth/login", { username, password, remember });
        this.setUser(response.data.user);
        this.setToken(response.data.token);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.log(err.message);
        } else {
          console.log(err);
        }
      }
    },
    logout() {
      window.localStorage.removeItem("token");
      this.$reset();
    },
    setUser(user: User) {
      this.user.id = user.id;
      this.user.username = user.username;
      this.user.email = user.email;
    },
    setToken(token: string) {
      this.token = token;
      window.localStorage.setItem("token", token);
      this.loggedIn = true;
    }
  }
});

export default useAuthStore;
