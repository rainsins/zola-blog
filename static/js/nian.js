/**
 * 年年页面交互
 * 依赖：tippy.js（含 @popperjs/core）、animate.css
 * 无 jQuery、无 Qmsg
 */

// ── 原生 Toast ──────────────────────────────────────────────
const toastQueue = { el: null, timer: null };

function showToast(msg) {
  if (toastQueue.el) {
    clearTimeout(toastQueue.timer);
    toastQueue.el.remove();
  }
  const el = document.createElement("div");
  el.className = "nn-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  // 触发过渡
  requestAnimationFrame(() => el.classList.add("nn-toast--show"));
  toastQueue.el = el;
  toastQueue.timer = setTimeout(() => {
    el.classList.remove("nn-toast--show");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    toastQueue.el = null;
  }, 2200);
}

// Toast 样式（注入一次）
const toastStyle = document.createElement("style");
toastStyle.textContent = `
.nn-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(1rem);
  padding: 0.5em 1.2em;
  border-radius: 2em;
  background: linear-gradient(to top, #a18cd1, #fbc2eb);
  color: #fff;
  font-size: 0.95rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 9999;
  white-space: nowrap;
}
.nn-toast--show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
`;
document.head.appendChild(toastStyle);

// ── 点击计数与文案 ───────────────────────────────────────────
const successMessages = [
  "文质彬彬👩‍🏫",
  "风流倜傥👨‍🍳",
  "英俊潇洒👴",
  "才华横溢🧑‍🎓",
  "才貌双全🦸",
  "谦谦君子🤵",
  "儒雅随和🗣",
  "少之时,血气未定,戒之在色；及其壮也,血气方刚,戒之在斗；及其老也,血气既衰,戒之在得. ☯️",
  "屡戒不悛🛐",
  "阿弥陀佛🙏",
];
let clickCount = 0;

// ── Tippy 工厂 ───────────────────────────────────────────────
function createTooltip(el) {
  if (!el) return null;
  return tippy(el, {
    content: "点击复制进剪贴板。",
    theme: "mmmm",
    arrow: true,
    onMount(instance) {
      const box = instance.popper.firstElementChild;
      requestAnimationFrame(() => {
        box.classList.add("animate__animated", "animate__rubberBand");
      });
    },
    onHidden(instance) {
      instance.popper.firstElementChild.classList.remove(
        "animate__animated",
        "animate__rubberBand",
      );
    },
  });
}

// ── 复制逻辑 ─────────────────────────────────────────────────
function setupCopyElement(el, tip) {
  if (!el || !tip) return;
  el.addEventListener("click", () => {
    const text = el.dataset.clipboardText;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const msg = successMessages[clickCount % successMessages.length];
        showToast(msg);
        tip.setContent("恭喜，复制成功！点击再次复制。");
        clickCount++;
      })
      .catch(() => {
        showToast("哎呀，没对准！🤡");
        tip.setContent("哎，复制失败了！重新点一下试试。");
      });
  });
}

// ── 初始化 ───────────────────────────────────────────────────
const ids = ["nmnm-mima", "out_mima", "tiquma", "tiquma-1"];
ids.forEach((id) => {
  const el = document.getElementById(id);
  const tip = createTooltip(el);
  setupCopyElement(el, tip);
});
