import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/app",
      name: "app",
      component: () => import("../pages/app.vue"),
    },
    {
      path: "/er",
      name: "er",
      component: () => import("../pages/error-router.vue"),
    },
    {
      path: "/:w*",
      redirect: {
        name: "app",
      },
    },
  ],
});

router.beforeEach((from, to, next) => {
  console.log("beforeEach entered");

  try {
    next();
  } catch (e) {
    console.log("router beforeEach", e);
  }
});

export default router;
