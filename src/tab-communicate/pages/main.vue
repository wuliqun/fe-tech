<template>
  <div class="main">
    <el-button type="primary" @click="sendMessageByBroadcastChannel()"
      >BroadcastChannel message</el-button
    >
    <el-button type="primary" @click="sendMessageByServiceWorker()"
      >service worker message</el-button
    >
    <el-button type="primary" @click="sendMessageByLocalStorage()"
      >localStorage message</el-button
    >

    {{ shared }}
  </div>
</template>
<script setup lang="ts">
import { APPID, shared } from "../utils/config";
import Channel from "../utils/channel";
//#region BroadcastChannel
const channel = new Channel(APPID);
function sendMessageByBroadcastChannel() {
  channel.send({
    from: "main",
    type: "main",
    message: "main test",
  });
}
channel.on("sub", (message, from) => {
  console.log(`Got BroadastChannel message: ${message}, from: ${from}`);
});
//#endregion

//#region service worker
function sendMessageByServiceWorker() {
  navigator.serviceWorker.controller?.postMessage({
    message: {
      from: "main",
      message: "main service work test",
    },
  });
}
//#endregion

//#region
function sendMessageByLocalStorage() {
  localStorage.setItem(
    "tab-message",
    JSON.stringify({
      from: "main",
      message: "main local test",
      st: Date.now(),
    })
  );
}
//#endregion
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-button {
  margin: 30px 0;
}
</style>
