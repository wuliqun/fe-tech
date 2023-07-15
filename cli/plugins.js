const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const { entryPath } = require("./commander");

module.exports = [
  new HtmlWebpackPlugin({ template: `${entryPath}/index.html` }),
  new VueLoaderPlugin(),
];
