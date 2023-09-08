<template>
  <button class="my-button" @click="count++"><slot></slot>{{ count }}</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const count = ref(0);
</script>

<style lang="scss">
.my-button {
  width: 120px;
  height: 60px;
  color: #fff;
  background-color: lightgreen;
}
</style>
