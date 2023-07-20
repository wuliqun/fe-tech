import { type PropType, defineComponent, h, reactive, ref } from "vue";
import { MenuItem } from "../type";
import "./index.scss";

function renderMenuItem(
  item: MenuItem,
  path: number[],
  onClick: (item: MenuItem, path: number[]) => void
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
  menu: MenuItem[],
  path: number[],
  onClick: (item: MenuItem, path: number[]) => void,
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
    [menu.map((item, index) => renderMenuItem(item, [...path, index], onClick))]
  );
}

export default defineComponent({
  props: {
    menus: {
      type: Array as PropType<Array<MenuItem>>,
      required: true as const,
    },
  },
  emits: ["open", "fold", "active"],
  setup(props, { emit }) {
    const menus: MenuItem[] = reactive(JSON.parse(JSON.stringify(props.menus)));
    const active = ref<number[]>([]);

    function onClick(item: MenuItem, path: number[]) {
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
              let m: MenuItem = menus[active.value[0]];
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
