// JSON 导出 + 热力图 + 卡片扩充 端到端验收
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE, dbPath: DB_PATH } = getVerificationContext();
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
};
const withDb = (fn) => { const db = new Database(DB_PATH); try { return fn(db); } finally { db.close(); } };

// 预置学习数据
withDb((db) => {
  db.exec("DELETE FROM review_history; DELETE FROM review_log; DELETE FROM quiz_attempt; DELETE FROM wrong_question; DELETE FROM favorite;");
  const ins = db.prepare("INSERT INTO review_history (card_id, quality, reviewed_on, reviewed_at) VALUES (?,?,?,?)");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let back = 0; back < 40; back++) {
    const d = new Date(today); d.setDate(d.getDate() - back);
    if (back % 7 === 3) continue; // 制造断档
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    const n = 1 + (back % 5);
    for (let i = 0; i < n; i++) ins.run("metoprolol", 2, key, d.toISOString());
  }
  db.prepare("INSERT INTO favorite (card_id, created_at) VALUES (?,?)").run("aspirin", today.toISOString());
});

const browser = await puppeteer.launch({
  executablePath: resolveBrowserPath(),
  headless: true, args: ["--no-sandbox","--disable-gpu","--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 900 });

// === 1. JSON 导出 ===
for (const kind of ["reviews", "quiz", "wrong-book", "favorites"]) {
  const res = await fetch(`${BASE}/api/export/${kind}?format=json`);
  const text = await res.text();
  let parsed = null;
  try { parsed = JSON.parse(text); } catch {}
  const okCt = (res.headers.get("content-type") || "").includes("application/json");
  const okCd = (res.headers.get("content-disposition") || "").includes(`.json`);
  check(
    `${kind} JSON 导出正确`,
    res.status === 200 && okCt && okCd && parsed !== null,
    parsed ? `${parsed.count} 条` : "解析失败"
  );
}

// JSON 结构检查
const reviewJson = JSON.parse(await (await fetch(`${BASE}/api/export/reviews?format=json`)).text());
check("JSON 含 exportedAt", typeof reviewJson.exportedAt === "string");
check("JSON 含 columns 对照表", Array.isArray(reviewJson.columns) && reviewJson.columns.length > 0,
  reviewJson.columns.slice(0,2).map(c => `${c.key}=${c.header}`).join(", "));
check("JSON 记录含中文药名", reviewJson.records.some(r => r.genericName === "美托洛尔"));
check("JSON 记录 key 为英文", Object.keys(reviewJson.records[0] || {}).includes("cardId"));

// CSV 与 JSON 记录数一致
const csvRes = await fetch(`${BASE}/api/export/reviews?format=csv`);
const csvBuf = Buffer.from(await csvRes.arrayBuffer());
const csvText = csvBuf.toString("utf8").replace(/^\uFEFF/, "");
const csvRows = csvText.trimEnd().split("\r\n").length - 1;
check("CSV 与 JSON 记录数一致", csvRows === reviewJson.count, `CSV ${csvRows} / JSON ${reviewJson.count}`);

// 非法格式
const badFmt = await fetch(`${BASE}/api/export/reviews?format=xml`);
check("非法格式返回 400", badFmt.status === 400, `实际 ${badFmt.status}`);

// 默认格式为 CSV
const defaultRes = await fetch(`${BASE}/api/export/reviews`);
check("默认格式是 CSV", (defaultRes.headers.get("content-type") || "").includes("text/csv"));

// === 2. 导出页双按钮 ===
await page.goto(`${BASE}/export`, { waitUntil: "networkidle0" });
const exportLinks = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a[href^="/api/export/"]')).map(a => a.getAttribute("href"));
  // 数据为空时该卡片不显示下载按钮（设计如此），所以按「有数据的类型」计数
  const kinds = ["reviews", "quiz", "wrong-book", "favorites"];
  const withData = kinds.filter((k) => links.some((l) => l.includes(`/api/export/${k}?`)));
  return {
    links,
    csvCount: links.filter(l => l.includes("format=csv")).length,
    jsonCount: links.filter(l => l.includes("format=json")).length,
    withData,
    emptyShown: (document.body.textContent || "").includes("暂无数据"),
    hasFormatHint: (document.body.textContent || "").includes("两种格式怎么选"),
  };
});
check("导出页每种格式各有一个按钮", exportLinks.csvCount === exportLinks.jsonCount && exportLinks.csvCount > 0,
  `CSV ${exportLinks.csvCount} / JSON ${exportLinks.jsonCount}`);
check("有数据的类型都提供下载", exportLinks.csvCount === exportLinks.withData.length,
  `${exportLinks.withData.join(", ")}`);
check("空数据类型显示暂无数据而不是按钮", exportLinks.emptyShown && exportLinks.withData.length < 4,
  `${exportLinks.withData.length}/4 有数据`);
check("导出页有格式说明", exportLinks.hasFormatHint);

// === 3. 热力图 ===
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const heat = await page.evaluate(() => {
  const section = document.querySelector('section[aria-labelledby="heatmap-heading"]');
  if (!section) return null;
  const squares = section.querySelectorAll('span[role="img"]');
  const levels = new Set();
  for (const s of squares) {
    const cls = [...s.classList].find(c => c.startsWith("bg-emerald") || c === "bg-muted");
    if (cls) levels.add(cls);
  }
  const text = section.textContent || "";
  return { count: squares.length, levels: [...levels], text: text.replace(/\s+/g," ") };
});
check("首页有学习热力图", heat !== null);
check("热力图格子数量合理", heat.count > 100 && heat.count <= 26*7, `${heat.count} 格`);
check("热力图有多档配色", heat.levels.length >= 3, heat.levels.join(", "));
check("热力图显示复习次数", heat.text.includes("复习次数"));
check("热力图显示学习天数", heat.text.includes("学习天数"));
check("热力图显示最长连续", heat.text.includes("最长连续"));
check("热力图有图例", heat.text.includes("少") && heat.text.includes("多"));

// 月份标签
const months = await page.evaluate(() => {
  const section = document.querySelector('section[aria-labelledby="heatmap-heading"]');
  return Array.from(section.querySelectorAll('[aria-hidden="true"] > div'))
    .map(d => d.textContent.trim()).filter(t => /月$/.test(t));
});
check("热力图有月份标签", months.length >= 2, months.join(" "));

// 今天格子有描边
const todayRing = await page.evaluate(() => {
  const section = document.querySelector('section[aria-labelledby="heatmap-heading"]');
  return Array.from(section.querySelectorAll('span[role="img"]')).filter(s => s.className.includes("ring-1")).length;
});
check("今天格子有描边标记", todayRing === 1, `${todayRing} 个`);

// 连续天数与进度卡一致
const streakConsistency = await page.evaluate(() => {
  const body = document.body.textContent || "";
  // 进度卡里的「连续天数」数值
  const m = body.match(/连续天数\s*(\d+)/);
  return m ? Number(m[1]) : null;
});
check("进度卡显示连续天数", streakConsistency !== null, `${streakConsistency} 天`);

// 移动端默认滚到最右（最近的日期）
const scrollState = await page.evaluate(() => {
  const el = document.querySelector('[dir="rtl"]');
  if (!el) return null;
  return { scrollLeft: el.scrollLeft, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
});
check("热力图容器可横向滚动", scrollState !== null && scrollState.scrollWidth > scrollState.clientWidth,
  `${scrollState.clientWidth}/${scrollState.scrollWidth}`);

// === 4. 卡片扩充 ===
await page.goto(`${BASE}/cards`, { waitUntil: "networkidle0" });
const cardCount = await page.evaluate(() => {
  const m = (document.body.textContent || "").match(/(\d+)\s*张卡片/);
  return m ? Number(m[1]) : null;
});
// 不写死具体数字——卡片会继续扩充。只验证「数量合理且与页面角标一致」。
const declaredCount = await page.evaluate(() => {
  // 筛选条「全部 N」的角标
  const all = Array.from(document.querySelectorAll("button, a")).find((el) =>
    /^全部\s*\d+$/.test((el.textContent || "").replace(/\s+/g, " ").trim()),
  );
  const m = (all?.textContent || "").match(/(\d+)/);
  return m ? Number(m[1]) : null;
});
check(
  "卡片总数与筛选条角标一致",
  cardCount !== null && cardCount === declaredCount && cardCount > 0,
  `正文 ${cardCount} 张 / 角标 ${declaredCount} 张`,
);

// 新卡片可访问
for (const [id, name] of [["valproate","丙戊酸钠"],["haloperidol","氟哌啶醇"],["sertraline","舍曲林"],["sucralfate","硫糖铝"],["loperamide","洛哌丁胺"],["propylthiouracil","丙硫氧嘧啶"],["methimazole","甲巯咪唑"]]) {
  const res = await fetch(`${BASE}/cards/${id}`);
  const html = await res.text();
  check(`新卡片 ${name} 可访问`, res.status === 200 && html.includes(name));
}

// 分类数量随卡片扩充变化；对照卡片页角标与测验页提示。
const nervousDeclared = await page.evaluate(() => {
  const category = Array.from(document.querySelectorAll("button[aria-pressed]")).find((el) =>
    el.textContent?.includes("神经系统"),
  );
  const m = category?.textContent?.match(/(\d+)/);
  return m ? Number(m[1]) : null;
});
await page.goto(`${BASE}/quiz?category=nervous`, { waitUntil: "networkidle0" });
const nervousHint = await page.evaluate(() => {
  const m = (document.body.textContent || "").match(/本分类共\s*(\d+)\s*张卡片/);
  return m ? Number(m[1]) : null;
});
check(
  "神经系统测验范围与分类角标一致",
  nervousHint !== null && nervousHint > 0 && nervousHint === nervousDeclared && nervousHint < declaredCount,
  `测验 ${nervousHint} 张 / 分类角标 ${nervousDeclared} 张`,
);

// === 5. 宽度检查 ===
for (const route of ["/", "/export", "/quiz?category=nervous", "/cards/valproate"]) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  check(`${route} 无横向溢出`, m.sw <= m.cw + 1, `${m.cw}/${m.sw}`);
}

await browser.close();
console.log(`\n结果: ${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
