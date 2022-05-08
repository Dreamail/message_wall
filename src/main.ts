import * as Vue from "vue";
import App from "./App.vue";
import Varlet from "@varlet/ui";
import "@varlet/ui/es/style.js";
import { createRouter, createWebHashHistory } from "vue-router";

import Home from "./pages/Home.vue";
import Notice from "./pages/Notice.vue";
import About from "./pages/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/notice", component: Notice },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

Vue.createApp(App).use(Varlet).use(router).mount("#app");
