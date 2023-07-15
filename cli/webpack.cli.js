const path = require("path");
const webpack = require("webpack");

const { IS_DEV, env, entryPath, outputPath } = require("./commander");
const rules = require("./rules");
const plugins = require("./plugins");
const alias = require("./alias");

const config = {
  mode: env,
  entry: path.join(entryPath, "index.ts"),
  output: {
    path: outputPath,
    filename: "js/[name].[contenthash:8].js",
    clean: true,
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias,
    extensions: [".ts", ".js", ".json", ".scss", ".css", ".vue"],
  },
  optimization: {
    // TODO:
    splitChunks: {
      chunks: /utils/,
    },
  },
  devtool: IS_DEV ? "inline-nosources-cheap-source-map" : undefined,
  devServer: IS_DEV
    ? {
        open: false,
        host: "0.0.0.0",
        port: 9000,
      }
    : undefined,
};

const compiler = webpack(config);
if (IS_DEV) {
  const webpackDevServer = require("webpack-dev-server");
  const server = new webpackDevServer(config.devServer, compiler);

  console.log("Starting server...");
  server.start();
} else {
  compiler.run((err, stats) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log(
      stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true, // Shows colors in the console
      })
    );
  });
}
