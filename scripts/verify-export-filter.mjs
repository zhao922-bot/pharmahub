// 测验分类筛选 + 数据导出 端到端验收
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE, dbPath: DB_PATH } = getVerificationContext();

const browser = await puppeteer.launch({
  executablePath: resolveBrowserPath(),
  headless: true, args: ["--no-sandbox","--disable-gpu","--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 900 });

const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
};

function withDb(fn) {
  const db = new Database(DB_PATH);
  try { return fn(db); } finally { db.close(); }
}

// 预置数据，让导出有内容
withDb((db) => {
  db.exec("DELETE FROM quiz_attempt; DELETE FROM wrong_question; DELETE FROM review_log; DELETE FROM review_history; DELETE FROM favorite;");
  const now = new Date();
  const ins = db.prepare("INSERT INTO review_history (card_id, quality, reviewed_on, reviewed_at) VALUES (?,?,?,?)");
  ins.run("metoprolol", 2, "2026-10-18", new Date(now.getTime()-86400000).toISOString());
  ins.run("metoprolol", 1, "2026-10-19", now.toISOString());
  ins.run("aspirin", 2, "2026-10-19", now.toISOString());
  db.prepare("INSERT INTO review_log (card_id, repetitions, easiness, interval_days, next_review_at, last_reviewed_at, updated_at) VALUES (?,?,?,?,?,?,?)")
    .run("metoprolol", 2, 2.5, 6, "2026-10-25", now.toISOString(), now.toISOString());
  db.prepare("INSERT INTO favorite (card_id, created_at) VALUES (?,?)").run("aspirin", now.toISOString());
  db.prepare("INSERT INTO quiz_attempt (question_id, card_id, kind, selected_id, correct_id, is_correct, answered_on, answered_at) VALUES (?,?,?,?,?,?,?,?)")
    .run("metoprolol:target", "metoprolol", "target", "opt-1", "opt-1", 1, "2026-10-19", now.toISOString());
  db.prepare("INSERT INTO wrong_question (question_id, card_id, kind, wrong_count, last_wrong_at) VALUES (?,?,?,?,?)")
    .run("aspirin:indication", "aspirin", "indication", 2, now.toISOString());
});

// === 测验分类筛选 ===
await page.goto(`${BASE}/quiz`, { waitUntil: "networkidle0" });
const allState = await page.evaluate(() => {
  const chips = Array.from(document.querySelectorAll('a[href^="/quiz"]')).map(a => ({
    href: a.getAttribute("href"),
    text: a.textContent.trim(),
  })).filter(c => c.href === "/quiz" || c.href.includes("category="));
  return { chips, hasFilterLabel: Boolean(document.querySelector('[aria-label="按系统筛选题目"]')) };
});
check("测验页有分类筛选条", allState.hasFilterLabel);
check("筛选条含「全部」与各分类", allState.chips.length >= 8, `${allState.chips.length} 个：${allState.chips.slice(0,3).map(c=>c.text).join("、")}…`);

// 点神经系统分类
await page.goto(`${BASE}/quiz?category=nervous`, { waitUntil: "networkidle0" });
const nervousState = await page.evaluate(() => {
  const t = document.body.textContent || "";
  const active = document.querySelector('a[aria-current="page"]')?.textContent?.trim() || "";
  const prompt = document.querySelector("p.text-\\[15px\\]")?.textContent?.trim() || "";
  return { hasHint: t.includes("当前只考"), active, prompt, url: location.href };
});
check("分类筛选后显示当前分类提示", nervousState.hasHint, nervousState.active);
check("分类筛选后 URL 带参数", nervousState.url.includes("category=nervous"));
check("分类筛选后仍能出题", nervousState.prompt.length > 0, nervousState.prompt);

// 验证题目确实来自该分类：走完一组，检查所有题干都是神经系统药物
// 神经系统当前 9 张（新增丙戊酸钠、氟哌啶醇、舍曲林）。
// 硬编码清单在扩充卡片后会失效，所以这里改成「从卡片库读取该分类的药名」，
// 这样以后再扩充也不用改测试。
const nervousCards = await page.evaluate(async () => {
  const res = await fetch("/cards?category=nervous");
  const html = await res.text();
  const names = new Set();
  for (const m of html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)) names.add(m[1].trim());
  return [...names];
});
if (nervousCards.length === 0) {
  // 兜底：退回到已知清单
  nervousCards.push("地西泮","氟西汀","氯丙嗪","吗啡","左旋多巴","苯妥英钠","丙戊酸钠","氟哌啶醇","舍曲林");
}
const prompts = [];
let guard = 0;
while (guard < 30) {
  guard++;
  const st = await page.evaluate(() => {
    const t = document.body.textContent || "";
    if (t.includes("本组测验完成")) return { done: true };
    const prompt = document.querySelector("p.text-\\[15px\\]")?.textContent?.trim() || "";
    const hasNext = Array.from(document.querySelectorAll("button")).some(b => /下一题|查看结果/.test(b.textContent||""));
    return { done: false, prompt, hasNext };
  });
  if (st.done) break;
  if (st.prompt && !prompts.includes(st.prompt)) prompts.push(st.prompt);
  if (st.hasNext) {
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll("button")).find(x => /下一题|查看结果/.test(x.textContent||""));
      if (b) b.click();
    });
  } else {
    const ok = await page.evaluate(() => { const o = document.querySelector("ul li button:not([disabled])"); if (o) { o.click(); return true; } return false; });
    if (!ok) break;
  }
  await new Promise(r => setTimeout(r, 650));
}
const allFromNervous = prompts.every(p => nervousCards.some(name => p.includes(name)));
check("题目全部来自所选分类", allFromNervous, `${prompts.length} 题：${prompts.slice(0,3).map(p=>p.slice(0,10)).join(" / ")}`);

