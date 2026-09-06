/* components.js - 公共组件：顶栏、页脚、主题切换、回到顶部 */
(function() {
  "use strict";

  var COMMON_CSS = [
    ".site-header{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:56px;background:var(--panel);border-bottom:1px solid var(--line);backdrop-filter:blur(10px)}",
    ".brand{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:700;letter-spacing:1px;text-decoration:none;color:var(--text)}",
    ".brand .brand-tag{font-size:18px;font-weight:700;letter-spacing:1px;color:var(--text)}",
    ".brand .brand-logo{width:28px;height:28px;object-fit:contain;flex:none}",
    ".header-right{display:flex;align-items:center;gap:8px}",
    ".home-btn{padding:6px 16px;border-radius:6px;background:#2563eb;color:#fff;font-size:14px;font-weight:600;text-decoration:none;transition:background .15s}",
    ".home-btn:hover{background:#1d4ed8}",
    ".nav-btn{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--btn-border);border-radius:6px;background:var(--panel);color:var(--muted);cursor:pointer;text-decoration:none;transition:color .15s,border-color .15s}",
    ".nav-btn:hover{color:var(--btn-hover);border-color:var(--btn-hover)}",
    ".theme-btn{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--btn-border);border-radius:6px;background:var(--panel);color:var(--muted);cursor:pointer;transition:color .15s,border-color .15s}",
    ".theme-btn:hover{color:var(--btn-hover);border-color:var(--btn-hover)}",
    ".menu-btn{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--btn-border);border-radius:6px;background:var(--panel);color:var(--muted);cursor:pointer;transition:color .15s,border-color .15s}",
    ".menu-btn:hover{color:var(--btn-hover);border-color:var(--btn-hover)}",
    ".site-footer{padding:24px;text-align:center;border-top:1px solid var(--line);background:var(--panel)}",
    ".footer-links{margin-bottom:8px;font-size:13px}",
    ".footer-links a{color:var(--muted);text-decoration:none;margin:0 8px}",
    ".footer-links a:hover{color:var(--active-bg)}",
    ".footer-copy{font-size:12px;color:var(--sub)}",
    ".back-to-top{position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;background:var(--active-bg);color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.2);z-index:99;border:none;font-size:18px}",
    ".back-to-top.show{display:flex}",
    ".drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:none}",
    ".drawer-overlay.show{display:block}",
    ".drawer{position:fixed;top:0;right:0;width:280px;height:100%;background:var(--panel);z-index:201;transform:translateX(100%);transition:transform .25s ease;display:flex;flex-direction:column;padding:20px}",
    ".drawer.show{transform:translateX(0)}",
    ".drawer-close{align-self:flex-end;width:32px;height:32px;border:none;background:transparent;color:var(--muted);cursor:pointer;font-size:20px}",
    ".drawer-title{font-size:16px;font-weight:700;margin:16px 0 12px;color:var(--text)}",
    ".drawer-link{display:block;padding:10px 12px;border-radius:6px;color:var(--muted);text-decoration:none;font-size:14px;transition:background .15s,color .15s}",
    ".drawer-link:hover{background:var(--line);color:var(--text)}",
    ".drawer-divider{height:1px;background:var(--line);margin:12px 0}",
    ".drawer-theme-btn{width:100%;padding:10px;border:1px solid var(--btn-border);border-radius:6px;background:var(--panel);color:var(--muted);cursor:pointer;font-size:14px;transition:color .15s,border-color .15s}",
    ".drawer-theme-btn:hover{color:var(--btn-hover);border-color:var(--btn-hover)}",
    "@media (max-width:768px){.site-header{padding:0 12px}.brand .brand-logo{display:block}.home-btn{padding:6px 12px;font-size:13px}}"
  ].join("");

  function injectCSS() {
    var style = document.createElement("style");
    style.textContent = COMMON_CSS;
    document.head.appendChild(style);
  }

  function headerHtml() {
    var brand = window.SITE_BRAND || "HEAN";
    var tag = window.SITE_TAG || "";
    return '' +
      '<div class="site-header">' +
      '    <a class="brand" href="/home.html"><img class="brand-logo" src="/assets/logo1.png" alt="' + brand + '">' + brand + (tag ? '<span class="brand-tag">' + tag + "</span>" : "") + '</a>' +
      '    <div class="header-right">' +
      '      <a class="home-btn" href="/index.html" title="首页">首页</a>' +
      '      <a class="nav-btn" href="/core/nav.html" title="导航页">🧭</a>' +
      '      <button class="theme-btn" id="theme-toggle" title="切换主题">🌙</button>' +
      '      <button class="menu-btn" id="menu-toggle" title="菜单">☰</button>' +
      '    </div>' +
      '</div>';
  }

  function footerHtml() {
    return '' +
      '<div class="site-footer">' +
      '  <div class="footer-links">' +
      '    <a href="/disclaimer.html">免责声明</a> | ' +
      '    <a href="/about.html">关于本站</a>' +
      '  </div>' +
      '  <div class="footer-copy">Copyright © 2026 hean.me All Rights Reserved</div>' +
      '</div>';
  }

  function drawerHtml() {
    return '' +
      '<div class="drawer-overlay" id="drawer-overlay"></div>' +
      '<div class="drawer" id="drawer">' +
      '  <button class="drawer-close" id="drawer-close">✕</button>' +
      '  <div class="drawer-title">快捷导航</div>' +
      '  <a class="drawer-link" href="/index.html">🏠 首页</a>' +
      '  <a class="drawer-link" href="/home.html">✨ 主页</a>' +
      '  <a class="drawer-link" href="/core/nav.html">🧭 导航页</a>' +
      '  <a class="drawer-link" href="/sky.html">🕊️ 光遇助手</a>' +
      '  <a class="drawer-link" href="/core/cs2.html">🎮 CS2 工具箱</a>' +
      '  <a class="drawer-link" href="/core/news.html">📰 新闻聚合</a>' +
      '  <div class="drawer-divider"></div>' +
      '  <a class="drawer-link" href="/about.html">ℹ️ 关于本站</a>' +
      '  <a class="drawer-link" href="/disclaimer.html">📋 免责声明</a>' +
      '  <div class="drawer-divider"></div>' +
      '  <button class="drawer-theme-btn" id="drawer-theme-toggle">🌙 切换暗黑/白色模式</button>' +
      '</div>';
  }

  function backToTopHtml() {
    return '<button class="back-to-top" id="back-to-top" title="回到顶部">↑</button>';
  }

  function initTheme() {
    var toggle = document.getElementById("theme-toggle");
    var drawerToggle = document.getElementById("drawer-theme-toggle");
    function applyTheme(theme) {
      if (theme === "light") {
        document.documentElement.classList.remove("dark");
        if (toggle) toggle.textContent = "☀️";
        if (drawerToggle) drawerToggle.textContent = "☀️ 切换暗黑模式";
      } else {
        document.documentElement.classList.add("dark");
        if (toggle) toggle.textContent = "🌙";
        if (drawerToggle) drawerToggle.textContent = "🌙 切换白色模式";
      }
    }
    var saved = "dark";
    try { saved = localStorage.getItem("hean-theme") || "dark"; } catch (e) {}
    applyTheme(saved);
    function toggleTheme() {
      var isDark = document.documentElement.classList.contains("dark");
      var newTheme = isDark ? "light" : "dark";
      try { localStorage.setItem("hean-theme", newTheme); } catch (e) {}
      applyTheme(newTheme);
    }
    if (toggle) toggle.addEventListener("click", toggleTheme);
    if (drawerToggle) drawerToggle.addEventListener("click", toggleTheme);
  }

  function initDrawer() {
    var menuBtn = document.getElementById("menu-toggle");
    var overlay = document.getElementById("drawer-overlay");
    var drawer = document.getElementById("drawer");
    var closeBtn = document.getElementById("drawer-close");
    function open() { if (overlay) overlay.classList.add("show"); if (drawer) drawer.classList.add("show"); }
    function close() { if (overlay) overlay.classList.remove("show"); if (drawer) drawer.classList.remove("show"); }
    if (menuBtn) menuBtn.addEventListener("click", open);
    if (overlay) overlay.addEventListener("click", close);
    if (closeBtn) closeBtn.addEventListener("click", close);
  }

  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && (scrollTop / docHeight) >= 0.7) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });
    btn.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function convertLocalPaths() {
    var base = window.location.pathname;
    if (base.indexOf("/core/") !== 0) return;
    var attrs = ["href", "src"];
    var tags = ["a", "link", "img", "script"];
    tags.forEach(function(tag) {
      var els = document.getElementsByTagName(tag);
      for (var i = 0; i < els.length; i++) {
        attrs.forEach(function(attr) {
          var val = els[i].getAttribute(attr);
          if (val && val.charAt(0) === "/") {
            els[i].setAttribute(attr, val);
          }
        });
      }
    });
  }

  function init() {
    injectCSS();
    var header = document.getElementById("site-header");
    if (header) header.innerHTML = headerHtml();
    var footer = document.getElementById("site-footer");
    if (footer) footer.innerHTML = footerHtml();
    var drawerContainer = document.createElement("div");
    drawerContainer.innerHTML = drawerHtml();
    document.body.appendChild(drawerContainer);
    var bttContainer = document.createElement("div");
    bttContainer.innerHTML = backToTopHtml();
    document.body.appendChild(bttContainer);
    initTheme();
    initDrawer();
    initBackToTop();
    convertLocalPaths();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
