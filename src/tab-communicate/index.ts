import { createApp } from "vue";
import "UTILS/reset.css";

import Layout from "./pages/layout.vue";
import router from "./router";
const app = createApp(Layout);

app.config.errorHandler = (err) => {
  console.log("config.errorHandler", err);
};
app.use(router);
app.mount("#app");

navigator.serviceWorker
  .register("./sw.js")
  .then(() => {
    console.log("Service Worker 注册成功");
  })
  .catch((error) => {
    console.error("Service Worker 注册失败:", error);
  });
