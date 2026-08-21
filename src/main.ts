import { createApp } from "vue";
import { createPinia } from "pinia";
import IzziButton from "@/components/ui/IzziButton.vue";

import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("IzziButton", IzziButton);
app.mount("#app");
