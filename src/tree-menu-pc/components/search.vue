<template>
  <div class="m-search">
    <input
      v-model="filename"
      type="text"
      placeholder="Search"
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
    <button class="icon-search"></button>
    <div v-show="isFocus && result.length" class="search-result">
      <div v-for="index in 10" :key="index" class="search-item">
        <div
          class="icon"
          :class="`${index % 2 === 0 ? 'icon-folder' : 'icon-file'}`"
        ></div>
        <div class="name">{{ ",khafsbnjshb," }}</div>
        <div class="path f-thide">{{ "akh,ajkn/a,hfas/khkfsn/akha,bn" }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { Directory } from "../type";

const props = defineProps<{ root: Directory }>();

const filename = ref("");
const isFocus = ref(false);

const result = computed(() => {
  const res: {} = [];
  const name = filename.value;
  if (name) {
  }
  return [];
});

watch(filename, (val) => {
  if (/(^\s+|\s+$)/.test(val)) {
    nextTick(() => {
      filename.value = val.replace(/(^\s+|\s+$)/g, "");
    });
  }
});
</script>
<style lang="scss" scoped>
.m-search {
  position: relative;
  padding: 12px 0;
  input {
    width: 100%;
    height: 27px;
    padding: 0 30px 0 9px;
    box-sizing: border-box;
    color: #ccc;
    border: 1px solid #3c3c3c;
    border-radius: 3px;
    background: url(../img/search.png) no-repeat right 10px center/16px;
    &:focus {
      border-color: #007fd4;
    }
  }

  .search-result {
    overflow-y: auto;
    position: absolute;
    top: 42px;
    left: 0;
    right: 0;
    height: 300px;
    padding: 9px 0;
    background-color: #252526;
  }
  .search-item {
    display: flex;
    align-items: center;
    height: 22px;
    margin: 2px;
    padding-left: 5px;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background-color: #04395e;
      .name {
        color: #fff;
      }
      .path {
        color: #ccc;
      }
    }
    .icon {
      width: 15px;
      height: 15px;
      margin-right: 5px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      &.icon-file {
        background-image: url(../img/file.png);
      }
      &.icon-folder {
        background-image: url(../img/folder.png);
      }
    }
    .name {
      margin-right: 5px;
      font-size: 13px;
      color: #ccc;
    }
    .path {
      flex: 1;
      margin-top: 3px;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