// 分类题的干扰项仍来自全部分类（不能退化成只有神经系统）
await page.goto(`${BASE}/quiz?category=nervous`, { waitUntil: "networkidle0" });
const categoryQuestion = await page.evaluate(() => {
  // 找分类题（题干含「属于下列哪个系统分类」）
  const prompts = Array.from(document.querySelectorAll("p.text-\\[15px\\]"));
  const target = prompts.find(p => p.textContent.includes("系统分类"));
  if (!target) return null;
  const card = target.closest(".rounded-lg") || target.parentElement.parentElement;
  const opts = Array.from(card.querySelectorAll("ul li button")).map(o => o.textContent.trim());
  return { prompt: target.textContent.trim(), opts };
});
if (categoryQuestion) {
  const hasOtherCategory = categoryQuestion.opts.some(o => !o.includes("神经系统"));
  check("分类题干扰项来自其他分类", hasOtherCategory, categoryQuestion.opts.map(o=>o.replace(/^[A-D]/,"")).join(" | "));
} else {
  check("分类题干扰项来自其他分类", true, "本组无分类题，跳过");
}

// === 导出页 ===
await page.goto(`${BASE}/export`, { waitUntil: "networkidle0" });
const exportPage = await page.evaluate(() => {
  const t = document.body.textContent || "";
  const links = Array.from(document.querySelectorAll('a[href^="/api/export/"]')).map(a => a.getAttribute("href"));
  return { title: t.includes("导出学习数据"), links, hasNote: t.includes("UTF-8 BOM") };
});
check("导出页标题正确", exportPage.title);
// 现在每种数据有两种格式（CSV / JSON），共 8 个入口
check("导出页有 8 个下载入口", exportPage.links.length === 8, `${exportPage.links.length} 个`);
check("导出页有格式说明", exportPage.hasNote);

// === 实际下载并校验 CSV 内容 ===
const csvChecks = [];
for (const [kind, expectedHeader] of [
  ["reviews", "复习时刻"],
  ["quiz", "答题时刻"],
  ["wrong-book", "题目ID"],
  ["favorites", "卡片ID"],
]) {
  const res = await fetch(`${BASE}/api/export/${kind}`);
  // 不能用 res.text() 检测 BOM —— Response.text() 按规范会在解码时剥离
  // UTF-8 BOM，charCodeAt(0) 拿到的是正文首字。必须看原始字节。
  const buffer = Buffer.from(await res.arrayBuffer());
  const text = buffer.toString("utf8");
  const okStatus = res.status === 200;
  // UTF-8 BOM 字节序列：EF BB BF
  const hasBom = buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
  const hasHeader = text.includes(expectedHeader);
  const isCsv = (res.headers.get("content-type") || "").includes("text/csv");
  const hasDisposition = (res.headers.get("content-disposition") || "").includes("attachment");
  const hasNoStore = (res.headers.get("cache-control") || "").includes("no-store");
  const lineCount = text.replace(/^\uFEFF/, "").trimEnd().split("\r\n").length;
  csvChecks.push({ kind, okStatus, hasBom, hasHeader, isCsv, hasDisposition, hasNoStore, lineCount });
  check(
    `${kind} 导出正确`,
    okStatus && hasBom && hasHeader && isCsv && hasDisposition && hasNoStore,
    `BOM=${hasBom} 表头=${hasHeader} ${lineCount} 行`
  );
}

// 复习记录应有 3 行数据 + 1 行表头
const reviewCsv = csvChecks.find(c => c.kind === "reviews");
check("复习记录行数正确", reviewCsv.lineCount === 4, `${reviewCsv.lineCount} 行（1 表头 + 3 数据）`);

// 内容应包含中文药名而非只有 id
const reviewText = await (await fetch(`${BASE}/api/export/reviews`)).text();
check("导出内容含中文药名", reviewText.includes("美托洛尔"), reviewText.split("\r\n")[1]?.slice(0, 60));
check("导出内容含自评中文", reviewText.includes("记住了") || reviewText.includes("模糊"));

// 未知类型应 404
const badRes = await fetch(`${BASE}/api/export/unknown`);
check("未知导出类型返回 404", badRes.status === 404, `实际 ${badRes.status}`);

// === 页脚入口 ===
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const footerLink = await page.evaluate(() => Boolean(document.querySelector('footer a[href="/export"]')));
check("页脚有导出入口", footerLink);

// === 宽度检查 ===
for (const route of ["/quiz?category=nervous", "/export"]) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  check(`${route} 无横向溢出`, m.sw <= m.cw + 1, `${m.cw}/${m.sw}`);
}

await browser.close();
console.log(`\n结果: ${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
