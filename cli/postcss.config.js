const { env } = require("./commander");
const PostcssPxToViewport = require("postcss-px-to-viewport-8-plugin");
module.exports = {
  plugins: (env === "production"
    ? [
        // 自动添加前缀
        require("autoprefixer")({}),
        // 压缩优化
        require("cssnano")({
          preset: "default",
        }),
      ]
    : []
  ).concat([
    PostcssPxToViewport({
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 4, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: "vw", // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: [".ignore", ".hairlines"], // 使用大写PX可以避免转换，指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: true, // 允许在媒体查询中转换`px`
      exclude: [/(vant|-pc$)/], // pc项目以-pc结尾, 不进行转换
    }),
  ]),
};
