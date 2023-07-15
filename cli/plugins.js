const vue = require("@vitejs/plugin-vue");
const { createHtmlPlugin } = require("vite-plugin-html");

const plugins = [
  vue(), // 加载.vue文件
  createHtmlPlugin({
    minify: true,
  }),
];

module.exports = plugins;
