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
    <transition name="fade">
      <div v-show="isFocus && searchResults.length" class="search-result">
        <div
          v-for="res in searchResults"
          :key="res.fod.path"
          class="search-item"
          :title="res.fod.path"
          @click="itemClick(res.fod)"
        >
          <div
            class="icon"
            :class="`${
              res.fod.kind === 'directory' ? 'icon-folder' : 'icon-file'
            }`"
          ></div>
          <div class="name f-thide" v-html="res.highlightName"></div>
          <div class="path f-thide">{{ res.fod.path }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { Directory, FileOrDirectory } from "../type";

const props = defineProps<{ root: Directory }>();
const emit = defineEmits(["searched"]);

const filename = ref("");
const isFocus = ref(false);

const searchResults = computed(() => {
  const res: Array<{ fod: FileOrDirectory; highlightName: string }> = [];
  const name = filename.value;
  if (name) {
    let stack = [...(props.root.children || [])];
    while (stack.length) {
      const fod = stack.shift()!;
      // 排除node_modules dist
      if (/\/(dist|node_modules)(\/|$)/.test(fod.path)) continue;
      if (fod.name.indexOf(name) !== -1) {
        res.push({
          fod,
          highlightName: fod.name.replace(name, `<em>${name}<em>`),
        });
      }
      // 仅展示100条 防止渲染卡顿
      if (res.length >= 100) break;
      if (fod.kind === "directory" && fod.children?.length) {
        stack = [...fod.children, ...stack];
      }
    }
  }
  return res;
});

function itemClick(fod: FileOrDirectory) {
  emit("searched", fod);
}

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
    max-height: 300px;
    padding: 9px 0;
    background-color: #252526;
  }
  .search-item {
    display: flex;
    align-items: center;
    height: 22px;
    margin: 2px;
    padding-left: 5px;
    line-height: 22px;
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
      flex-shrink: 0;
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
      max-width: 130px;
      margin-right: 5px;
      font-size: 13px;
      color: #ccc;
      :deep(em) {
        color: #2aaaff;
      }
    }
    .path {
      flex: 1;
      margin-top: 1px;
      font-size: 12px;
      color: #999;
    }
  }
}

// fade transition
.fade-enter-active {
  opacity: 0;
  transition: all 0.15s ease-out;
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-active {
  opacity: 1;
  transition: all 0.15s ease-out;
}
.fade-leave-to {
  opacity: 0;
}
</style>
