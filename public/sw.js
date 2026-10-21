/**
 * 药枢 PharmaHub · Service Worker
 *
 * 目标不是「完全离线可用」，而是**离线时体面地降级**。
 *
 * 为什么做不到完全离线：
 * 复习记录、错题本、收藏都存在云端数据库 里，
 * 页面渲染需要 server action 往返。断网后这些功能必然失效。
 * 硬做离线写入意味着要在浏览器里再实现一套 IndexedDB 存储与同步逻辑，
 * 复杂度远超本项目范围，而且两套数据源迟早会不一致。
 *
 * 策略分三层：
 *
 * 1. **静态资源**（JS/CSS/字体/图标）：Cache First
 * 2. **页面导航**：Network First，失败时回退离线页
 * 3. **RSC / server action / API**：完全不接管
 */

const VERSION = "cloud-v1";
const STATIC_CACHE = `pharmahub-static-${VERSION}`;
const PAGE_CACHE = `pharmahub-pages-${VERSION}`;
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = ["/manifest.json", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) =>
            (key.startsWith("pharmahub-static-") || key.startsWith("pharmahub-pages-")) &&
            key !== STATIC_CACHE && key !== PAGE_CACHE,
          ).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:css|js|woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)
  );
}

function isRscRequest(request, url) {
  return (
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1" ||
    url.searchParams.has("_rsc")
  );
}

async function offlineResponse() {
  const cached = await caches.match(OFFLINE_URL);
  if (cached) return cached;
  return new Response("网络不可用，请检查连接后重试。", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/") || isRscRequest(request, url)) {
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(async () => (await caches.match(request)) ?? Response.error());
      }),
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          // 私有学习记录不放入浏览器页面缓存。

          return response;
        } catch {
          return offlineResponse();
        }
      })(),
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
