// Wave 1 新增功能端到端验收（DDI互链、特征标签、连续闪卡复习、状态筛选、分类掌握诊断、JSON导入）
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE, dbPath } = getVerificationContext();
const directory = dirname(dbPath);
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

let db;
try {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(`PAGEERROR ${String(err)}`));

  await page.setViewport({ width: 375, height: 900 });
  const go = (route) => page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
  const overflow = () =>
    page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

  db = new Database(dbPath, { readonly: true, fileMustExist: true });

  // 1. 知识维度升级：DDI 互链与药代特征标签
  await go("/cards/warfarin");
  const warfarinText = await page.$eval("main", (el) => el.textContent || "");
  check("华法林详情页显示药代特征标签", warfarinText.includes("窄治疗窗 / 需监测"));
  check("华法林详情页显示代表性药物相互作用", warfarinText.includes("代表性药物相互作用"));
  const jumpLink = await page.$('main a[href="/cards/fluconazole"]');
  check("华法林相互作用含氟康唑互链跳转", jumpLink !== null);
  check("华法林详情页 375px 无横向溢出", !(await overflow()));
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('main a[href="/cards/fluconazole"]'),
  ]);
  check("点击 DDI 互链跳转至氟康唑详情页", page.url().endsWith("/cards/fluconazole"));

  // 先收藏并自评 1 张卡，再测 /cards 筛选与 /review 队列
  await page.click('button[aria-label="收藏"]');
  await page.waitForSelector('button[aria-label="已收藏"]');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find(
      (b) => b.textContent?.includes("没记住"),
    );
    btn?.click();
  });
  await page.waitForFunction(() => document.body.textContent?.includes("已记录，"));

  // 2. /cards 状态筛选与特征标签筛选
  await go("/cards");
  const cardsText = await page.$eval("main", (el) => el.textContent || "");
  check("卡片库显示全部卡片总数", /共 \d+ 张卡片/.test(cardsText));
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('div[role="group"] button')].find(
      (b) => b.textContent?.includes("已收藏"),
    );
    btn?.click();
  });
  await page.waitForFunction(() =>
    (document.querySelector('p[aria-live="polite"]')?.textContent || "").includes("找到 1 张卡片"),
  );
  const favFiltered = await page.$eval("main", (el) => el.textContent || "");
  check("状态筛选「已收藏」正确命中氟康唑", favFiltered.includes("氟康唑"));

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find(
      (b) => b.textContent?.includes("重置筛选"),
    );
    btn?.click();
  });
  await page.waitForFunction(() =>
    /共 \d+ 张卡片/.test(document.querySelector('p[aria-live="polite"]')?.textContent || ""),
  );
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('div[role="group"] button')].find(
      (b) => b.textContent?.includes("窄治疗窗"),
    );
    btn?.click();
  });
  await page.waitForFunction(() =>
    (document.querySelector('p[aria-live="polite"]')?.textContent || "").includes("找到"),
  );
  const tagFiltered = await page.$eval("main", (el) => el.textContent || "");
  check("特征标签筛选「窄治疗窗」命中华法林/地高辛", tagFiltered.includes("华法林") && tagFiltered.includes("地高辛"));

  // 3. /review 沉浸式连续复习队列
  await go("/review?mode=unlearned&category=antiviral");
  const frontText = await page.$eval("main", (el) => el.textContent || "");
  check("连续复习正面显示进队列与提示", frontText.includes("第 1 / 8 张") && frontText.includes("查看机制与答案"));
  check("连续复习正面隐藏记忆要点", !frontText.includes("记忆要点"));
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("main button")].find(
      (b) => b.textContent?.includes("查看靶点提示"),
    );
    btn?.click();
  });
  check("可按需展开靶点提示", (await page.$eval("main", (el) => el.textContent || "")).includes("靶点提示"));
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("main button")].find(
      (b) => b.textContent?.includes("查看机制与答案"),
    );
    btn?.click();
  });
  await page.waitForFunction(() => (document.querySelector("main")?.textContent || "").includes("机制示意图"));
  check("翻面后展示机制图 SVG 与自评按钮", (await page.$("main figure svg")) !== null);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("main button")].find(
      (b) => b.textContent?.includes("记住了") && !b.textContent?.includes("没记住"),
    );
    btn?.click();
  });
  await page.waitForFunction(() => (document.querySelector("main")?.textContent || "").includes("第 2 / 8 张"));
  check("自评后自动切换下一张并写入数据库",
    db.prepare("SELECT COUNT(*) n FROM review_history").get().n >= 2);
  check("连续复习页面 375px 无横向溢出", !(await overflow()));

  // 4. 首页分类掌握度诊断与连续复习入口
  await go("/");
  const homeText = await page.$eval("main", (el) => el.textContent || "");
  check("首页有「开始连续复习」入口", await page.$('main a[href="/review"]') !== null);
  check("首页展示各系统掌握诊断面板", homeText.includes("各系统掌握诊断") && homeText.includes("抗病毒药"));
  check("首页 375px 无横向溢出", !(await overflow()));

  // 5. 新增卡片与新增对比组页面可达性（暗黑模式一并检查）
  await page.evaluateOnNewDocument(() => localStorage.setItem("pharmahub-theme", "dark"));
  for (const route of [
    "/cards/baloxavir-marboxil",
    "/cards/osimertinib",
    "/cards/caspofungin",
    "/cards/fexofenadine",
    "/compare/heparin-vs-enoxaparin",
    "/compare/warfarin-vs-apixaban-vs-rivaroxaban",
    "/quiz?compare=gout-acute-vs-chronic",
    "/review?mode=due",
  ]) {
    const res = await go(route);
    check(`${route} 深色模式 375px 正常渲染无溢出`, res.status() === 200 && !(await overflow()));
  }

  // 6. JSON 导入导出往返与界面上传
  await page.evaluateOnNewDocument(() => localStorage.removeItem("pharmahub-theme"));
  const exportedFav = await (await fetch(`${BASE}/api/export/favorites?format=json`)).json();
  assert.ok(exportedFav.count >= 1);
  // 构造一条新收藏 JSON 并通过 /export 界面上传导入
  const importPayload = {
    ...exportedFav,
    count: 2,
    records: [
      ...exportedFav.records,
      {
        cardId: "warfarin",
        genericName: "华法林",
        englishName: "Warfarin",
        createdAt: "2026-11-24T08:00:00.000Z",
      },
    ],
  };
  const importFilePath = join(directory, "import-favorites.json");
  await writeFile(importFilePath, JSON.stringify(importPayload), "utf8");

  await go("/export");
  const fileInput = await page.$('input[type="file"]');
  check("导出页挂载 JSON 导入控件", fileInput !== null);
  await fileInput.uploadFile(importFilePath);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("main button")].find(
      (b) => b.textContent?.includes("导入并合并"),
    );
    btn?.click();
  });
  await page.waitForFunction(() =>
    (document.querySelector("main")?.textContent || "").includes("收藏导入完成"),
  );
  check("JSON 导入合并新增华法林收藏并跳过已有记录",
    !!db.prepare("SELECT card_id FROM favorite WHERE card_id = ?").get("warfarin"));

  // 非法导入返回 400
  const badRes = await fetch(`${BASE}/api/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "favorites", records: [{ cardId: "not-a-real-card", createdAt: "2026-11-24T08:00:00.000Z" }] }),
  });
  check("非法 cardId 导入被拒绝返回 400", badRes.status === 400);

  check("Wave 1 验收全程无控制台错误", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | "));
} finally {
  db?.close();
  await browser.close();
}

console.log(`\nWave 1 专项验收：${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
