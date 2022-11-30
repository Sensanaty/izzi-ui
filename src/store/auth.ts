import { defineStore } from "pinia";
import { api } from "~/modules/fetch";
import { User } from "~/types/store/auth";
import { LoginData, LoginResponse } from "~/types/endpoints";

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
    authenticated(): boolean {
      const token = window.localStorage.getItem("token") ?? this.token;

      if (!token) { return false; }

      api.get("auth/authenticate", { headers: { "Authorization": token } }).then(response => {
        if (response.data.token) { this.setToken(response.data.token); }

        return true;
      }).catch(err => {
        console.log(err);
      });

      return false;
    },
    async login(username: LoginData["username"], password: LoginData["password"], remember: LoginData["remember"] = false) {
      await api.post("auth/login", { username, password, remember }).then((response) => {
        this.setUser(response.data.user);
        this.setToken(response.data.token);
      }).catch(err => {
        console.log(err.message);
      });
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
