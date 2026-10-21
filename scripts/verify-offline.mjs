// 真实断网降级测试
//
// 为什么需要单独这个脚本：
// puppeteer 的 setOfflineMode / setRequestInterception 都会**绕过 Service Worker**，
// 导致 SW 根本收不到请求，测不出真实的离线行为。
// （实测探针记录：断网导航时 SW 只收到 /manifest.json，页面请求完全没到 SW。）
//
// 唯一可靠的验证方式是：让 SW 先接管页面，然后**真的把服务器停掉**，
// 再在同一个浏览器进程里导航。这时 SW 的 fetch 才会真正失败。
//
// 所以这个脚本会自己启停服务器。

import puppeteer from "puppeteer-core";
import { setTimeout as sleep } from "node:timers/promises";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext, setTestServerRunning } from "./verify-context.mjs";

const { baseURL: BASE } = getVerificationContext();
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
};

function serverResponds() {
  return fetch(BASE + "/", { signal: AbortSignal.timeout(2000) })
    .then(() => true)
    .catch(() => false);
}

async function waitFor(predicate, timeoutMs, intervalMs = 300) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return true;
    await sleep(intervalMs);
  }
  return false;
}

const browser = await puppeteer.launch({
  executablePath: resolveBrowserPath(),
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
await page.setUserAgent(
  "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
);

// ---- 1. 让 SW 接管 ----
await page.goto(BASE + "/", { waitUntil: "networkidle0" });
const swReady = await page.evaluate(async () => {
  if (!("serviceWorker" in navigator)) return false;
  await navigator.serviceWorker.ready;
  return Boolean(navigator.serviceWorker.controller);
});
check("Service Worker 已接管页面", swReady);

// 顺便访问几个页面，让它们进入 HTTP 缓存
for (const route of ["/cards", "/compare"]) {
  await page.goto(BASE + route, { waitUntil: "networkidle0" });
}
await page.goto(BASE + "/", { waitUntil: "networkidle0" });

// ---- 2. 停掉服务器 ----
console.log("\n停止服务器，模拟真实断网…");
await setTestServerRunning(false);
const stopped = await waitFor(async () => !(await serverResponds()), 15000);
check("服务器已停止（断网条件成立）", stopped);

// ---- 3. 断网访问未缓存的路径 ----
let offlineResult;
try {
  await page.goto(BASE + "/cards/oseltamivir-never-visited", {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  offlineResult = await page.evaluate(() => {
    const text = document.body.textContent || "";
    return {
      hasOfflineMarker: text.includes("当前离线"),
      hasRscLeak: text.includes("__next_f") && !text.includes("当前离线"),
      preview: text.trim().replace(/\s+/g, " ").slice(0, 60),
    };
  });
} catch (error) {
  offlineResult = { error: String(error).slice(0, 80) };
}
check(
  "断网访问未缓存页面 → 显示离线页",
  offlineResult.hasOfflineMarker === true,
  offlineResult.hasOfflineMarker
    ? "离线页正常"
    : offlineResult.hasRscLeak
      ? "泄漏了 RSC 脚本"
      : (offlineResult.error ?? offlineResult.preview ?? "未知"),
);
check("断网时不泄漏 RSC 脚本", offlineResult.hasRscLeak !== true);

// ---- 4. 断网访问已缓存的页面 ----
let cachedResult;
try {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 15000 });
  cachedResult = await page.evaluate(() => {
    const text = document.body.textContent || "";
    return { hasHero: text.includes("从机制开始"), preview: text.trim().slice(0, 40) };
  });
} catch (error) {
  cachedResult = { hasHero: false, error: String(error).slice(0, 60) };
}
check("断网访问首页仍可用", cachedResult.hasHero === true, cachedResult.error ?? "");

// ---- 5. 恢复服务器 ----
console.log("\n恢复服务器…");
await setTestServerRunning(true);
const recovered = await waitFor(serverResponds, 40000);
check("服务器已恢复", recovered);

if (recovered) {
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  const normal = await page.evaluate(() =>
    (document.body.textContent || "").includes("从机制开始"),
  );
  check("恢复后页面正常", normal);
}

await browser.close();
console.log(`\n结果: ${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
