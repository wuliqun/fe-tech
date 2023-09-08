const path = require("path");
const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

const { entryPath, IS_DEV, env, project } = require("./commander");

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({ template: `${entryPath}/index.html` }),
  new VueLoaderPlugin(),
  new DefinePlugin({
    ENV: env,
    PROJECT: project,
    // 消除vue warning
    __VUE_OPTIONS_API__: false, // 是否允许选项式API
    __VUE_PROD_DEVTOOLS__: false, // 是否允许生产环境调试
  }),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
];

if (IS_DEV) {
  // plugins.push(
  //   new CopyWebpackPlugin({
  //     patterns: [{ from: path.join(entryPath, "sw.js"), to: "sw.js" }],
  //   })
  // );
} else {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: "style/[name].[contenthash:8].css",
    })
  );

  plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(entryPath, "public"), to: "public" },
        { from: path.join(entryPath, "sw.js"), to: "sw.js" },
      ],
    })
  );
}

module.exports = plugins;
