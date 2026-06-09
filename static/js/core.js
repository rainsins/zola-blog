// assets/js/core.js
(function () {
  const tasks = [];
  let isReady = document.readyState !== "loading";
  // 注册任务：如果DOM已就绪，立即执行；否则推入队列
  window.onDomReady = function (task) {
    if (typeof task === "function") {
      if (isReady) {
        try {
          task();
        } catch (e) {
          console.error("DomReady Task Error:", e);
        }
      } else {
        tasks.push(task);
      }
    }
  };
  document.addEventListener("DOMContentLoaded", function () {
    isReady = true;
    // 按注册顺序执行，错误隔离
    tasks.forEach(function (task) {
      try {
        task();
      } catch (e) {
        console.error("DomReady Task Error:", e);
      }
    });
    tasks.length = 0; // 清空队列
  });
})();
