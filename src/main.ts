import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "~/modules/router";
import useAuthStore from "~/store/auth";
import "./index.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app
  .use(router)
  .use(pinia)
  .mount("#app");

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.auth) {
    if (!auth.authenticated()) {
      router.push("/login");
    }
  }
});
