const { join } = require("path");
const { createServer, build } = require("vite");

const { env, entryPath, outputPath, project } = require("./commander");
const postcssConfig = require("./postcss.config");
const plugins = require("./plugins");

const config = {
  mode: env,
  configFile: false,
  root: entryPath,
  publicDir: join(entryPath, `static`),
  plugins,
  base: "./",
  assetsInclude: ["**/*.svga"],
  css: {
    postcss: postcssConfig,
    // 防止 @charset 'UTF-8' 不在第一行报错
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@use "STYLES/variable/index.scss" as *;',
      },
    },
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".vue", ".mjs", ".cjs"],
  },
  define: {
    "process.env": {
      PROJECT: project,
      ENV: env, // development production
    },
  },
};

if (env === "development") {
  config.server = {
    host: "0.0.0.0",
    port: 9000,
    open: false,
  };
} else {
  config.build = {
    reportCompressedSize: false, // 计算文件大小，会影响打包速度
    cssCodeSplit: true, // css文件分多个
    assetsInlineLimit: 10 * 1024, // base64编码
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        warnings: true,
        drop_console: true, // 是否删除console
        drop_debugger: true, // 打包时删除 debugger
      },
      output: {
        // 去掉注释内容
        comments: false,
      },
    },
    outDir: outputPath,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        dir: outputPath,
        manualChunks(id) {
          if (/\/utils/.test(id)) {
            return "utils";
          } else if (/node_modules\/(vue-router|pinia|vue)/.test(id)) {
            return "vue";
          }
        },
        // 打包后文件名
        assetFileNames: (file) => {
          let extType = file.name.slice(file.name.indexOf(".") + 1);
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(file.name)) {
            extType = "assets";
          } else if (/\.(png|jpe?g|gif|svga?)(\?.*)?$/.test(file.name)) {
            extType = "assets";
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(file.name)) {
            extType = "assets";
          }
          return `${extType}/[name].[hash].[ext]`;
        },
        chunkFileNames: "js/[name].[hash].js",
        entryFileNames: "js/[name].[hash].js",
      },
    },
  };
}

(async () => {
  if (env === "development") {
    const server = await createServer(config);
    await server.listen();
    server.printUrls();
  } else {
    await build(config);
  }
})();
