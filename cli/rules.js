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
      {
        loader: "css-loader",
        options: {
          url: true,
          esModule: false,
        },
      },
      {
        loader: "postcss-loader",
      },
      {
        loader: "sass-loader",
      },
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
          limit: 10 * 1024, // size <= 10kb
          outputPath: "asset",
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
