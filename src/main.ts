import { createApp } from "vue";
import { createPinia } from "pinia";
import IzziButton from "@/components/ui/IzziButton.vue";
import { initializeAuth } from "@/lib/authBootstrap";

import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const pinia = createPinia();
initializeAuth(pinia, router);

const app = createApp(App);

app.use(pinia);
app.use(router);
app.component("IzziButton", IzziButton);
app.mount("#app");
