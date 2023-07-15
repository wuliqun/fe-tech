/**
 * 缓存构建参数, 支持短链接构建
 *    .   指代上次的打包项目
 *    ..  指代上上次打包项目  失败往上
 *    ... 指代上上上次的打包项目  失败往上
 */

const fs = require("fs");

function cacheProject(program) {
  const cachePath = "node_modules/.lq";
  const cacheFile = cachePath + "/.project";
  let cachedProjects = [];
  if (fs.existsSync(cacheFile)) {
    try {
      cachedProjects = JSON.parse(String(fs.readFileSync(cacheFile)));
    } catch (_) {
      // pass
    }
  }
  let originProject = program.getOptionValue("project");
  if (/^\.{1,3}$/.test(originProject)) {
    const index = Math.min(originProject.length - 1, cachedProjects.length - 1);
    if (index >= 0) {
      // 使用缓存重写 program.project
      program.setOptionValue("project", cachedProjects[index]);
    }
    if (index > 0) {
      // 更改缓存顺序
      cachedProjects.unshift(cachedProjects.splice(index, 1)[0]);
    }
  } else {
    let index;
    if ((index = cachedProjects.indexOf(originProject)) !== -1) {
      cachedProjects.splice(index, 1);
    }
    cachedProjects.unshift(originProject);
    cachedProjects = cachedProjects.slice(0, 5);
  }
  // 写入缓存
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }
  fs.writeFileSync(cacheFile, JSON.stringify(cachedProjects), "utf-8");
}

module.exports = { cacheProject };
