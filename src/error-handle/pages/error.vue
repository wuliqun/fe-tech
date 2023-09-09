<template>
  <div class="error">
    <button @click="testError">throw error</button>
    <br />
    <button @click="changeNum">changeNum</button>
    <div ref="div">{{ doubleNum }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

function testError() {
  throw "test";
}

// vue3
const num = ref(0);
const watchVal = ref(0);
const div = ref<HTMLDivElement>();
function changeNum() {
  Promise.resolve(0).then(() => {
    console.log("promise");
  });
  num.value += 1;
  console.log("sync computed", doubleNum.value);
  console.log("sync watch", watchVal.value);
}
const doubleNum = computed(() => {
  console.log("computed", num.value * 2);
  return num.value * 2;
});

watch(num, (val) => {
  watchVal.value += 2;
  console.log("double", doubleNum.value);
  console.log("dom", div.value?.innerText);

  console.log("watch", watchVal.value);
});
</script>

<style lang="scss" scoped></style>
