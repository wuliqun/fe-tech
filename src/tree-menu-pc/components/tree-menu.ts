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

function renderFileOrDirectory(
  folder: FileOrDirectory,
  onClick: (item: FileOrDirectory) => void,
  activeFile?: File,
  isRoot = false
) {
  return h(
    "div",
    {
      class: [`folder-wrapper`, { root: isRoot, open: folder.active }],
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
                folder.active || activeFile?.path.indexOf(folder.path) === 0,
            },
          ],
          title: folder.path,
          onClick: () => {
            onClick(folder);
          },
        },
        isRoot ? folder.name.toUpperCase() : folder.name
      ),
    ].concat(
      folder.active && folder.kind === "directory" && folder.children?.length
        ? folder.children.map((item) => renderFileOrDirectory(item, onClick))
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
                onSearched: onClick,
              }),
              renderFileOrDirectory(
                props.root,
                onClick,
                lastActiveFile.value,
                true
              ),
            ]
          )
        : undefined;
  },
});
