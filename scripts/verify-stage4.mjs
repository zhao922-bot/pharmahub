// 阶段四验收：测验 -> 错题本 -> 深色模式
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
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

// === 测验页 ===
await page.goto(`${BASE}/quiz`, { waitUntil: "networkidle0" });
const q1 = await page.evaluate(() => {
  const text = document.body.textContent || "";
  const buttons = Array.from(document.querySelectorAll("button")).filter(b => !b.disabled);
  return {
    hasProgress: /第\s*1\s*\/\s*\d+\s*题/.test(text.replace(/\s+/g," ")),
    optionCount: document.querySelectorAll("ul li button").length,
    kind: document.querySelector(".rounded-full.bg-muted")?.textContent || "",
  };
});
check("测验页显示题号进度", q1.hasProgress);
check("题目有 4 个选项", q1.optionCount === 4, `实际 ${q1.optionCount}`);
check("显示题型标签", q1.kind.length > 0, q1.kind);

// 故意选第一个选项
const firstAnswer = await page.evaluate(() => {
  const opt = document.querySelector("ul li button");
  if (opt) { opt.click(); return opt.textContent.trim().slice(0,20); }
  return null;
});
check("点击选项", firstAnswer !== null, firstAnswer || "");
await new Promise(r => setTimeout(r, 2000));

const feedback = await page.evaluate(() => {
  const t = document.body.textContent || "";
  return {
    judged: t.includes("回答正确") || t.includes("回答错误"),
    hasExplanation: t.includes("解析"),
    hasNext: Array.from(document.querySelectorAll("button")).some(b => /下一题|查看结果/.test(b.textContent||"")),
  };
});
check("答题后立即判定", feedback.judged);
check("显示解析", feedback.hasExplanation);
check("出现下一题按钮", feedback.hasNext);

// 检查数据库
const db = new Database(DB, { readonly: true });
const attempts = db.prepare("SELECT * FROM quiz_attempt").all();
check("quiz_attempt 已写入", attempts.length === 1, `${attempts.length} 条`);
if (attempts.length > 0) {
  const a = attempts[0];
  check("记录包含题目与卡片 id", Boolean(a.question_id && a.card_id), `${a.question_id} / ${a.card_id}`);
  check("is_correct 已记录", a.is_correct === 0 || a.is_correct === 1, String(a.is_correct));
}
db.close();

// === 答完整组测验 ===
let guard = 0;
while (guard < 20) {
  guard++;
  const state = await page.evaluate(() => {
    const nextBtn = Array.from(document.querySelectorAll("button")).find(b => /下一题|查看结果/.test(b.textContent||""));
    if (nextBtn) { nextBtn.click(); return "next"; }
    const opt = document.querySelector("ul li button:not([disabled])");
    if (opt) { opt.click(); return "answer"; }
    return "done";
  });
  if (state === "done") break;
  await new Promise(r => setTimeout(r, 900));
}
await new Promise(r => setTimeout(r, 1500));
const resultPage = await page.evaluate(() => {
  const t = document.body.textContent || "";
  return { hasResult: t.includes("本组测验完成"), hasAccuracy: /正确率\s*\d+%/.test(t.replace(/\s+/g," ")) };
});
check("完成整组测验显示结果页", resultPage.hasResult);
check("结果页显示正确率", resultPage.hasAccuracy);

// === 错题本 ===
const db2 = new Database(DB, { readonly: true });
const wrong = db2.prepare("SELECT * FROM wrong_question").all();
const totalAttempts = db2.prepare("SELECT COUNT(*) n FROM quiz_attempt").get().n;
db2.close();
check("完成 8 题", totalAttempts === 8, `实际 ${totalAttempts}`);

await page.goto(`${BASE}/wrong-book`, { waitUntil: "networkidle0" });
const wrongPage = await page.evaluate(() => {
  const t = document.body.textContent || "";
  return {
    hasItems: document.querySelectorAll("ul li").length > 0,
    empty: t.includes("错题本是空的"),
  };
});
if (wrong.length > 0) {
  check("错题本有记录", wrongPage.hasItems, `${wrong.length} 道错题`);
  check("错题本非空状态", !wrongPage.empty);
} else {
  check("全对时错题本为空", wrongPage.empty);
}

// === 深色模式 ===
// 主题是「浅色 → 深色 → 跟随系统」三态循环，默认「跟随系统」。
// 因此不能假定「点一下就变深色」，要循环点击直到进入深色。
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const themeBtn = await page.$('button[aria-label*="切换深色模式"]');
check("存在主题切换按钮", themeBtn !== null);

if (themeBtn) {
  let entered = false;
  for (let i = 0; i < 3; i += 1) {
    await themeBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    if (isDark) {
      entered = true;
      break;
    }
  }
  check("循环切换可进入深色模式", entered);

  const rgbSum = (value) =>
    (value.match(/\d+/g) || []).slice(0, 3).map(Number).reduce((a, b) => a + b, 0);

  const darkState = await page.evaluate(() => ({
    stored: localStorage.getItem("pharmahub-theme"),
    bg: getComputedStyle(document.body).backgroundColor,
    fg: getComputedStyle(document.body).color,
  }));
  check(
    "深色背景确实变暗",
    rgbSum(darkState.bg) < 200,
    `bg=${darkState.bg} theme=${darkState.stored}`,
  );
  check("深色前景为浅色文字", rgbSum(darkState.fg) > 500, `fg=${darkState.fg}`);

  // 机制图配色应随主题切换（不需要重渲染 SVG）
  await page.goto(`${BASE}/cards/metoprolol`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));
  const diagramDark = await page.evaluate(() => {
    const rect = document.querySelector("figure svg rect");
    return {
      isDark: document.documentElement.classList.contains("dark"),
      fill: rect ? getComputedStyle(rect).fill : "",
    };
  });
  check(
    "深色下机制图配色随之切换",
    diagramDark.isDark && rgbSum(diagramDark.fill) < 250,
    `fill=${diagramDark.fill}`,
  );

  // 恢复浅色
  await page.evaluate(() => localStorage.setItem("pharmahub-theme", "light"));
}

console.log("\n结果: " + results.filter(Boolean).length + "/" + results.length + " 通过");
await browser.close();
process.exit(results.every(Boolean) ? 0 : 1);
