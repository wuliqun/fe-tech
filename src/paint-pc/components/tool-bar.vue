<template>
  <div class="m-tool-bar">
    <div class="section">
      <button title="导入图片">
        <span class="icon icon-import"></span>
        <span class="txt">导入</span>
      </button>
    </div>
    <div class="section">
      <button title="矩形选框">
        <span class="icon icon-rect"></span>
        <span class="txt">选框</span>
      </button>
      <button title="裁剪">
        <span class="icon icon-cut"></span>
        <span class="txt">裁剪</span>
      </button>
      <button title="旋转">
        <span class="icon icon-rotate"></span>
        <span class="txt">旋转(90deg)</span>
      </button>
      <button title="反向旋转">
        <span class="icon icon-rotate"></span>
        <span class="txt">反向旋转(-90deg)</span>
      </button>
    </div>
    <div class="section">
      <button title="画笔">
        <span class="icon icon-pencil"></span>
        <span class="txt">画笔</span>
      </button>
      <div class="radius-wrapper">
        <span class="demonstration">粗细</span>
        <el-slider v-model="radius" :min="3" :max="20" />
      </div>
    </div>
    <div class="section">
      <button title="油漆桶">
        <span class="icon icon-paint"></span>
        <span class="txt">油漆桶</span>
      </button>
      <button title="橡皮">
        <span class="icon icon-eraser"></span>
        <span class="txt">橡皮</span>
      </button>
      <button title="吸管">
        <span class="icon icon-picker"></span>
        <span class="txt">吸管</span>
      </button>
    </div>
    <div class="section">
      <div class="color-wrapper">
        <span class="demonstration">前景色</span>
        <el-color-picker v-model="foreColor" size="small" />
      </div>
      <div class="color-wrapper">
        <span class="demonstration">背景色</span>
        <el-color-picker v-model="bgColor" size="small" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";

const radius = ref(3);

const foreColor = ref("#000000");
const bgColor = ref("#ffffff");

watch(foreColor, (val) => {
  if (!val) {
    nextTick(() => {
      foreColor.value = "#000000";
    });
  }
});
watch(bgColor, (val) => {
  if (!val) {
    nextTick(() => {
      bgColor.value = "#ffffff";
    });
  }
});
</script>

<style lang="scss" scoped>
.m-tool-bar {
  display: flex;
  background-color: #f5f6f7;
  .section {
    padding: 10px 20px;
    border-right: 1px solid #e3e4e5;
  }
}
</style>
