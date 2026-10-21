/**
 * 全站走查：所有页面 × 浅色/深色 × 移动/平板/桌面。
 *
 * 检查两件事：
 * 1. 横向溢出（移动端最容易出的问题）
 * 2. 控制台错误（hydration 不匹配、资源 404 等）
 *
 * 404 页面单独处理：访问不存在的路由本来就会产生一条 404 资源错误，
 * 那是预期行为，不算缺陷；但页面本身仍要检查溢出。
 *
 * 用法：先 pnpm build，再 pnpm verify -- walkthrough
 */
import puppeteer from "puppeteer-core";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE } = getVerificationContext();
const CHROME = resolveBrowserPath();

/** 正常页面 */
const ROUTES = [
  "/",
  "/cards",
  "/cards/metoprolol",
  "/cards/aspirin",
  "/cards/chlorpheniramine",
  "/compare",
  "/compare/antihistamine-gen",
  "/compare/antithrombotic",
  "/quiz",
  "/quiz?category=nervous",
  "/quiz?compare=antihistamine-gen",
  "/quiz?compare=antithrombotic",
  "/quiz/review",
  "/wrong-book",
  "/export",
  "/offline",
];

/** 404 页面：允许出现 404 资源错误 */
const NOT_FOUND_ROUTE = "/cards/nonexistent";

/**
 * 走查宽度。
 *
 * 320 是能想到的最窄主流设备（iPhone SE 一代、老安卓），
 * 412 是 Pixel 与多数国产安卓的默认宽度——这两个宽度曾经因为
 * 导航加了第 4 项而横向溢出，所以必须纳入回归。
 */
const WIDTHS = [320, 375, 412, 768, 1280];
const THEMES = ["light", "dark"];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();

const problems = [];
let checked = 0;

async function visit(route, { allow404 = false } = {}) {
  const errors = [];
  const handler = (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    // 404 页面的资源错误属预期
    if (allow404 && /404|Not Found/i.test(text)) return;
    errors.push(text);
  };
  page.on("console", handler);

  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
  await new Promise((resolve) => setTimeout(resolve, 200));

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    isDark: document.documentElement.classList.contains("dark"),
    // 检查是否有元素溢出色块边界（更细的检测）
    overflowing: Array.from(document.querySelectorAll("main *")).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.right > window.innerWidth + 1 || rect.left < -1);
    }).length,
  }));

  page.off("console", handler);
  checked += 1;

  const label = `${route}`;
  if (metrics.scrollWidth > metrics.clientWidth + 1) {
    problems.push(`${label}: 横向溢出 ${metrics.clientWidth}→${metrics.scrollWidth}`);
  }
  if (errors.length > 0) {
    problems.push(`${label}: 控制台错误「${errors[0].slice(0, 100)}」`);
  }
  return metrics;
}

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900 });
    await page.evaluateOnNewDocument(
      (value) => localStorage.setItem("pharmahub-theme", value),
      theme,
    );

    const tag = `[${theme} ${width}px]`;

    for (const route of ROUTES) {
      const before = problems.length;
      await visit(route);
      // 给问题加上主题/宽度前缀
      for (let i = before; i < problems.length; i += 1) {
        problems[i] = `${tag} ${problems[i]}`;
      }
    }

    // 404 页面单独跑，允许 404 资源错误
    const before = problems.length;
    await visit(NOT_FOUND_ROUTE, { allow404: true });
    for (let i = before; i < problems.length; i += 1) {
      problems[i] = `${tag} ${problems[i]}`;
    }
  }
}

console.log(
  `走查完成：${ROUTES.length + 1} 个页面 × ${WIDTHS.length} 种宽度 × ${THEMES.length} 种主题 = ${checked} 次访问`,
);

if (problems.length > 0) {
  console.log(`\n发现 ${problems.length} 个问题：`);
  for (const problem of problems) console.log("  " + problem);
} else {
  console.log("全部通过：无横向溢出、无控制台错误");
}

await browser.close();
process.exit(problems.length === 0 ? 0 : 1);
