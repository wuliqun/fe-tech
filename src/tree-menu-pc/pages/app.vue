<template>
  <div class="app">
    <tree-menu :menus="menus"></tree-menu>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import TreeMenu from "../components/tree-menu";
import type { MenuItem } from "../type";

const menus: MenuItem[] = reactive([
  { name: "menu-1-1" },
  {
    name: "menu-1-2",
    children: [
      {
        name: "menu-1-2-1",
      },
      {
        name: "menu-1-2-2",
      },
      {
        name: "menu-1-2-3",
      },
    ],
  },
  {
    name: "menu-1-3",
    children: [
      {
        name: "menu-1-3-1",
        children: [
          {
            name: "menu-1-3-1-1",
          },
          {
            name: "menu-1-3-1-2",
          },
          {
            name: "menu-1-3-1-3",
          },
        ],
      },
      {
        name: "menu-1-3-2",
      },
      {
        name: "menu-1-3-3",
        children: [
          {
            name: "menu-1-3-3-1",
          },
          {
            name: "menu-1-3-3-2",
          },
          {
            name: "menu-1-3-3-3",
          },
          {
            name: "menu-1-3-3-4",
            children: [
              {
                name: "menu-1-3-3-4-1",
              },
              {
                name: "menu-1-3-3-4-2",
              },
            ],
          },
        ],
      },
      {
        name: "menu-1-3-4",
      },
    ],
  },
]);
</script>

<style lang="scss" scoped></style>
