const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const { entryPath, IS_DEV, env, project } = require("./commander");

const plugins = [
  new HtmlWebpackPlugin({ template: `${entryPath}/index.html` }),
  new VueLoaderPlugin(),
  new DefinePlugin({
    ENV: env,
    PROJECT: project,
    // 消除vue warning
    __VUE_OPTIONS_API__: false, // 是否允许选项式API
    __VUE_PROD_DEVTOOLS__: false, // 是否允许生产环境调试
  }),
];

if (IS_DEV) {
} else {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: "style/[name].[contenthash:8].css",
    })
  );
}

module.exports = plugins;
