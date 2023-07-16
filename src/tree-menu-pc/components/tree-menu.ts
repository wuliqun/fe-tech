import { type PropType, defineComponent, h } from "vue";
import { MenuItem } from "../type";
import "./index.scss";

function renderMenuItem(item: MenuItem, deep: number = 0) {
  return h(
    "div",
    {
      class: `menu-item menu-item-${deep}`,
    },
    [
      h("div", { class: "menu-item-txt" }, item.name),
      item.children?.length ? renderMenu(item.children, deep + 1) : undefined,
    ]
  );
}

function renderMenu(menu: MenuItem[], deep: number = 0) {
  return h("div", { class: `menu-list menu-list-${deep}` }, [
    menu.map((item) => renderMenuItem(item, deep)),
  ]);
}

export default defineComponent({
  props: {
    menus: {
      type: Array as PropType<Array<MenuItem>>,
      required: true as const,
    },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          class: "m-tree-menu",
        },
        [h("div", { class: "search" }), renderMenu(props.menus)]
      );
  },
});
