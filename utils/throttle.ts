/**
 * 节流  时间段内 仅执行1次
 * @param {*} fn
 * @param {*} interval
 * @param {*} ensureLast 保障最后一次执行
 * @returns
 */
function throttle(
  fn: (...args: any) => void,
  interval = 100,
  ensureLast = false
) {
  let flag = false;
  let hasMore = false;
  let lastArgs: any;
  const _fn = (...args) => {
    if (flag) {
      if (ensureLast) {
        hasMore = true;
        lastArgs = args;
      }
      return;
    }
    flag = true;
    fn(...args);
    setTimeout(() => {
      flag = false;
      if (hasMore) {
        hasMore = false;
        _fn(...lastArgs);
      }
    }, interval);
  };

  return _fn;
}

export { throttle };
