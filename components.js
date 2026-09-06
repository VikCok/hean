/* ===== HEAN 站点公共组件 =====
 * 统一负责：顶栏（品牌 logo + HEAN + 主页/导航图标按钮 + 主题开关）、页脚（免责声明|关于本站 + 版权）、主题切换。
 * 全站页面只需放置两个占位符并引入本文件：
 *   <div id="site-header"></div>   —— 顶栏渲染位置
 *   <div id="site-footer"></div>   —— 页脚渲染位置
 *   <script src="components.js"></script>
 * 以后修改顶栏 / 页脚 / 主题相关样式与逻辑，只改这一个文件，全站生效。
 * 页面如需品牌右侧副标题（如 sky.html 的"禾安·光遇助手"），
 * 在引入本文件之前设置：<script>window.SITE_TAG="禾安·光遇助手";</script>
 */
(function () {
  "use strict";

  /* ===== 动态计算基础目录 =====
   * 全站统一使用绝对路径（以 / 开头），彻底避免 Cloudflare Workers SPA 回退
   * 导致的相对路径叠加问题（如 /core/core/core/.../home.html）。
   * getBasePath() 保留兼容，但所有链接已改为绝对路径，不再依赖 base 前缀。 */
  function getBasePath() {
    return "";
  }

  /* ===== 本地 file:// 环境相对路径前缀计算 =====
   * 通过当前页面引用 components.js 的 src 推断页面所在目录深度：
   *   根目录页面引用 "components.js"   → 前缀 ""
   *   core/ 目录页面引用 "../components.js" → 前缀 "../"
   * 线上 http/https 环境不调用本函数，直接使用绝对路径。 */
  function getRelativeBase() {
    var scripts = document.querySelectorAll("script[src]");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src");
      if (src && src.indexOf("components.js") !== -1) {
        var idx = src.lastIndexOf("components.js");
        return src.substring(0, idx);
      }
    }
    return "";
  }

  /* ===== 本地 file:// 环境路径转换 =====
   * 把页面中所有以 "/" 开头的绝对路径链接和图片转换为相对路径，
   * 使本地双击 HTML 文件也能正常跳转和显示图片（线上环境不执行此转换）。 */
  function convertLocalPaths() {
    if (location.protocol !== "file:") return;
    var base = getRelativeBase();
    document.querySelectorAll('a[href^="/"], img[src^="/"]').forEach(function (el) {
      var isLink = el.tagName === "A";
      var attr = isLink ? "href" : "src";
      var val = el.getAttribute(attr);
      if (val && val.charAt(0) === "/") {
        el.setAttribute(attr, base + val.substring(1));
      }
    });
  }

  /* ===== 公共样式：顶栏 / 图标按钮 / 主题开关 / 页脚 ===== */
  var COMMON_CSS = [
    "/* ===== 公共组件样式（components.js 注入） ===== */",
    ".topbar{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid var(--line)}",
    ".left{display:flex;align-items:center;gap:14px}",
    ".brand{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:700;letter-spacing:1px;text-decoration:none;color:var(--text)}",
    ".brand .brand-tag{font-size:18px;font-weight:700;letter-spacing:1px;color:var(--text)}",
    ".brand .brand-logo{width:28px;height:28px;object-fit:contain;flex:none}",
    ".home-btn,.nav-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:1px solid var(--btn-border);border-radius:999px;color:var(--muted);font-size:14px;text-decoration:none;transition:color .15s,border-color .15s}",
    ".home-btn:hover,.nav-btn:hover{color:var(--btn-hover);border-color:var(--btn-hover)}",
    ".home-btn svg,.nav-btn svg{width:16px;height:16px}",
    ".mode-btn{display:flex;align-items:center;justify-content:center;flex:none;width:34px;height:34px;border:1px solid var(--btn-border);border-radius:50%;background:var(--panel);cursor:pointer;transition:background .25s,border-color .25s}",
    ".mode-btn:hover{border-color:var(--btn-hover)}",
    ".mode-btn .icon{width:16px;height:16px}",
    ".mode-btn .icon-moon{display:none}",
    "body.dark .mode-btn .icon-sun{display:none}",
    "body.dark .mode-btn .icon-moon{display:block}",
    ".mode-btn:focus-visible{outline:2px solid var(--btn-hover);outline-offset:2px}",
    "footer{padding:18px 20px;text-align:center;font-size:13px;color:var(--sub);border-top:1px solid var(--line)}",
    "footer p+p{margin-top:6px}",
    "footer a{color:var(--muted);text-decoration:none;margin:0 4px;transition:color .15s}",
    "footer a:hover{color:var(--btn-hover)}",
    "footer .sep{color:var(--line);margin:0 2px}",
    ".back-top{position:fixed;right:24px;bottom:32px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:1px solid var(--btn-border);border-radius:50%;background:var(--panel);color:var(--muted);cursor:pointer;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .25s,visibility .25s,transform .25s,color .15s,border-color .15s;z-index:999}",
    ".back-top.show{opacity:1;visibility:visible;transform:translateY(0)}",
    ".back-top:hover{color:var(--btn-hover);border-color:var(--btn-hover)}",
    ".back-top svg{width:18px;height:18px}"
  ].join("\n");

  /* ===== 顶栏 HTML：品牌 logo + HEAN + 主页/导航页图标按钮 + 主题开关 ===== */
  function headerHtml() {
    var tag = window.SITE_TAG || "";
    return [
      '<header class="topbar">',
      '  <div class="left">',
      '    <a class="brand" href="/index.html"><img class="brand-logo" src="/assets/logo1.png" alt="HEAN">HEAN' + (tag ? '<span class="brand-tag">' + tag + "</span>" : "") + "</a>",
      '    <a class="home-btn" href="/core/home.html" title="主页">',
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">',
      '        <path d="M3 11l9-8 9 8"/>',
      '        <path d="M5 10v10h14V10"/>',
      "      </svg>",
      "    </a>",
      '    <a class="nav-btn" href="/core/nav.html" title="导航页">',
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '        <circle cx="12" cy="12" r="10"/>',
      '        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
      "      </svg>",
      "    </a>",
      "  </div>",
      '  <button class="mode-btn" id="mode-btn" type="button" aria-label="切换日间/夜间模式">',
      '    <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">',
      '      <circle cx="12" cy="12" r="4.2"/>',
      '      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4L19 19M19 5l-1.6 1.6M6.6 17.4L5 19"/>',
      "    </svg>",
      '    <svg class="icon icon-moon" viewBox="0 0 24 24" fill="#8b7cff" aria-hidden="true">',
      '      <path d="M21 12.8A9 9 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8z"/>',
      "    </svg>",
      "  </button>",
      "</header>"
    ].join("\n");
  }

  /* ===== 页脚 HTML：免责声明 / 关于本站 + 版权 ===== */
  function footerHtml() {
    return [
      "<footer>",
      '  <p><a href="/disclaimer.html">免责声明</a><span class="sep">|</span><a href="/about.html">关于本站</a></p>',
      "  <p>Copyright © 2026 hean.me All Rights Reserved</p>",
      "</footer>"
    ].join("\n");
  }

  function injectCss() {
    var style = document.createElement("style");
    style.textContent = COMMON_CSS;
    document.head.appendChild(style);
  }

  function mount() {
    injectCss();
    var h = document.getElementById("site-header");
    var f = document.getElementById("site-footer");
    if (h) h.outerHTML = headerHtml();
    if (f) f.outerHTML = footerHtml();
    initTheme();
    initBackTop();
    convertLocalPaths();
  }

  /* ===== 主题切换：localStorage 存储 key=hean-theme ===== */
  function initTheme() {
    var btn = document.getElementById("mode-btn");
    if (!btn) return;
    var KEY = "hean-theme";
    try {
      if (localStorage.getItem(KEY) === "dark") {
        document.body.classList.add("dark");
        btn.setAttribute("aria-checked", "true");
      }
    } catch (e) {}
    btn.addEventListener("click", function () {
      var dark = document.body.classList.toggle("dark");
      btn.setAttribute("aria-checked", dark ? "true" : "false");
      try {
        localStorage.setItem(KEY, dark ? "dark" : "light");
      } catch (e) {}
    });
  }

  /* ===== 回到顶部按钮：滚动进度超过 70% 显示 ===== */
  function initBackTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-top";
    btn.setAttribute("aria-label", "回到顶部");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);
    function onScroll() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      btn.classList.toggle("show", p > 0.7);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
