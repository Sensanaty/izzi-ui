import { defineStore } from "pinia";
import { ref } from "vue";

import catchResponse from "~/modules/catchResponse";
import { api } from "~/modules/fetch";
import useNotificationStore from "~/store/notification";

import type { AxiosResponse } from "axios";
import type { LoginData } from "~/types/endpoints";
import type { User } from "~/types/store/auth";

type LoginResponse = AxiosResponse<{
  user: User;
  token: string;
}>

const useAuthStore = defineStore("auth", () => {
  const loggedIn = ref(false);
  const token = ref<string | null>(null);
  const user = ref<User>({ id: 0, username: "", email: "", admin: false });

  function setToken(authToken: string) {
    token.value = authToken;
    localStorage.setItem("token", token.value);
    loggedIn.value = true;
  }

  async function checkAuthenticatedStatus(swallowErrors = false) {
    const authToken = localStorage?.getItem("token") ?? token.value;

    if (!authToken) { return Promise.resolve(false) }

    let isAuthed = false;

    await api.get("auth/authenticate", { headers: { "Authorization": authToken } })
      .then((res) => {
        setToken(res?.data?.token || authToken);

        isAuthed = true;
      }).catch((err: unknown) => {
        if (swallowErrors) {
          return Promise.resolve(false);
        }

        catchResponse(err);
        isAuthed = false;
      });

    return Promise.resolve(isAuthed);
  }

  async function login(username: LoginData["username"], password: LoginData["password"], remember: LoginData["remember"] = false) {
    const { createNotification } = useNotificationStore();

    await api.post("auth/login", { username, password, remember }).then((response: LoginResponse) => {
      user.value = response.data.user;
      setToken(response.data.token);

      createNotification("You have successfully logged in", "succ");
    }).catch((err: unknown) => {
      catchResponse(err);
    })
  }

  function logout() {
    const { createNotification } = useNotificationStore();

    localStorage.removeItem("token")
    user.value = { id: 0, username: "", email: "", admin: false };
    loggedIn.value = false;
    token.value = "";

    createNotification("You have been logged out successsfuly", "info");
  }

  async function getUserDetails() {
    await api.get("auth/user", { headers: { "Authorization": token.value } })
      .then((response: AxiosResponse<{ user: User }>) => {
        user.value = response.data.user;
      }).catch((err) => {
        console.error(err);
      })
  }

  return {
    loggedIn,
    token,
    user,

    checkAuthenticatedStatus,
    login,
    logout,
    setToken,
    getUserDetails
  }
})

export default useAuthStore;
