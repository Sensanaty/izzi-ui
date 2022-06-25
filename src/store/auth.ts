import { defineStore } from "pinia";
import $axios from "~/lib/axios";

const useAuthStore = defineStore("auth", {
  state: () => { return { loggedIn: false, token: ""}; },
  actions: {
    async login(username: string, password: string, remember = false) {
      const data = { username, password, remember };

      await $axios.post("auth/login", { data }).then((response) => {
        this.setToken(response.data.token);
      }).catch((err) => { console.log(err.response.message); });
    },
    logout() {
      this.removeToken();
    },
    setToken(token: string) {
      this.loggedIn = true;
      this.token = token;
      window.localStorage.setItem("token", token);
    },
    removeToken() {
      this.loggedIn = false;
      this.token = "";
      window.localStorage.removeItem("token");
    }
  }
});

export default useAuthStore;
