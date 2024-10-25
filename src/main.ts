import { createPinia } from "pinia";
import { createApp } from "vue";

import "@/assets/main.css";

import App from "@/App.vue";
import router from "@/router";

import BaseButton from "@/components/Base/BaseButton.vue";
import BaseInput from "@/components/Base/Form/BaseInput.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component("BaseButton", BaseButton);
app.component("BaseInput", BaseInput);

app.mount("#app");
