<template>
  <div class="app">
    <div class="sider">
      <button v-if="!root" class="btn-open" @click="selectFolder()">
        Open Folder
      </button>
      <tree-menu :root="root" />
    </div>
    <div class="main"></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import TreeMenu from "../components/tree-menu";
import type { FileOrDirectory, Directory } from "../type";

const root = ref<Directory>();
function selectFolder() {
  window.showDirectoryPicker().then(
    async (handler) => {
      const folder: Directory = {
        name: handler.name,
        kind: handler.kind,
        handler,
      };
      root.value = folder;
      folder.children = await analyseFolder(handler);
    },
    (err) => {
      // cancel
    }
  );
}

async function analyseFolder(handler: FileSystemDirectoryHandle) {
  const array: Array<FileOrDirectory> = [];
  const iterator = handler.entries();
  let h = await iterator.next();
  while (!h.done) {
    const fileOrDirectory: FileOrDirectory = {
      name: h.value[1].name,
      kind: h.value[1].kind,
      handler: h.value[1] as any,
    };
    if (fileOrDirectory.kind === "directory") {
      fileOrDirectory.children = await analyseFolder(
        h.value[1] as FileSystemDirectoryHandle
      );
    }
    array.push(fileOrDirectory);
    h = await iterator.next();
  }

  return array;
}
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  height: 100%;
  .sider {
    overflow-y: auto;
    width: 300px;
    height: 100%;
    padding: 0 20px;
    background-color: #252526;
    .btn-open {
      width: 260px;
      height: 28px;
      margin-top: 12px;
      background-color: #0078d4;
      color: #fff;
      font-size: 13px;
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.1s ease-in-out;
      &:hover {
        background-color: #026ec1;
      }
    }
  }
  .main {
    flex: 1;
  }
}
</style>
