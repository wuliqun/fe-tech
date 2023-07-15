/**
 * 防抖 间隔时间内频繁触发 仅执行最后一次
 * @param {*} fn
 * @param {*} interval
 * @param {*} ensureFirst 确保首次立即执行
 */
function debounce(
  fn: (...args: any) => void,
  interval = 100,
  ensureFirst = false
) {
  let timer;
  const _fn = (...args) => {
    if (ensureFirst) {
      fn(...args);
      ensureFirst = false;
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, interval);
    }
  };

  return _fn;
}
