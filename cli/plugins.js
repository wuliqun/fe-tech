const HtmlWebpackPlugin = require("html-webpack-plugin");

const { entryPath } = require("./commander");

module.exports = [
  new HtmlWebpackPlugin({ template: `${entryPath}/index.html` }),
];
