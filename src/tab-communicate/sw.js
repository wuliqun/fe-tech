/* sw.js Service Worker 逻辑 */

/**
 * 从某个页面获取到消息
 * 然后向每一个client发一遍
 * 再在具体的页面中监听消息
 */
self.addEventListener("message", (e) => {
  e.waitUntil(
    self.clients.matchAll().then(function (clients) {
      if (!clients || clients.length === 0) {
        return;
      }
      clients.forEach(function (client) {
        client.postMessage(e.data);
      });
    })
  );
});
