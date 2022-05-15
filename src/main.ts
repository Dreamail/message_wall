import * as Vue from "vue";
import App from "./App.vue";
//import Varlet from "@varlet/ui";
import "@varlet/ui/es/style.js";
import { createRouter, createWebHashHistory } from "vue-router";

import Home from "./pages/Home.vue";
import Notice from "./pages/Notice.vue";
import About from "./pages/About.vue";
import Send from "./pages/Send.vue";

import Cookies from "js-cookie";
import { nanoid } from "nanoid";

import {
  Uploader,
  NavBar,
  ConfigProvider,
  Form,
  Field,
  CellGroup,
  Button,
  Icon,
} from "vant";

if (Cookies.get("user") == undefined) {
  Cookies.set("user", nanoid());
}

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/notice", component: Notice },
  { path: "/send", component: Send },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

Vue.createApp(App)
  .use(Uploader)
  .use(NavBar)
  .use(ConfigProvider)
  .use(Form)
  .use(Field)
  .use(CellGroup)
  .use(Button)
  .use(Icon)
  .use(router)
  .mount("#app");
