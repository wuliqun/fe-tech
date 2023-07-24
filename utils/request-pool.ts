/**
 * 请求池
 * @param {Array<()=>Promise<any>>} fns 待处理请求
 * @param {number} maxCount 最大允许同时存在的请求
 */
async function requestPool(fns: Array<() => Promise<any>>, maxCount = 10) {
  const set = new Set<Promise<any>>();
  const promises: Promise<any>[] = [];
  let index = 0;
  while (index < fns.length) {
    while (set.size < maxCount && index < fns.length) {
      let fn = fns[index++]();
      set.add(fn);
      promises.push(fn);
      fn.finally(() => {
        set.delete(fn);
      });
    }
    await Promise.race(Array.from(set));
  }
  return Promise.all(promises);
}

export { requestPool };
