import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(
    import.meta.env.PROD ? "/vue-use-sync-url" : undefined
  ),
  routes: [
    {
      path: "/",
      redirect: "/base",
    },
    {
      path: "/base",
      component: () => import("./pages/example1.vue"),
    },
    {
      path: "/other",
      component: () => import("./pages/example2.vue"),
    },
  ],
});

const app = createApp(App);

app.use(router);

app.use(ElementPlus);

app.mount("#app");
