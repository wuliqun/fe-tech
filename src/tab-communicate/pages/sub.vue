<template>
  <div class="sub">
    <el-button type="primary" @click="sendMessageByBroadcastChannel()"
      >BroadcastChannel message</el-button
    >
    <el-button type="primary" @click="shared = 'sub shared'"
      >change shared</el-button
    >
  </div>
</template>
<script setup lang="ts">
import { APPID, shared } from "../utils/config";
import Channel from "../utils/channel";
//#region BroadcastChannel
const channel = new Channel(APPID);
function sendMessageByBroadcastChannel() {
  channel.send({
    from: "sub",
    type: "sub",
    message: "sub test",
  });
}
channel.on("main", (message, from) => {
  console.log(`Got BroadastChannel message: ${message}, from: ${from}`);
});
//#endregion

//#region
navigator.serviceWorker.addEventListener("message", ({ data: { message } }) => {
  if (message.from === "main") {
    console.log(
      `Got Service Worker message: ${message.message}, from: ${message.from}`
    );
  }
});
//#endregion

//#region localStorage
window.addEventListener("storage", (e) => {
  if (e.key === "tab-message") {
    try {
      const data = JSON.parse(e.newValue!);
      if (data.from === "main") {
        console.log(
          `Got localStorage message: ${data.message}, from: ${data.from}`
        );
      }
    } catch (e) {}
  }
});
//#endregion
</script>

<style lang="scss" scoped>
.sub {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-button {
  margin: 30px 0;
}
</style>
