/* ===== HEAN 站点公共组件 =====
 * 统一负责：顶栏（品牌 + 主页/导航图标按钮 + 主题切换 + 菜单按钮）、侧边抽屉菜单（主题切换 + 快捷导航）、页脚、回到顶部。
 * 全站页面只需放置两个占位符并引入本文件：
 *   <div id="site-header"></div>   —— 顶栏渲染位置
 *   <div id="site-footer"></div>   —— 页脚渲染位置
 *   <script src="/components.js"></script>
 * 以后修改顶栏 / 菜单 / 页脚 / 主题相关样式与逻辑，只改这一个文件，全站生效。
 * 页面如需品牌右侧副标题（如 sky.html 的"禾安·光遇助手"），
 * 在引入本文件之前设置：<script>window.SITE_TAG="禾安·光遇助手";</script>
 * 页面如需自定义品牌名（如 index 的 HEAN.ME、sky 的 禾安），
 * 在引入本文件之前设置：<script>window.SITE_BRAND="HEAN.ME";</script>
 */
(function () {
  "use strict";

  function getBasePath() { return ""; }

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

  function convertLocalPaths() {
    if (location.protocol !== "file:") return;
    var base = getRelativeBase();
    document.querySelectorAll('a[href^="/"], link[href^="/"], img[src^="/"], script[src^="/"]').forEach(function (el) {
      var isHref = (el.tagName === "A" || el.tagName === "LINK");
      var attr = isHref ? "href" : "src";
      var val = el.getAttribute(attr);
      if (val && val.charAt(0) === "/") {
        el.setAttribute(attr, base + val.substring(1));
      }
    });
  }

  /* ===== 公共样式：顶栏 / 图标按钮（蓝色填充白图标）/ 主题切换 / 菜单 / 侧边菜单 / 页脚 / 回到顶部 ===== */
  var COMMON_CSS = [
    "/* ===== 顶栏 ===== */",
    ".topbar{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid var(--line)}",
    ".left{display:flex;align-items:center;gap:14px}",
    /* 顶栏右侧容器：主题切换按钮 + 菜单按钮 并排 */
    ".right{display:flex;align-items:center;gap:10px}",
    ".brand{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:700;letter-spacing:1px;text-decoration:none;color:var(--text)}",
    ".brand .brand-tag{font-size:18px;font-weight:700;letter-spacing:1px;color:var(--text)}",
    ".brand .brand-logo{width:28px;height:28px;object-fit:contain;flex:none}",
    /* 主页 / 导航页 胶囊按钮：蓝色填充背景 + 白色图标 */
    ".home-btn,.nav-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:1px solid #2563eb;border-radius:999px;background:#2563eb;color:#ffffff;font-size:14px;text-decoration:none;transition:background .15s,border-color .15s}",
    ".home-btn:hover,.nav-btn:hover{background:#1d4ed8;border-color:#1d4ed8;color:#ffffff}",
    ".home-btn svg,.nav-btn svg{width:16px;height:16px}",
    /* ===== 主题切换按钮（顶栏右上角，菜单按钮左边，蓝色填充白图标） ===== */
    ".theme-toggle-btn{display:flex;align-items:center;justify-content:center;flex:none;width:34px;height:34px;border:1px solid #2563eb;border-radius:50%;background:#2563eb;color:#ffffff;cursor:pointer;transition:background .25s,border-color .25s}",
    ".theme-toggle-btn:hover{background:#1d4ed8;border-color:#1d4ed8}",
    ".theme-toggle-btn svg{width:18px;height:18px}",
    ".theme-toggle-btn .theme-icon-sun{display:block}",
    ".theme-toggle-btn .theme-icon-moon{display:none}",
    "html.dark .theme-toggle-btn .theme-icon-sun{display:none}",
    "html.dark .theme-toggle-btn .theme-icon-moon{display:block}",
    /* ===== 菜单按钮（顶栏右上角，蓝色填充白图标） ===== */
    ".menu-btn{display:flex;align-items:center;justify-content:center;flex:none;width:34px;height:34px;border:1px solid #2563eb;border-radius:50%;background:#2563eb;color:#ffffff;cursor:pointer;transition:background .25s,border-color .25s}",
    ".menu-btn:hover{background:#1d4ed8;border-color:#1d4ed8}",
    ".menu-btn svg{width:18px;height:18px}",
    /* ===== 菜单遮罩（点击关闭菜单） ===== */
    ".menu-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s;z-index:1000}",
    ".menu-overlay.show{opacity:1;visibility:visible}",
    /* ===== 侧边抽屉菜单（从右侧滑出） ===== */
    ".side-menu{position:fixed;top:0;right:0;width:300px;max-width:85vw;height:100vh;background:var(--panel);border-left:1px solid var(--line);transform:translateX(100%);transition:transform .3s ease;z-index:1001;display:flex;flex-direction:column;overflow-y:auto}",
    ".side-menu.show{transform:translateX(0)}",
    ".menu-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--line)}",
    ".menu-header span{font-size:16px;font-weight:700;color:var(--text)}",
    ".menu-close{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;color:var(--muted);font-size:22px;cursor:pointer;border-radius:50%;line-height:1}",
    ".menu-close:hover{color:var(--btn-hover);background:var(--bg)}",
    ".menu-section{padding:12px 0}",
    ".menu-section-title{padding:8px 20px;font-size:12px;color:var(--sub);text-transform:uppercase;letter-spacing:1px}",
    /* 主题切换按钮（菜单内，太阳/月亮图标 + 文字） */
    ".menu-theme-btn{display:flex;align-items:center;gap:12px;width:100%;padding:12px 20px;border:none;background:transparent;color:var(--text);font-size:15px;cursor:pointer;text-align:left;transition:background .15s}",
    ".menu-theme-btn:hover{background:var(--bg)}",
    ".menu-theme-btn .theme-icon{width:20px;height:20px;flex:none}",
    ".menu-theme-btn .theme-icon-sun{display:block}",
    ".menu-theme-btn .theme-icon-moon{display:none}",
    "html.dark .menu-theme-btn .theme-icon-sun{display:none}",
    "html.dark .menu-theme-btn .theme-icon-moon{display:block}",
    /* 菜单导航链接 */
    ".menu-link{display:block;padding:12px 20px;color:var(--muted);font-size:15px;text-decoration:none;transition:color .15s,background .15s}",
    ".menu-link:hover{color:var(--btn-hover);background:var(--bg)}",
    /* ===== 页脚 ===== */
    "footer{padding:18px 20px;text-align:center;font-size:13px;color:var(--sub);border-top:1px solid var(--line)}",
    "footer p+p{margin-top:6px}",
    "footer a{color:var(--muted);text-decoration:none;margin:0 4px;transition:color .15s}",
    "footer a:hover{color:var(--btn-hover)}",
    "footer .sep{color:var(--line);margin:0 2px}",
    /* ===== 回到顶部按钮 ===== */
    ".back-top{position:fixed;right:24px;bottom:32px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:1px solid var(--btn-border);border-radius:50%;background:var(--panel);color:var(--muted);cursor:pointer;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .25s,visibility .25s,transform .25s,color .15s,border-color .15s;z-index:999}",
    ".back-top.show{opacity:1;visibility:visible;transform:translateY(0)}",
    ".back-top:hover{color:var(--btn-hover);border-color:var(--btn-hover)}",
    ".back-top svg{width:18px;height:18px}"
  ].join("\n");

  /* ===== 顶栏 HTML：品牌 + 主页/导航图标按钮 + 主题切换 + 菜单按钮 ===== */
  function headerHtml() {
    var brand = window.SITE_BRAND || "HEAN";
    var tag = window.SITE_TAG || "";
    return [
      '<header class="topbar">',
      '  <div class="left">',
      '    <a class="brand" href="/index.html"><img class="brand-logo" src="/assets/logo1.png" alt="' + brand + '">' + brand + (tag ? '<span class="brand-tag">' + tag + "</span>" : "") + "</a>",
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
      /* 右侧：主题切换按钮（左） + 菜单按钮（右） */
      '  <div class="right">',
      '    <button class="theme-toggle-btn" id="theme-toggle-btn" type="button" aria-label="切换日间/夜间模式">',
      '      <svg class="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">',
      '        <circle cx="12" cy="12" r="4.2"/>',
      '        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4L19 19M19 5l-1.6 1.6M6.6 17.4L5 19"/>',
      "      </svg>",
      '      <svg class="theme-icon-moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">',
      '        <path d="M21 12.8A9 9 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8z"/>',
      "      </svg>",
      "    </button>",
      '    <button class="menu-btn" id="menu-btn" type="button" aria-label="打开菜单">',
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">',
      '        <line x1="4" y1="7" x2="20" y2="7"/>',
      '        <line x1="4" y1="12" x2="20" y2="12"/>',
      '        <line x1="4" y1="17" x2="20" y2="17"/>',
      "      </svg>",
      "    </button>",
      "  </div>",
      "</header>",
      /* 菜单遮罩（半透明黑色背景，点击关闭） */
      '<div class="menu-overlay" id="menu-overlay"></div>',
      /* 侧边抽屉菜单 */
      '<aside class="side-menu" id="side-menu" aria-label="站点菜单">',
      '  <div class="menu-header">',
      '    <span>菜单</span>',
      '    <button class="menu-close" id="menu-close" type="button" aria-label="关闭菜单">&times;</button>',
      "  </div>",
      /* 外观分区：主题切换 */
      '  <div class="menu-section">',
      '    <div class="menu-section-title">外观</div>',
      '    <button class="menu-theme-btn" id="menu-theme-btn" type="button">',
      '      <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">',
      '        <circle cx="12" cy="12" r="4.2"/>',
      '        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4L19 19M19 5l-1.6 1.6M6.6 17.4L5 19"/>',
      "      </svg>",
      '      <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="#8b7cff" aria-hidden="true">',
      '        <path d="M21 12.8A9 9 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8z"/>',
      "      </svg>",
      '      <span id="theme-label">切换深色模式</span>',
      "    </button>",
      "  </div>",
      /* 快捷导航分区 */
      '  <div class="menu-section">',
      '    <div class="menu-section-title">快捷导航</div>',
      '    <a class="menu-link" href="/index.html">首页</a>',
      '    <a class="menu-link" href="/core/home.html">主页</a>',
      '    <a class="menu-link" href="/core/nav.html">导航页</a>',
      '    <a class="menu-link" href="/sky.html">光遇</a>',
      '    <a class="menu-link" href="/core/cs2.html">CS2</a>',
      '    <a class="menu-link" href="/core/news.html">新闻</a>',
      '    <a class="menu-link" href="/about.html">关于本站</a>',
      '    <a class="menu-link" href="/disclaimer.html">免责声明</a>',
      "  </div>",
      "</aside>"
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

  /* 注入公共样式到 <head> 末尾 */
  function injectCss() {
    var style = document.createElement("style");
    style.textContent = COMMON_CSS;
    document.head.appendChild(style);
  }

  /* 渲染顶栏与页脚（替换占位 div），随后初始化主题、菜单、回到顶部按钮与本地路径转换 */
  function mount() {
    injectCss();
    var h = document.getElementById("site-header");
    var f = document.getElementById("site-footer");
    if (h) h.outerHTML = headerHtml();
    if (f) f.outerHTML = footerHtml();
    initTheme();
    initMenu();
    initBackTop();
    convertLocalPaths();
  }

  /* ===== 主题切换：同时绑定顶栏主题按钮和菜单内主题按钮 =====
   * localStorage key=hean-theme，操作 documentElement（html 元素）。
   * 默认黑色模式（防闪白脚本已提前设置），点击切换白色并记忆。 */
  function initTheme() {
    var topBtn = document.getElementById("theme-toggle-btn");
    var menuBtn = document.getElementById("menu-theme-btn");
    var label = document.getElementById("theme-label");
    var KEY = "hean-theme";

    /* 同步当前主题状态到菜单内按钮文字 */
    function updateLabel() {
      if (label) {
        label.textContent = document.documentElement.classList.contains("dark") ? "切换浅色模式" : "切换深色模式";
      }
    }
    updateLabel();

    /* 切换主题的核心逻辑：toggle dark 类 + 写入 localStorage + 更新文字 */
    function toggleTheme() {
      var dark = document.documentElement.classList.toggle("dark");
      try {
        localStorage.setItem(KEY, dark ? "dark" : "light");
      } catch (e) {}
      updateLabel();
    }

    /* 顶栏主题切换按钮 */
    if (topBtn) topBtn.addEventListener("click", toggleTheme);
    /* 菜单内主题切换按钮 */
    if (menuBtn) menuBtn.addEventListener("click", toggleTheme);
  }

  /* ===== 侧边抽屉菜单：打开/关闭逻辑 ===== */
  function initMenu() {
    var menuBtn = document.getElementById("menu-btn");
    var sideMenu = document.getElementById("side-menu");
    var overlay = document.getElementById("menu-overlay");
    var closeBtn = document.getElementById("menu-close");
    if (!menuBtn || !sideMenu || !overlay) return;

    function openMenu() {
      sideMenu.classList.add("show");
      overlay.classList.add("show");
      document.body.style.overflow = "hidden"; /* 禁止背景滚动 */
    }
    function closeMenu() {
      sideMenu.classList.remove("show");
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    }

    /* 顶栏菜单按钮打开 */
    menuBtn.addEventListener("click", openMenu);
    /* 关闭按钮关闭 */
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    /* 点击遮罩关闭 */
    overlay.addEventListener("click", closeMenu);
    /* 点击菜单内导航链接后自动关闭 */
    sideMenu.querySelectorAll(".menu-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    /* ESC 键关闭 */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ===== 回到顶部按钮：滚动进度超过 70% 显示，点击平滑回顶 ===== */
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

  /* 脚本位于 </body> 前：DOM 已就绪，直接挂载（同时兼容延迟加载场景） */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
