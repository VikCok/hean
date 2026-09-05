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

/* 代理路由表：前缀 -> 目标域名（按需增删，节省 Worker 字节） */
const PROXIES = [
  { prefix: "/qmkproxy/", target: "https://api.qmkjcm.cn" },
  { prefix: "/t1proxy/", target: "https://api.t1qq.com" }
];

export default {
  /**
   * 所有请求的统一入口。
   * @param {Request} request  浏览器发来的请求
   * @param {Object}  env      环境绑定（含静态资源 ASSETS）
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ---- 代理路由：命中前缀则转发到对应目标域名 ----
    for (const p of PROXIES) {
      if (url.pathname.startsWith(p.prefix)) {
        // 去掉代理前缀，拼回目标域名，保留原查询参数（如 ?key=xxx&refresh=1）
        const target = p.target + url.pathname.replace(new RegExp("^" + p.prefix), "") + url.search;

        // 转发请求（设置 UA，部分接口对空 UA 有要求）
        const resp = await fetch(target, {
          headers: { "User-Agent": "HEAN-Site/1.0" }
        });

        // 取回响应文本，原样透传，并补上 CORS 头（浏览器端即可直接 fetch）
        const body = await resp.text();
        return new Response(body, {
          status: resp.status,
          headers: {
            // 透传原 Content-Type（JSON / 图片类型保持一致）
            "Content-Type": resp.headers.get("Content-Type") || "application/json",
            // 允许任意来源跨域访问
            "Access-Control-Allow-Origin": "*",
            // 接口数据缓存 10 分钟，减少上游请求、节省免费额度
            "Cache-Control": "public, max-age=600"
          }
        });
      }
    }

    // ---- 其余请求：交给静态资源处理（页面、图片、CSS、JS 等） ----
    return env.ASSETS.fetch(request);
  }
};
