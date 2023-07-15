/**
 * 显示当前缓存的构建参数
 */
const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
const colors = require("colors");
const inquirer = require("inquirer");

const cacheFile = "node_modules/.lq/.project";

const ISBUILD = process.argv.indexOf("--build") !== -1;
/**
 * 获取最近更改的项目
 *    逻辑: 存在未提交git修改
 */
function getRecentEditProject() {
  const projects = new Set();
  const output = shelljs.exec("git status", { silent: true });
  const lines = output
    .split("\n")
    .map((line) => line.replace(/\t|\n|^\s+|\s+$/g, ""));
  lines.forEach((line) => {
    if (/^(modified:|src\/)/.test(line)) {
      line = line.replace(/^modified:\s*/, "");
      if (/^src\//.test(line)) {
        const project = line.split("/")[1];
        if (project) {
          projects.add(project);
        }
      }
    }
  });
  return Array.from(projects);
}

function getAllProjects() {
  return fs.readdirSync(path.resolve(__dirname, `../src`));
}

function main() {
  const EXIT = "exit";
  let projects = getRecentEditProject();
  if (fs.existsSync(cacheFile)) {
    projects = projects.concat(JSON.parse(shelljs.cat(cacheFile)));
    projects = Array.from(new Set(projects));
  }
  projects = Array.from(new Set(projects.concat(getAllProjects())));
  if (projects.length) {
    inquirer
      .prompt([
        {
          type: "list",
          message:
            colors.green(`选择${ISBUILD ? "构建" : ""}项目, `) +
            colors.grey(`${EXIT}退出`),
          default: projects[0],
          choices: [...projects, EXIT],
          name: "project",
        },
      ])
      .then((answer) => {
        if (answer.project !== EXIT) {
          shelljs.exec(`pnpm ${ISBUILD ? "build" : "dev"} ${answer.project}`);
        }
      });
  } else {
    console.log(colors.yellow("no project yet!"));
  }
}

main();
