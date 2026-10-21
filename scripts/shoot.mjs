// 临时截图脚本（开发期视觉走查用，不随项目交付）
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE } = getVerificationContext();
const CHROME = resolveBrowserPath();
const OUT = ".preview";
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: "home-375", url: "/", width: 375, height: 812, full: true },
  { name: "home-768", url: "/", width: 768, height: 1000, full: true },
  { name: "home-1280", url: "/", width: 1280, height: 1000, full: true },
  { name: "cards-375", url: "/cards", width: 375, height: 812, full: true },
  { name: "detail-375", url: "/cards/metoprolol", width: 375, height: 812, full: true },
  { name: "detail-1280", url: "/cards/metoprolol", width: 1280, height: 1000, full: true },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const page = await browser.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

for (const shot of shots) {
  await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 1 });
  await page.goto(`${BASE}${shot.url}`, { waitUntil: "networkidle0" });
  // 等字体与布局稳定
  await new Promise((r) => setTimeout(r, 250));
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
  }));
  const overflow = metrics.scrollWidth > metrics.clientWidth;
  await page.screenshot({
    path: `${OUT}/${shot.name}.png`,
    fullPage: shot.full,
  });
  console.log(
    `${shot.name}: viewport=${shot.width} clientWidth=${metrics.clientWidth} scrollWidth=${metrics.scrollWidth} height=${metrics.scrollHeight} ${overflow ? "⚠ 横向溢出" : "✓ 无横向溢出"}`,
  );
}

if (errors.length > 0) {
  console.log("\n控制台错误:");
  for (const e of errors.slice(0, 20)) console.log("  " + e);
} else {
  console.log("\n控制台无错误");
}

await browser.close();
