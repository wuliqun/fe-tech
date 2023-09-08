import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/main",
      name: "main",
      component: () => import("../pages/main.vue"),
    },
    {
      path: "/sub",
      name: "sub",
      component: () => import("../pages/sub.vue"),
    },
    {
      path: "/:\\w*",
      redirect: {
        name: "main",
      },
    },
  ],
});

export default router;
