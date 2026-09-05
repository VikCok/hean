export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 代理路由：/qmkproxy/* -> api.qmkjcm.cn/*
    if (url.pathname.startsWith("/qmkproxy/")) {
      const target = "https://api.qmkjcm.cn" +
                     url.pathname.replace(/^\/qmkproxy/, "") +
                     url.search;
      const resp = await fetch(target, {
        headers: { "User-Agent": "HEAN-Site/1.0" }
      });
      const body = await resp.text();
      return new Response(body, {
        status: resp.status,
        headers: {
          "Content-Type": resp.headers.get("Content-Type") || "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=600"
        }
      });
    }

    // 其余请求走静态资源
    return env.ASSETS.fetch(request);
  }
};
