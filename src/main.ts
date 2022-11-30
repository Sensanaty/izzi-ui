import { createApp } from "vue";
import { createPinia } from "pinia";
import PhosphorVue from "phosphor-vue";
import router from "~/modules/router";
import useAuthStore from "~/store/auth";
import "./index.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app
  .use(router)
  .use(pinia)
  .use(PhosphorVue)
  .mount("#app");

router.beforeEach((to, from) => {
  const auth = useAuthStore();

  if (to.meta.auth && !auth.authenticated()) {
    console.log("swag");
  }
});
