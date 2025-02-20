import { createApp } from "vue";
import store from "./store/store.js";
import "./styles/index.scss";
import App from "./App.vue";

const app = createApp(App);

app.use(store).mount("#app");
