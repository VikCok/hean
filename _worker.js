/**
 * HEAN 站点 Cloudflare Worker 入口（_worker.js）
 *
 * 部署方式：GitHub 仓库根目录放置本文件，Cloudflare Workers 的 Git 集成
 * 会自动将其作为 Worker 入口执行，其余文件作为静态资源（env.ASSETS）。
 *
 * 职责：
 *  1. 代理 /qmkproxy/* 请求到 api.qmkjcm.cn（该站无 CORS 头），
 *     使光遇每日任务 / 一言 / 公告 / 魔法 / 代币 / 日历 / 落石点等接口
 *     可以在浏览器端直接 fetch。
 *  2. 代理 /t1proxy/* 请求到 api.t1qq.com（同上），
 *     使今日大蜡地图 / 免费魔法 / 季节剩余时间等接口可用。
 *  3. 其余请求一律回退到静态资源（页面 HTML / CSS / JS / 图片等）。
 */

const PROXIES = [
  { prefix: "/qmkproxy/", target: "https://api.qmkjcm.cn" },
  { prefix: "/t1proxy/", target: "https://api.t1qq.com" }
];

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/diag") {
      const u = url.searchParams.get("u") || "https://v1.hitokoto.cn/";
      try {
        const r = await fetch(u, { headers: { "User-Agent": BROWSER_UA } });
        const b = await r.text();
        return new Response(JSON.stringify({ ok: true, status: r.status, len: b.length, head: b.slice(0, 150) }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, msg: String((e && e.message) || e) }), {
          status: 502,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    for (const p of PROXIES) {
      if (url.pathname.startsWith(p.prefix)) {
        const target = new URL(
          url.pathname.replace(new RegExp("^" + p.prefix), "") + url.search,
          p.target
        ).href;
        try {
          const resp = await fetch(target, {
            headers: { "User-Agent": BROWSER_UA }
          });
          const body = await resp.text();
          const cacheControl = resp.status < 400 ? "public, max-age=600" : "no-store";
          return new Response(body, {
            status: resp.status,
            headers: {
              "Content-Type": resp.headers.get("Content-Type") || "application/json",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": cacheControl
            }
          });
        } catch (e) {
          return new Response(JSON.stringify({
            error: "proxy_fail",
            msg: String((e && e.message) || e),
            target: target
          }), {
            status: 502,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
      }
    }

    return env.ASSETS.fetch(request);
  }
};
