import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "~/modules/router";
import useAuthStore from "~/store/auth";
import "./index.css";
import App from "./App.vue";
import { createHead } from "@vueuse/head";
import PrimeVue from "primevue/config";

const pinia = createPinia();
const app = createApp(App);
const head = createHead();

app
  .use(router)
  .use(pinia)
  .use(head)
  .use(PrimeVue)
  .mount("#app");

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.auth) {
    auth.authenticated().then((isAuthenticated) => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    });
  }
});
