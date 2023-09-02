<template>
  <div class="error">
    <button @click="testError">throw error</button>
  </div>
</template>

<script lang="ts" setup>
function testError() {
  throw "test";
}
</script>

<style lang="scss" scoped></style>
