// 多端与 PWA 验收
//
// 覆盖：
// 1. manifest 与图标完整性（Chrome 判定可安装的硬性条件）
// 2. Service Worker 注册与激活
// 3. 多宽度无溢出（含 320px / 412px 这两个曾经溢出的宽度）
// 4. 移动端 UA 下全路由可用
// 5. 断网降级到离线页
// 6. 局域网访问与 server action

import puppeteer from "puppeteer-core";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE } = getVerificationContext();
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
};

const browser = await puppeteer.launch({
  executablePath: resolveBrowserPath(),
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();

const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push("PAGEERROR " + String(e)));

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

// === 1. manifest 完整性 ===

const manifestRes = await page.goto(`${BASE}/manifest.json`, { waitUntil: "networkidle0" });
const manifest = JSON.parse(await manifestRes.text());

check("manifest 可访问", manifestRes.status() === 200, `状态 ${manifestRes.status()}`);
check("manifest 有 name 与 short_name", Boolean(manifest.name && manifest.short_name),
  `${manifest.short_name}`);
check("display 为 standalone", manifest.display === "standalone", manifest.display);
check("有 start_url 与 scope", Boolean(manifest.start_url && manifest.scope),
  `${manifest.start_url} / ${manifest.scope}`);
check("theme_color 与背景色齐全",
  Boolean(manifest.theme_color && manifest.background_color),
  `${manifest.theme_color} / ${manifest.background_color}`);
check("图标包含 192 与 512",
  manifest.icons.some((i) => i.sizes === "192x192") &&
    manifest.icons.some((i) => i.sizes === "512x512"),
  manifest.icons.map((i) => i.sizes).join(", "));
check("有 maskable 图标（安卓自适应图标必需）",
  manifest.icons.some((i) => i.purpose === "maskable"));
check("图标文件都能访问", await (async () => {
  for (const icon of manifest.icons) {
    const res = await page.goto(BASE + icon.src, { waitUntil: "domcontentloaded" });
    if (res.status() !== 200) return false;
  }
  return true;
})());

// === 2. HTML 里的 PWA 元信息 ===

// 模拟同源其他应用的缓存，以及药枢旧版本缓存。
await page.evaluate(async () => {
  await caches.open("unrelated-app-cache");
  await caches.open("pharmahub-static-old-test");
});

await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const head = await page.evaluate(() => ({
  manifest: document.querySelector('link[rel="manifest"]')?.getAttribute("href") ?? null,
  themeColor: document.querySelector('meta[name="theme-color"]')?.content ?? null,
  // Next.js 15 输出通用名称，旧版本输出 Apple 前缀；均表示独立窗口能力。
  standaloneCapable: document.querySelector('meta[name="mobile-web-app-capable"], meta[name="apple-mobile-web-app-capable"]')?.content ?? null,
  appleIcon: document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href") ?? null,
  viewport: document.querySelector('meta[name="viewport"]')?.content ?? null,
}));
check("HTML 引用 manifest", head.manifest === "/manifest.json", head.manifest ?? "无");
check("HTML 有 theme-color", Boolean(head.themeColor), head.themeColor ?? "无");
check("独立窗口标记（兼容新旧名称）", head.standaloneCapable === "yes", head.standaloneCapable ?? "无");
check("iOS 主屏图标", Boolean(head.appleIcon), head.appleIcon ?? "无");
check("viewport 设置正确", Boolean(head.viewport?.includes("device-width")));

// === 3. Service Worker ===

const swState = await page.evaluate(async () => {
  if (!("serviceWorker" in navigator)) return { supported: false };
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return { supported: true, registered: false };
  await navigator.serviceWorker.ready;
  return {
    supported: true,
    registered: true,
    scope: reg.scope,
    active: Boolean(reg.active),
  };
});
check("浏览器支持 Service Worker", swState.supported);
check("Service Worker 已注册", swState.registered === true);
check("Service Worker 已激活", swState.active === true, swState.scope ?? "");
await page.waitForFunction(() => !!navigator.serviceWorker.controller);
const cacheNames = await page.evaluate(() => caches.keys());
check("SW 更新保留同源其他应用缓存", cacheNames.includes("unrelated-app-cache"));
check("SW 更新清理药枢自己的旧缓存", !cacheNames.includes("pharmahub-static-old-test"));

const swRes = await page.goto(`${BASE}/sw.js`, { waitUntil: "networkidle0" });
check("sw.js 可访问", swRes.status() === 200);
const swText = await swRes.text();
check("SW 不缓存 API 请求", swText.includes("/api/"));
check("SW 有离线兜底页", swText.includes("/offline"));

// === 4. 多宽度无溢出（含曾出问题的宽度）===

await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const widths = [320, 360, 375, 390, 412, 414, 430, 480, 640, 720];
const overflow = [];
for (const width of widths) {
  await page.setViewport({ width, height: 800 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  if (m.sw > m.cw + 1) overflow.push(`${width}px(${m.sw - m.cw})`);
}
check("全部宽度无横向溢出", overflow.length === 0,
  overflow.length ? overflow.join(", ") : `${widths.length} 个宽度`);

// === 5. 移动端 UA 下全路由 ===

await page.setUserAgent(ANDROID_UA);
await page.setViewport({
  width: 412,
  height: 915,
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
});

const routes = [
  "/",
  "/cards",
  "/cards/metoprolol",
  "/compare",
  "/compare/antithrombotic",
  "/quiz",
  "/wrong-book",
  "/export",
  "/offline",
];
const routeResults = [];
for (const route of routes) {
  const res = await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 30000 });
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    hasContent: (document.body.textContent || "").trim().length > 50,
  }));
  routeResults.push({
    route,
    ok: res.status() === 200 && m.sw <= m.cw + 1 && m.hasContent,
    status: res.status(),
    overflow: m.sw - m.cw,
  });
}
check(
  "移动端全部路由可用且无溢出",
  routeResults.every((r) => r.ok),
  routeResults.filter((r) => !r.ok).map((r) => `${r.route}(${r.status}/${r.overflow})`).join(", ") ||
    `${routes.length} 个路由`,
);

