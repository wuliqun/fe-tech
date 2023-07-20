import { type PropType, defineComponent, h, reactive, ref } from "vue";
import { FileOrDirectory, Directory } from "../type";
import "./index.scss";

function renderFileOrDirectory(
  item: FileOrDirectory,
  path: number[],
  onClick: (item: FileOrDirectory, path: number[]) => void
) {
  return h(
    "div",
    {
      class: `menu-item menu-item-${path.length - 1} ${
        item.active ? (item.children?.length ? "open" : "active") : ""
      }`,
    },
    [
      h(
        "div",
        {
          class: ["menu-item-txt"],
          onclick: () => {
            onClick(item, path);
          },
        },
        (item.children?.length ? (item.active ? "- " : "+ ") : "") + item.name
      ),
      item.children?.length
        ? renderMenu(item.children, path, onClick, item.active)
        : undefined,
    ]
  );
}

function renderMenu(
  menu: FileOrDirectory[],
  path: number[],
  onClick: (item: FileOrDirectory, path: number[]) => void,
  active?: boolean
) {
  return h(
    "div",
    {
      class: [
        `menu-list menu-list-${path.length}`,
        { open: path.length === 0 || active },
      ],
    },
    [
      menu.map((item, index) =>
        renderFileOrDirectory(item, [...path, index], onClick)
      ),
    ]
  );
}

export default defineComponent({
  props: {
    menus: {
      type: Object as PropType<Directory>,
    },
  },
  emits: ["open", "fold", "active"],
  setup(props, { emit }) {
    const active = ref<number[]>([]);

    function onClick(item: FileOrDirectory, path: number[]) {
      console.log(path);
      if (item.children?.length) {
        item.active = !item.active;
        if (item.active) {
          emit("open", item.name);
        } else {
          emit("fold", item.name);
        }
      } else {
        if (!item.active) {
          item.active = true;
          emit("active", item.name);
          if (active.value.length) {
            try {
              let m: FileOrDirectory = menus[active.value[0]];
              for (let i = 1; i < active.value.length; i++) {
                m = m.children![active.value[i]];
              }
              m.active = false;
            } catch (err) {
              console.error(err);
            }
          }
          active.value = path;
        }
      }
    }
    return () =>
      h(
        "div",
        {
          class: "m-tree-menu",
        },
        [h("div", { class: "search" }), renderMenu(menus, [], onClick)]
      );
  },
});
