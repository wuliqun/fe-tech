<template>
  <div class="app">
    <div class="sider">
      <button v-if="!root" class="btn-open" @click="selectFolder()">
        Open Folder
      </button>
      <tree-menu :root="root" @preview="preview" />
    </div>
    <div class="main">
      <div v-if="previewFile" class="preview">
        <div class="title-wrapper">
          <div class="title">
            {{ previewFile.name }}
            <button class="close" @click="previewFile = void 0"></button>
          </div>
        </div>
        <div
          class="content"
          :class="isImage ? 'content-image' : 'content-text'"
        >
          <img v-if="isImage" :src="text" alt="" />
          <template v-else>
            <div class="place-holder"></div>
            <div class="text">{{ text }}</div>
            <div class="place-holder"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import TreeMenu from "../components/tree-menu";
import type { FileOrDirectory, Directory, File } from "../type";

// #region 文件夹选择
const root = ref<Directory>();
function selectFolder() {
  window.showDirectoryPicker().then(
    async (handler) => {
      const folder: Directory = {
        name: handler.name,
        kind: handler.kind,
        path: handler.name,
        pathArr: [],
        handler,
      };
      root.value = folder;
      root.value.children = await analyseFolder(folder);
    },
    (err) => {
      // cancel
    }
  );
}

async function analyseFolder(folder: Directory) {
  const array: Array<FileOrDirectory> = [];
  const iterator = folder.handler.entries();
  let h: Awaited<ReturnType<typeof iterator.next>>;
  let count = -1;
  while (!(h = await iterator.next()).done) {
    if (h.value[1].name === ".git" || h.value[1].name === ".vscode") continue;
    count++;
    const p = folder.path + "/" + h.value[1].name;
    const fileOrDirectory: FileOrDirectory = {
      name: h.value[1].name,
      kind: h.value[1].kind,
      path: p,
      pathArr: folder.pathArr.concat(count),
      handler: h.value[1] as any,
    };
    array.push(fileOrDirectory);
    if (fileOrDirectory.kind === "directory") {
      analyseFolder(fileOrDirectory).then((children) => {
        fileOrDirectory.children = children;
      });
    }
  }

  return array;
}
// #endregion

// #region 预览
const previewFile = ref<File>();
const text = ref("");
function preview(file: File) {
  previewFile.value = file;
  file.handler
    .getFile()
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      text.value = res;
    });
}

const isImage = computed(() => {
  return /\.(png|jpe?g|gif|webp)$/.test(previewFile.value?.name || "");
});
// #endregion
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  height: 100%;
}

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
  height: 100%;
  background-color: #1e1e1e;
  .preview {
    .title-wrapper {
      display: flex;
      height: 36px;
      background-color: #252526;
    }
    .title {
      position: relative;
      line-height: 36px;
      font-size: 12px;
      color: #e2a452;
      padding: 0 30px 0 15px;
      background-color: #1e1e1e;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 16px;
      height: 16px;
      opacity: 0.5;
      background: url(../img/close.png) no-repeat center/100%;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
    .content {
      overflow-y: auto;
      height: calc(100vh - 36px);
      &.content-image {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          max-width: 50%;
          max-height: 50%;
        }
      }
      &.content-text {
        padding: 0 20px;
      }
      .place-holder {
        height: 12px;
      }
      .text {
        color: #eee;
        font-size: 15px;
        line-height: 18px;
        white-space: pre-wrap;
      }
    }
  }
}
</style>
