import { createApp } from "vue";
import { createPinia } from "pinia";
import PhosphorVue from "phosphor-vue";
import "./index.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app
  .use(pinia)
  .use(PhosphorVue)
  .mount("#app");
