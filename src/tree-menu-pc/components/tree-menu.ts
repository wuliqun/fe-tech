import {
  type PropType,
  defineComponent,
  h,
  reactive,
  ref,
  onBeforeUnmount,
  onMounted,
  nextTick,
} from "vue";

import Search from "./search.vue";
import { FileOrDirectory, Directory, File } from "../type";
import "./menu.scss";
import { throttle } from "UTILS/throttle";

function renderFileOrDirectory(
  folder: FileOrDirectory,
  onClick: (item: FileOrDirectory) => void,
  drag: {
    start: (item: FileOrDirectory) => void;
    end: () => void;
    over: (event: DragEvent) => void;
    drop: (event: DragEvent) => void;
  },
  statusItem: {
    active?: FileOrDirectory;
    draging?: FileOrDirectory;
    dragOver?: Directory;
  },
  isRoot = false
) {
  return h(
    "div",
    {
      class: {
        "folder-wrapper": folder.kind === "directory",
        "file-wrapper": folder.kind === "file",
        root: isRoot,
        open: folder.active,
        "drag-over": folder === statusItem.dragOver,
      },
      patharr: folder.pathArr,
      onDragover: isRoot ? drag.over : void 0,
      onDrop: isRoot ? drag.drop : void 0,
    },
    [
      h(
        "div",
        {
          class: [
            "name",
            `name-${folder.kind}`,
            {
              focus: folder.focus,
              open: folder.active,
              active:
                folder.active ||
                statusItem.active?.path.indexOf(folder.path) === 0,
            },
          ],
          draggable: !isRoot,
          title: folder.path,
          onClick: () => {
            onClick(folder);
          },
          onDragstart: () => {
            drag.start(folder);
          },
          onDragend: () => {
            drag.end();
          },
        },
        isRoot ? folder.name.toUpperCase() : folder.name
      ),
    ].concat(
      folder.active && folder.kind === "directory" && folder.children?.length
        ? folder.children.map((item) =>
            renderFileOrDirectory(item, onClick, drag, statusItem)
          )
        : []
    )
  );
}

export default defineComponent({
  props: {
    root: {
      type: Object as PropType<Directory>,
    },
  },
  emits: ["preview"],
  setup(props, { emit }) {
    const lastFocus = ref<FileOrDirectory>();
    const lastActiveFile = ref<File>();

    // #region 点击
    function onClick(item: FileOrDirectory) {
      setTimeout(() => {
        item.focus = true;
        if (item.kind === "directory") {
          item.active = !item.active;
        } else {
          item.active = true;
          if (lastActiveFile.value && lastActiveFile.value !== item) {
            lastActiveFile.value.active = false;
          }
          lastActiveFile.value = item;
          emit("preview", item);
        }
        lastFocus.value = item;
      }, 10);
    }
    function documentClick() {
      if (lastFocus.value) {
        lastFocus.value.focus = false;
        lastFocus.value = void 0;
      }
    }
    onMounted(() => {
      document.addEventListener("click", documentClick);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", documentClick);
    });
    // #endregion

    // #region 搜索
    function searched(item: FileOrDirectory) {
      setTimeout(() => {
        item.focus = true;
        item.active = true;
        lastFocus.value = item;
        if (props.root) {
          props.root.active = true;
          let node = props.root;
          for (const index of item.pathArr) {
            node.children![index].active = true;
            node = node.children![index] as any;
          }
        }
        if (item.kind === "file") {
          if (lastActiveFile.value && lastActiveFile.value !== item) {
            lastActiveFile.value.active = false;
            lastActiveFile.value.focus = false;
          }

          lastActiveFile.value = item;
          emit("preview", item);
        }
      }, 10);
    }
    // #endregion

    // #region 拖拽
    const dragItem = ref<FileOrDirectory>();
    const overItem = ref<Directory>();
    function onDragStart(item: FileOrDirectory) {
      dragItem.value = item;
    }

    function onDragOver(event: DragEvent) {
      // 需要调用才能触发 drop
      event.preventDefault();
      let target: any = event.target;
      while (target && !/folder-wrapper/.test(target.className)) {
        target = target.parentNode;
      }
      const pathArrStr = target?.getAttribute("patharr");
      const pathArr: number[] = pathArrStr
        ? pathArrStr.split(",").map((i) => Number(i))
        : [];
      let node = props.root!;
      for (const index of pathArr) {
        node = node.children![index] as Directory;
      }

      if (node === dragItem.value) {
        overItem.value = void 0;
      } else {
        node.active = true;
        overItem.value = node;
      }
    }
    function onDragDrop(event: DragEvent) {
      if (dragItem.value) {
        let target: any = event.target;
        while (target && !/folder-wrapper/.test(target.className)) {
          target = target.parentNode;
        }
        const pathArrStr = target?.getAttribute("patharr");
        const pathArr: number[] = pathArrStr
          ? pathArrStr.split(",").map((i) => Number(i))
          : [];
        let node = props.root!;
        for (const index of pathArr) {
          node = node.children![index] as Directory;
        }
        moveFileOrDirectory(dragItem.value, node);
      }
    }

    function onDragEnd() {
      dragItem.value = void 0;
      overItem.value = void 0;
    }
    // #endregion

    // #region 移动文件
    function moveFileOrDirectory(fod: FileOrDirectory, dest: Directory) {
      let node = props.root!;
      for (const index of fod.pathArr.slice(0, -1)) {
        node = node.children![index] as Directory;
      }
      node.children!.splice(fod.pathArr[fod.pathArr.length - 1], 1);
      dest.children = dest.children || [];
      dest.children.push(fod);
    }
    // #endregion

    return () =>
      props.root
        ? h(
            "div",
            {
              class: "m-tree-menu",
            },
            [
              h(Search, {
                root: props.root,
                onSearched: searched,
              }),
              renderFileOrDirectory(
                props.root,
                onClick,
                {
                  start: onDragStart,
                  end: onDragEnd,
                  over: onDragOver,
                  drop: onDragDrop,
                },
                {
                  active: lastActiveFile.value,
                  draging: dragItem.value,
                  dragOver: overItem.value,
                },
                true
              ),
            ]
          )
        : undefined;
  },
});
