const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { IS_DEV } = require("./commander");

module.exports = [
  {
    test: /\.s?css$/, // 匹配文件
    use: [
      IS_DEV
        ? "style-loader"
        : {
            loader: MiniCssExtractPlugin.loader,
          },
      "css-loader", // 加载.css文件将其转换为JS模块
      {
        loader: "postcss-loader",
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
    loader: "vue-loader",
  },
  {
    test: /\.(j|t)s$/,
    loader: "babel-loader",
    options: {
      presets: [
        "@babel/preset-env",
        ["@babel/preset-typescript", { allExtensions: true }],
      ],
      plugins: [
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-optional-chaining",
      ],
    },
  },
];
