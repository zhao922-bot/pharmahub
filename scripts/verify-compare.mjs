// 同类药对比视图 · 端到端验收
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
await page.setViewport({ width: 375, height: 900 });

const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push("PAGEERROR " + String(e)));

// === 1. 导航入口 ===
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
const navState = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll("header nav a")).map((a) => ({
    href: a.getAttribute("href"),
    label: a.textContent.trim(),
  }));
  return { links, hasCompare: links.some((l) => l.href === "/compare") };
});
check("导航有「对比」入口", navState.hasCompare, navState.links.map((l) => l.label).join(" / "));

// === 2. 对比列表页 ===
await page.goto(`${BASE}/compare`, { waitUntil: "networkidle0" });
const listState = await page.evaluate(() => {
  const text = document.body.textContent || "";
  const items = Array.from(document.querySelectorAll('a[href^="/compare/"]')).map((a) => ({
    href: a.getAttribute("href"),
    title: a.querySelector("h2")?.textContent?.trim() ?? "",
  }));
  const countMatch = text.match(/(\d+)\s*组对比/);
  return {
    items,
    declaredCount: countMatch ? Number(countMatch[1]) : null,
    hasBody: text.includes("横向差异"),
  };
});
check("列表页有分组", listState.items.length >= 8, `${listState.items.length} 组`);
check("列表页声明数量与实际一致", listState.declaredCount === listState.items.length,
  `声明 ${listState.declaredCount} / 实际 ${listState.items.length}`);
check("列表页有说明文字", listState.hasBody);
check("每个分组都有标题", listState.items.every((i) => i.title.length > 0));

// === 3. 对比详情页结构 ===
await page.goto(`${BASE}/compare/antihistamine-gen`, { waitUntil: "networkidle0" });
const detailState = await page.evaluate(() => {
  const text = document.body.textContent || "";
  const dimensionCards = Array.from(document.querySelectorAll("section"))
    .find((s) => s.querySelector("h2")?.textContent?.includes("对比维度"))
    ?.querySelectorAll("div.overflow-hidden") ?? [];
  const firstCard = dimensionCards[0];
  return {
    hasTitle: text.includes("第一代 vs 第二代抗组胺药"),
    hasSummary: text.includes("能不能进脑子"),
    dimensionCount: dimensionCards.length,
    hasTakeaways: text.includes("关键差异"),
    hasScenarios: text.includes("选药场景"),
    hasCardsSection: text.includes("涉及的卡片"),
    firstDimensionLabel: firstCard?.querySelector("p")?.textContent?.trim() ?? "",
    firstDimensionRows: firstCard?.querySelectorAll("li").length ?? 0,
  };
});
check("详情页有标题与摘要", detailState.hasTitle && detailState.hasSummary);
check("详情页有对比维度", detailState.dimensionCount >= 2, `${detailState.dimensionCount} 个维度`);
check("详情页有关键差异", detailState.hasTakeaways);
check("详情页有选药场景", detailState.hasScenarios);
check("详情页有涉及卡片", detailState.hasCardsSection);
check("维度内取值数等于药物数", detailState.firstDimensionRows === 2,
  `${detailState.firstDimensionLabel}: ${detailState.firstDimensionRows} 行`);

// === 4. 色条正确渲染（防回归：divide-* 曾覆盖 border-color）===
const barColors = await page.evaluate(() => {
  const bars = Array.from(
    document.querySelectorAll('span[aria-hidden="true"][class*="absolute"]'),
  );
  return [...new Set(bars.map((b) => getComputedStyle(b).backgroundColor))];
});
check("药物色条有多种颜色", barColors.length >= 2, barColors.join(" | "));
check(
  "色条不是灰色（divide 覆盖回归）",
  barColors.every((c) => !c.includes("223, 229, 236")),
  barColors.join(" | "),
);

