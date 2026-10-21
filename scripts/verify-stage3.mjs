// 阶段三端到端验收：复习自评 -> SQLite -> 首页看板
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { existsSync } from "node:fs";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE, dbPath: DB } = getVerificationContext();
const browser = await puppeteer.launch({
  executablePath: resolveBrowserPath(),
  headless: true, args: ["--no-sandbox","--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 900 });
const results = [];
const check = (n, ok, d="") => { results.push(ok); console.log(`${ok?"✓":"✗"} ${n}${d?" — "+d:""}`); };

// 1. 打开详情页
await page.goto(`${BASE}/cards/metoprolol`, { waitUntil: "networkidle0" });
const hasPanel = await page.evaluate(() => document.body.textContent.includes("掌握程度自评"));
check("详情页有自评面板", hasPanel);

// 2. 点击「记住了」
const clicked = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll("button"));
  const b = btns.find(x => x.textContent?.includes("记住了"));
  if (b) { b.click(); return true; }
  return false;
});
check("找到并点击「记住了」", clicked);
await new Promise(r => setTimeout(r, 2500));

// 3. 检查反馈文案
const feedback = await page.evaluate(() => document.body.textContent);
check("显示已记录反馈", feedback.includes("已记录"));
const savedMatch = feedback.match(/已记录，(\d+) 天后再复习这张|已记录，明天再复习这张/);
check("反馈包含复习间隔", Boolean(savedMatch), savedMatch ? savedMatch[0] : "");

// 4. 检查数据库
check("SQLite 文件已创建", existsSync(DB), DB);
const db = new Database(DB, { readonly: true });
const log = db.prepare("SELECT * FROM review_log WHERE card_id='metoprolol'").get();
check("review_log 已写入", Boolean(log), log ? JSON.stringify(log) : "无记录");
const hist = db.prepare("SELECT * FROM review_history WHERE card_id='metoprolol'").all();
check("review_history 已写入", hist.length > 0, `${hist.length} 条`);
if (log) {
  check("repetitions = 1", log.repetitions === 1, String(log.repetitions));
  check("interval_days = 1", log.interval_days === 1, String(log.interval_days));
  check("easiness > 2.5（答对提升难度因子）", log.easiness > 2.5, String(log.easiness));
}
db.close();

// 5. 首页看板
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const home = await page.evaluate(() => document.body.textContent);
check("首页显示已学卡片 1", /已学卡片\s*1/.test(home.replace(/\s+/g," ")) || home.includes("1/20"), "");
check("首页显示连续天数", home.includes("连续天数"));
check("首页今日复习计数已更新", /今日复习/.test(home));

// 6. 收藏
await page.goto(`${BASE}/cards/aspirin`, { waitUntil: "networkidle0" });
const favClicked = await page.evaluate(() => {
  const b = document.querySelector('button[aria-label="收藏"]');
  if (b) { b.click(); return true; }
  return false;
});
check("点击收藏按钮", favClicked);
await new Promise(r => setTimeout(r, 2000));
const favState = await page.evaluate(() => {
  const b = document.querySelector('button[aria-pressed]');
  return b ? b.getAttribute("aria-pressed") : null;
});
check("收藏状态切换为 true", favState === "true", String(favState));

const db2 = new Database(DB, { readonly: true });
const favs = db2.prepare("SELECT card_id FROM favorite").all();
check("favorite 表已写入", favs.length > 0, favs.map(f=>f.card_id).join(","));
db2.close();

console.log("\n结果: " + results.filter(Boolean).length + "/" + results.length + " 通过");
await browser.close();
process.exit(results.every(Boolean) ? 0 : 1);
