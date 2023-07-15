const path = require("path");
const webpack = require("webpack");

const { env, entryPath, outputPath } = require("./commander");
const rules = require("./rules");
const plugins = require("./plugins");
const alias = require("./alias");

const config = {
  mode: env,
  entry: path.join(entryPath, "index.ts"),
  output: {
    path: outputPath,
    filename: "js/[name].[chunkhash:8].js",
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias,
    extensions: [".ts", ".js", ".json", ".scss", ".css", ".vue"],
  },
  devtool:
    env === "production" ? undefined : "inline-nosources-cheap-source-map",
};

webpack(config, (err, stats) => {
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
