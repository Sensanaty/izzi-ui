import { defineStore } from "pinia";
import $axios from "~/lib/axios";
import useNotificationStore from "#store/notification";
import { NotificationType } from "#types";

const useAuthStore = defineStore("auth", {
  state: () => { return { loggedIn: false, token: ""}; },
  actions: {
    async login(username: string, password: string, remember = false) {
      const notification = useNotificationStore();
      const data = { username, password, remember };

      await $axios.post("auth/login", { data }).then((response) => {
        this.setToken(response.data.token);

        notification.createNotification("Successfuly logged in", NotificationType.succ);
      });
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
    },
    checkToken() {
      if (window.localStorage.getItem("token") || this.token) {
        this.setToken(window.localStorage.getItem("token") || this.token);

        return true;
      } else { return false; }
    }
  }
});

export default useAuthStore;