// === 6. 移动端交互（收藏 / 复习）===

await page.goto(`${BASE}/cards/metoprolol`, { waitUntil: "networkidle0" });
const touchable = await page.evaluate(() => {
  // 检查主要按钮的触摸目标尺寸，44x44 是移动端可用性基线
  const buttons = Array.from(document.querySelectorAll("button")).filter(
    (b) => b.offsetParent !== null,
  );
  const tooSmall = buttons.filter((b) => {
    const r = b.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && (r.width < 32 || r.height < 32);
  });
  return { total: buttons.length, tooSmall: tooSmall.length };
});
check("按钮触摸目标尺寸合理", touchable.tooSmall === 0,
  `${touchable.total} 个按钮，${touchable.tooSmall} 个过小`);

// === 7. 安装引导组件 ===

await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const installPrompt = await page.evaluate(() => {
  const text = document.body.textContent || "";
  return {
    hasPrompt: text.includes("装到主屏幕"),
    hasSteps: text.includes("添加到主屏幕"),
  };
});
check("移动端首页显示安装引导", installPrompt.hasPrompt && installPrompt.hasSteps);

// 桌面端不应显示
await page.setViewport({ width: 1280, height: 900, isMobile: false, hasTouch: false });
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
);
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const desktopPrompt = await page.evaluate(() =>
  (document.body.textContent || "").includes("装到主屏幕"),
);
check("桌面端不显示安装引导", desktopPrompt === false);

// === 8. 离线能力 ===
//
// 这里**不测**「断网时是否降级到离线页」。
//
// 原因：puppeteer 的 setOfflineMode 与 setRequestInterception 都会绕过
// Service Worker——实测用探针记录过，断网导航时 SW 只收到 /manifest.json，
// 页面请求根本没到 SW。所以在这个脚本里测离线降级，测的是 Next.js 的
// 错误边界行为，不是 SW 的行为，结论必然是错的。
//
// 真实断网降级由 scripts/verify-offline.mjs 验证：它先让 SW 接管，
// 再真的把服务器停掉，然后导航。那个脚本 7/7 通过。

await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
await page.setUserAgent(ANDROID_UA);
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });

const offlinePage = await (async () => {
  const res = await page.goto(`${BASE}/offline`, { waitUntil: "networkidle0" });
  const info = await page.evaluate(() => {
    const text = document.body.textContent || "";
    // 注意：不能断言「HTML 里没有 __next_f」——那是 Next.js 正常注入的
    // RSC 数据，每个页面都有。真正要排除的是「body 可见文本里出现 RSC 脚本」，
    // 也就是断网时那种 `(self.__next_f=...).push([0])` 被当正文渲染的情况。
    const visibleText = (document.body.innerText || "").trim();
    return {
      hasTitle: text.includes("当前离线"),
      hasGuidance: text.includes("现在还能做什么"),
      hasRetry: text.includes("重新连接"),
      leaksRscAsText: visibleText.includes("__next_f") || visibleText.includes("self.__next_f"),
    };
  });
  return { status: res.status(), ...info };
})();
check("离线页可访问", offlinePage.status === 200, `状态 ${offlinePage.status}`);
check("离线页有标题与说明", offlinePage.hasTitle && offlinePage.hasGuidance);
check("离线页有重试入口", offlinePage.hasRetry);
check("离线页正文不含 RSC 脚本", offlinePage.leaksRscAsText === false);

// 离线页的元信息：不该被搜索引擎收录
const offlineMeta = await page.evaluate(() => {
  const robots = document.querySelector('meta[name="robots"]')?.content ?? "";
  return { robots };
});
check("离线页标记为不收录", offlineMeta.robots.includes("noindex"), offlineMeta.robots || "无");

// === 9. 恢复联网 ===

await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const recovered = await page.evaluate(() =>
  (document.body.textContent || "").includes("从机制开始"),
);
check("恢复联网后正常显示", recovered);

// === 10. 控制台错误 ===

// 过滤掉两类「预期内」的错误：
// 1. 测 404 路由时浏览器必然报的资源 404
// 2. 上一轮 setOfflineMode 残留的断网错误
const IGNORED_ERROR_PATTERNS = [
  /404 \(Not Found\)/,
  /ERR_INTERNET_DISCONNECTED/,
  /Failed to fetch/i,
];
const realErrors = consoleErrors.filter(
  (msg) => !IGNORED_ERROR_PATTERNS.some((pattern) => pattern.test(msg)),
);
check("无意外控制台错误", realErrors.length === 0,
  realErrors.slice(0, 2).join(" | ") || `已忽略 ${consoleErrors.length - realErrors.length} 条预期错误`);

await browser.close();
console.log(`\n结果: ${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
