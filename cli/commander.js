const fs = require("fs");
const path = require("path");
const program = require("commander");
const colors = require("colors");

const { cacheProject } = require("./cache-project");

program
  .version("1.0.0")
  .option("-p, --project <string>", "Add build project")
  .option("-e, --env <string>", "Add development mode")
  .option("-v, --view <string>", "Is preview or not")
  .parse(process.argv);

cacheProject(program);

const env = program.getOptionValue("env");
const IS_PREVIEW = program.getOptionValue("view") === "preview";
const project = program.getOptionValue("project");

// 参数检测
function checkBuildParams(project) {
  if (!project) {
    console.log(colors.red("请先指定打包项目, 示例: pnpm dev lazy-load \n"));
    process.exit(1);
  }

  const entryPath = path.resolve(__dirname, `../src/${project}`);

  if (!fs.existsSync(entryPath)) {
    console.log(colors.red(`项目: ${project} 不存在, 请重试 \n`));
    process.exit(1);
  }

  return {
    entryPath,
    outputPath: path.resolve(__dirname, `../dist/${project}`),
  };
}

const { entryPath, outputPath } = checkBuildParams(project);

module.exports = {
  project,
  entryPath,
  outputPath,
  env,
  IS_PREVIEW,
  IS_DEV: env !== "production",
};
