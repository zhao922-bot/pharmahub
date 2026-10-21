/**
 * 机制图布局校验。
 *
 * 对每张卡片详情页的 SVG 做两项检查：
 * 1. 文字之间是否互相重叠（图里最容易出的问题）
 * 2. 文字是否超出画布（会被裁切）
 *
 * 卡片 id 不再写死——直接扫描种子数据文件，新增卡片自动纳入校验。
 * 之前写死 20 个 id，扩到 42 张后脚本仍只报「全部 20 张」，属于静默漏检。
 *
 * 用法：先 pnpm build，再 pnpm verify -- check-diagrams
 */
import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const CARDS_DIR = join(process.cwd(), "lib", "data", "cards");
const { baseURL: BASE } = getVerificationContext();
const CHROME = resolveBrowserPath();

/** 从种子数据文件里抽取全部卡片 id */
function collectCardIds() {
  const ids = [];
  for (const file of readdirSync(CARDS_DIR)) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const source = readFileSync(join(CARDS_DIR, file), "utf8");
    for (const match of source.matchAll(/^    id: "([^"]+)",$/gm)) {
      ids.push(match[1]);
    }
  }
  return ids;
}

const ids = collectCardIds();
if (ids.length === 0) {
  console.error("未找到任何卡片 id，检查路径是否正确");
  process.exit(1);
}
console.log(`发现 ${ids.length} 张卡片`);

mkdirSync(".preview/all", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 900, deviceScaleFactor: 2 });

const problems = [];
let checked = 0;

for (const id of ids) {
  await page.goto(`${BASE}/cards/${id}`, { waitUntil: "networkidle0" });

  const fig = await page.$("figure");
  if (!fig) {
    problems.push(`${id}: 页面上找不到机制图`);
    continue;
  }
  await fig.screenshot({ path: `.preview/all/${id}.png` });
  checked += 1;

  // 文字重叠
  const overlaps = await page.evaluate(() => {
    const svg = document.querySelector("figure svg");
    if (!svg) return [];
    const texts = Array.from(svg.querySelectorAll("text")).map((t) => {
      const b = t.getBBox();
      return { text: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height };
    });
    const hits = [];
    for (let i = 0; i < texts.length; i += 1) {
      for (let j = i + 1; j < texts.length; j += 1) {
        const a = texts[i];
        const b = texts[j];
        const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (overlapX > 1.5 && overlapY > 1.5) hits.push(`${a.text} ↔ ${b.text}`);
      }
    }
    return hits;
  });
  if (overlaps.length > 0) {
    problems.push(`${id}: 文字重叠 —— ${overlaps.join("; ")}`);
  }

  // 文字溢出画布
  const outside = await page.evaluate(() => {
    const svg = document.querySelector("figure svg");
    if (!svg) return [];
    const vb = svg.viewBox.baseVal;
    return Array.from(svg.querySelectorAll("text"))
      .filter((t) => {
        const b = t.getBBox();
        return (
          b.x < -0.5 ||
          b.y < -0.5 ||
          b.x + b.width > vb.width + 0.5 ||
          b.y + b.height > vb.height + 0.5
        );
      })
      .map((t) => t.textContent);
  });
  if (outside.length > 0) {
    problems.push(`${id}: 文字超出画布 —— ${outside.join("、")}`);
  }

  process.stdout.write(".");
}

console.log(`\n\n已校验 ${checked} / ${ids.length} 张机制图`);
if (problems.length > 0) {
  console.log(`\n发现 ${problems.length} 个问题：`);
  for (const problem of problems) console.log("  " + problem);
} else {
  console.log("全部通过：无文字重叠、无文字溢出画布");
}

await browser.close();
process.exit(problems.length === 0 ? 0 : 1);