// === 5. 三药对比 ===
await page.goto(`${BASE}/compare/antithrombotic`, { waitUntil: "networkidle0" });
const threeState = await page.evaluate(() => {
  const section = Array.from(document.querySelectorAll("section")).find((s) =>
    s.querySelector("h2")?.textContent?.includes("对比维度"),
  );
  const firstCard = section?.querySelector("div.overflow-hidden");
  const colors = Array.from(
    document.querySelectorAll('span[aria-hidden="true"][class*="absolute"]'),
  ).slice(0, 3).map((b) => getComputedStyle(b).backgroundColor);
  return {
    rows: firstCard?.querySelectorAll("li").length ?? 0,
    colors,
    width: { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth },
  };
});
check("三药对比有 3 行", threeState.rows === 3, `${threeState.rows} 行`);
check("三药配色各不相同", new Set(threeState.colors).size === 3, threeState.colors.join(" | "));
check("三药对比无横向溢出", threeState.width.sw <= threeState.width.cw + 1,
  `${threeState.width.cw}/${threeState.width.sw}`);

// === 6. 卡片详情页入口 ===
await page.goto(`${BASE}/cards/chlorpheniramine`, { waitUntil: "networkidle0" });
const cardEntry = await page.evaluate(() => {
  const text = document.body.textContent || "";
  const links = Array.from(document.querySelectorAll('a[href^="/compare/"]')).map((a) =>
    a.getAttribute("href"),
  );
  return { hasSection: text.includes("这味药还在这些对比里"), links };
});
check("卡片详情页有对比入口", cardEntry.hasSection);
check("入口链接指向正确分组", cardEntry.links.includes("/compare/antihistamine-gen"),
  cardEntry.links.join(", "));

// 没有参与对比的卡片不应显示入口；美沙拉嗪已加入消化系统用药组。
await page.goto(`${BASE}/cards/ranitidine`, { waitUntil: "networkidle0" });
const noEntry = await page.evaluate(() =>
  (document.body.textContent || "").includes("这味药还在这些对比里"),
);
check("未参与对比的卡片不显示入口", noEntry === false);

// === 7. 404 处理 ===
// 注意：访问不存在的路由必然产生一条 404 控制台错误，
// 这是浏览器行为而非缺陷。这里先清空错误记录再测，避免污染最后的检查。
const errorsBefore404 = consoleErrors.length;
const notFound = await page.goto(`${BASE}/compare/nonexistent`, { waitUntil: "networkidle0" });
check("不存在的分组返回 404", notFound.status() === 404, `实际 ${notFound.status()}`);
// 丢弃这次 404 产生的错误
consoleErrors.splice(errorsBefore404);

// === 8. 双向导航 ===
await page.goto(`${BASE}/compare/antihistamine-gen`, { waitUntil: "networkidle0" });
const backLinks = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a[href="/compare"]')).length,
);
check("详情页有返回列表链接", backLinks >= 1, `${backLinks} 个`);

// === 9. 深色模式 ===
await page.evaluateOnNewDocument(() => localStorage.setItem("pharmahub-theme", "dark"));
await page.goto(`${BASE}/compare/antihistamine-gen`, { waitUntil: "networkidle0" });
const darkColors = await page.evaluate(() => {
  const bars = Array.from(
    document.querySelectorAll('span[aria-hidden="true"][class*="absolute"]'),
  );
  return [...new Set(bars.map((b) => getComputedStyle(b).backgroundColor))];
});
check("深色模式下色条仍可区分", darkColors.length >= 2, darkColors.join(" | "));

// === 10. 列表中的全部分组都能打开，扩充内容后无需同步硬编码名单 ===
await page.evaluateOnNewDocument(() => localStorage.removeItem("pharmahub-theme"));
const groupIds = listState.items.map((item) => item.href.slice("/compare/".length));
let allOk = true;
const failed = [];
for (const id of groupIds) {
  const res = await page.goto(`${BASE}/compare/${id}`, { waitUntil: "networkidle0" });
  const hasDimensions = await page.evaluate(() =>
    (document.body.textContent || "").includes("对比维度"),
  );
  if (res.status() !== 200 || !hasDimensions) {
    allOk = false;
    failed.push(id);
  }
}
check("列表中的全部分组都能正常打开", allOk,
  failed.length ? failed.join(", ") : `${groupIds.length}/${groupIds.length}`);

// === 11. 控制台错误 ===
check("无控制台错误", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | "));

await browser.close();
console.log(`\n结果: ${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
