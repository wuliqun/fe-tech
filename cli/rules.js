const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { env } = require("./commander");

module.exports = [
  {
    test: /\.(j|t)s$/,
    loader: "babel-loader",
    exclude: /node_modules/,
    options: {
      presets: ["@babel/preset-env", "@babel/preset-typescript"],
    },
  },
  {
    test: /\.s?css$/, // 匹配文件
    use: [
      env === "production"
        ? {
            loader: MiniCssExtractPlugin.loader,
          }
        : "style-loader", // 使用<style>将css-loader内部样式注入到我们的HTML页面,
      "css-loader", // 加载.css文件将其转换为JS模块
      {
        loader: "postcss-loader",
        options: {
          config: {
            path: "./", // 写到目录即可，文件名强制要求是postcss.config.js
          },
        },
      },
      "sass-loader", // 加载 SASS / SCSS 文件并将其编译为 CSS
    ],
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/, // 资源处理
    use: ["file-loader"],
  },
  {
    test: /\.(png|svg|jpe?g|gif|webp)$/i, // 图片处理
    use: [
      {
        loader: "url-loader",
        options: {
          name: "[name].[hash:5].[ext]",
          limit: 10 * 1024, // size <= 20kb
          outputPath: "img",
        },
      },
    ],
  },
  {
    test: /\.vue$/,
    use: {
      loader: "vue-loader",
      options: {
        transformAssetUrls: {
          video: ["src", "poster"],
          source: "src",
          img: "src",
          image: ["xlink:href", "href"],
          use: ["xlink:href", "href"],
        },
      },
    },
  },
];
