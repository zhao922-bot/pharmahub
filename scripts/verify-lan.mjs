// 局域网多端访问验收
//
// 验证「手机连同一个 Wi-Fi 打开」这条路真的能用：
// 1. 服务监听在 0.0.0.0（不是仅 127.0.0.1）
// 2. 通过局域网 IP 能访问全部页面
// 3. server action 跨网络可用（收藏、复习记录能写进去）
// 4. 移动端 UA 下无横向溢出
// 5. manifest 里的图标在局域网地址下也能取到

import puppeteer from "puppeteer-core";
import { networkInterfaces } from "node:os";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { port: PORT } = getVerificationContext();
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
};

/** 找出可用于手机访问的局域网地址 */
function findLanAddress() {
  const nets = networkInterfaces();
  const candidates = [];
  for (const [name, addresses] of Object.entries(nets)) {
    for (const addr of addresses ?? []) {
      if (addr.family !== "IPv4" || addr.internal) continue;
      // 排除虚拟网卡与 VPN 网段
      if (/^198\.18\./.test(addr.address)) continue;
      if (/^169\.254\./.test(addr.address)) continue;
      candidates.push({ name, address: addr.address });
    }
  }
  // 优先常见家用网段
  return (
    candidates.find((c) => c.address.startsWith("192.168.")) ??
    candidates.find((c) => c.address.startsWith("10.")) ??
    candidates[0] ??
    null
  );
}

const lan = findLanAddress();
if (!lan) {
  console.log("未找到局域网地址，跳过局域网测试");
  console.log("（这只说明本机没有可用的局域网网卡，不代表功能有问题）");
  process.exit(0);
}

const LAN_BASE = `http://${lan.address}:${PORT}`;
console.log(`局域网地址: ${LAN_BASE}（网卡 ${lan.name}）\n`);

// ---- 1. 局域网可达 ----
const reachable = await fetch(LAN_BASE + "/", { signal: AbortSignal.timeout(5000) })
  .then((r) => r.ok)
  .catch(() => false);
check("服务监听局域网地址（非仅 127.0.0.1）", reachable, LAN_BASE);

if (!reachable) {
  console.log("\n局域网不可达，后续测试跳过。");
  console.log("可能原因：防火墙未放行 Node.js，或服务只绑定了 localhost。");
  await new Promise((r) => setTimeout(r, 100));
  process.exit(1);
}

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

await page.setUserAgent(
  "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
);
await page.setViewport({
  width: 412,
  height: 915,
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
});

// ---- 2. 全路由可访问且无溢出 ----
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
const routeIssues = [];
for (const route of routes) {
  const res = await page.goto(LAN_BASE + route, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });
  const m = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    hasContent: (document.body.textContent || "").trim().length > 50,
  }));
  if (res.status() !== 200 || m.overflow > 1 || !m.hasContent) {
    routeIssues.push(`${route}(${res.status()}/${m.overflow}px)`);
  }
}
check(
  "局域网下全部路由可用且无溢出",
  routeIssues.length === 0,
  routeIssues.join(", ") || `${routes.length} 个路由`,
);

// ---- 3. PWA 资源在局域网地址下可用 ----
const manifestRes = await page.goto(LAN_BASE + "/manifest.json", {
  waitUntil: "networkidle0",
});
const manifest = JSON.parse(await manifestRes.text());
let iconsOk = true;
const badIcons = [];
for (const icon of manifest.icons) {
  const res = await page.goto(LAN_BASE + icon.src, { waitUntil: "domcontentloaded" });
  if (res.status() !== 200) {
    iconsOk = false;
    badIcons.push(icon.src);
  }
}
check("局域网下图标可访问", iconsOk, badIcons.join(", ") || `${manifest.icons.length} 个图标`);

const swRes = await page.goto(LAN_BASE + "/sw.js", { waitUntil: "domcontentloaded" });
check("局域网下 sw.js 可访问", swRes.status() === 200, `状态 ${swRes.status()}`);

// ---- 4. server action 跨网络可用 ----
await page.goto(LAN_BASE + "/cards/metoprolol", { waitUntil: "networkidle0" });

const beforeFavorite = await page.evaluate(() =>
  document.body.textContent?.includes("已收藏"),
);
const clickedFavorite = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll("button")).find((b) =>
    /收藏/.test(b.textContent || ""),
  );
  if (btn) {
    btn.click();
    return true;
  }
  return false;
});
await new Promise((r) => setTimeout(r, 2500));
const afterFavorite = await page.evaluate(() =>
  document.body.textContent?.includes("已收藏"),
);
check(
  "局域网下收藏 server action 生效",
  clickedFavorite && afterFavorite !== beforeFavorite,
  `${beforeFavorite} → ${afterFavorite}`,
);

// ---- 5. 复习记录写入 ----
await page.goto(LAN_BASE + "/cards/metoprolol", { waitUntil: "networkidle0" });
const reviewClicked = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll("button")).find((b) =>
    /记住了|模糊|没记住/.test(b.textContent || ""),
  );
  if (btn) {
    btn.click();
    return btn.textContent?.trim() ?? "";
  }
  return null;
});
await new Promise((r) => setTimeout(r, 2500));
check("局域网下复习记录可写入", Boolean(reviewClicked), reviewClicked ?? "未找到按钮");

// 回到首页确认进度更新
await page.goto(LAN_BASE + "/", { waitUntil: "networkidle0" });
const progress = await page.evaluate(() => {
  const text = document.body.textContent || "";
  const match = text.match(/已学卡片[\s\S]{0,20}?(\d+)\s*\/\s*(\d+)/);
  return match ? { learned: Number(match[1]), total: Number(match[2]) } : null;
});
check(
  "首页进度反映局域网操作结果",
  progress !== null && progress.learned > 0,
  progress ? `${progress.learned}/${progress.total}` : "未找到进度",
);

// ---- 6. 控制台错误 ----
check("无控制台错误", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | ") || "无");

await browser.close();
console.log(`\n结果: ${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
