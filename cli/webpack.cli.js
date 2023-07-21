const path = require("path");
const colors = require("colors");
const webpack = require("webpack");

const {
  IS_DEV,
  IS_PREVIEW,
  env,
  entryPath,
  outputPath,
} = require("./commander");
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
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // 剩余node_modules打包
        vendor: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial",
        },
        // 被引用3次以上的公共模块分离
        commons: {
          name: "commons",
          minChunks: 3, // minimum common number
          priority: 5,
          reuseExistingChunk: true,
        },
        // 大于160000 单独打包
        lib: {
          test(module) {
            return (
              module.size() > 160000 &&
              /node_modules[/\\]/.test(module.nameForCondition() || "")
            );
          },
          name(module) {
            const packageNameArr = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)((.*?)([\\/]|$))?/
            );
            let packageName = packageNameArr ? packageNameArr[1] : "";
            if (packageName === ".pnpm") {
              packageName = packageNameArr[4] || "";
            }
            // 替换掉 @ + 等字符
            return packageName.replace(/@/g, "").replace(/\+/g, "_");
          },
          priority: 15,
          minChunks: 1,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devtool: IS_DEV ? "inline-nosources-cheap-source-map" : undefined,
  devServer: IS_DEV
    ? {
        open: false,
        host: "0.0.0.0",
        port: 8000,
        static: {
          directory: path.join(entryPath, "public"),
          publicPath: "/public",
        },
      }
    : undefined,
};

function preview() {
  const { createServer } = require("http-server");

  const server = createServer({
    root: outputPath,
  });
  server.listen(8000, "0.0.0.0", () => {
    console.log(
      colors.yellow("Starting up preview server, serving "),
      colors.brightCyan(server.root)
    );

    console.log(
      colors.green(`At:`),
      colors.brightCyan(`http://localhost:8000/`)
    );
  });
}

try {
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
      if (IS_PREVIEW) {
        preview();
      }
    });
  }
} catch (err) {
  console.log(err.message);
}
