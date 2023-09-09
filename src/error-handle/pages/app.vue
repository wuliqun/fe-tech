<template>
  <div class="app">
    <error-vue />
    <button @click="nav('none')">nav to a unexist router</button><br />
    <button @click="nav('er')">nav to a router which throws error</button>
    <router-link :to="{ name: 'er' }">{{ data.name }}</router-link>
    <div @click="changeData()">change data</div>
  </div>
</template>
<script setup lang="ts">
import { onErrorCaptured, reactive } from "vue";
import { useRouter } from "vue-router";
import ErrorVue from "./error.vue";

/**
 * 仅能处理子组件抛出的错误  自身抛出的错误不行
 */
onErrorCaptured((err) => {
  console.log("app onErrorCaptured", err);
  // return false;
});
let count = 0;
const data = reactive({
  name: "wlq",
});

const router = useRouter();
function nav(name) {
  router.push({ name });
}
function change(d) {
  d.name = "xxxx";
}
function changeData() {
  change(data);
}
</script>

<style lang="scss" scoped>
.img {
  width: 700px;
  height: 700px;
  margin: 0 auto;
  img {
    width: 100%;
  }
}
</style>
