import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory("/vue-use-sync-url"),
  routes: [
    {
      path: "/",
      redirect: "/example1",
    },
    {
      path: "/example1",
      component: () => import("./pages/example1.vue"),
    },
    {
      path: "/example2",
      component: () => import("./pages/example2.vue"),
    },
    {
      path: "/example3",
      component: () => import("./pages/example3.vue"),
    },
  ],
});

const app = createApp(App);

app.use(router);

app.use(ElementPlus);

app.mount("#app");
