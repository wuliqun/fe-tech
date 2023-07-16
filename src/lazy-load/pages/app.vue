<template>
  <div class="imgs">
    <div v-for="img in images" :key="img" class="img">
      <img v-lazy="img" alt="" />
    </div>
    <img src="/public/img.png" alt="" />
  </div>
</template>
<script setup lang="ts">
import vLazy from "../v-lazy";

const images = [
  "https://qumi-1304843926.cos.ap-shanghai.myqcloud.com/images/common/64abb997d07aa.png",
  "https://qumi-1304843926.cos.ap-shanghai.myqcloud.com/images/common/64abb9675ed82.png",
  "https://qumi-1304843926.cos.ap-shanghai.myqcloud.com/images/common/64a7cba9e9be8.png",
  "https://qumi-1304843926.cos.ap-shanghai.myqcloud.com/images/common/64a389b16ab01.png",
  "https://qumi-1304843926.cos.ap-shanghai.myqcloud.com/images/common/649bb752d25a8.png",
];
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
