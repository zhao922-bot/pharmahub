/**
 * 卡片库交互验收。
 *
 * 检查搜索与筛选的真实行为。所有数量断言都从**页面自身**读取基准
 * （「全部 N」角标），不写死数字——卡片会持续增加，写死等于给未来埋雷。
 * 早先版本写死 20 张，扩到 42 张后 4 项断言集体失效，就是这个问题。
 *
 * 用法：先 pnpm build，再 pnpm verify -- verify-interactions
 */
import puppeteer from "puppeteer-core";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE } = getVerificationContext();
const CHROME = resolveBrowserPath();

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812 });

const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

await page.goto(`${BASE}/cards`, { waitUntil: "networkidle0" });

const countItems = () => page.$$eval("main ul li", (els) => els.length);

/** 从「全部 N」角标读出卡片总数 */
async function readTotal() {
  return page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button[aria-pressed]"));
    const all = buttons.find((b) => b.textContent?.trim().startsWith("全部"));
    const match = all?.textContent?.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  });
}

/** 可靠地清空搜索框：直接设值并派发 input，触发 React 的 onChange */
async function clearSearch() {
  await page.evaluate(() => {
    const input = document.querySelector("#card-search");
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set;
    setter.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 250));
}

async function search(term) {
  await clearSearch();
  await page.type("#card-search", term);
  await new Promise((r) => setTimeout(r, 350));
  return countItems();
}

// 0. 先读基准总数
const total = await readTotal();
check("能读到卡片总数", total > 0, `共 ${total} 张`);

// 1. 初始显示全部
const initial = await countItems();
check("初始显示全部卡片", initial === total, `实际 ${initial} / ${total}`);

// 2. 搜索药名片段
// 不断言具体命中数：搜索是全字段的，「他汀」除了命中阿托伐他汀的通用名，
// 还会命中其他卡片机制正文里提到的「他汀」（如氟康唑讲药物相互作用那段）。
// 命中数随内容增长是正常现象，这里只验证「能搜到且少于全部」。
const afterSearch = await search("他汀");
check(
  "搜索药名片段「他汀」能命中且已收窄",
  afterSearch >= 1 && afterSearch < total,
  `命中 ${afterSearch} / ${total}`,
);

// 3. 搜索英文名
const afterEn = await search("metformin");
check("搜索英文名 metformin 得到 1 张", afterEn === 1, `实际 ${afterEn}`);

// 4. 搜索靶点关键词（不写死数量，只要求至少命中且包含预期药物）
const afterTarget = await search("质子泵");
const targetNames = await page.$$eval("main ul li h3", (els) =>
  els.map((e) => e.textContent?.trim() ?? ""),
);
check(
  "搜索靶点「质子泵」命中含奥美拉唑",
  afterTarget >= 1 && targetNames.includes("奥美拉唑"),
  `命中 ${afterTarget} 张：${targetNames.join("、")}`,
);

// 5. 搜索非首条适应症（验证全量适应症检索）
// 注意：不要断言具体命中数。卡片扩充后会有多张卡片都有「糖尿病肾病」，
// 断言固定数字会让测试随内容变化而失效。这里只验证「能搜到」。
const afterIndication = await search("糖尿病肾病");
check(
  "搜索非首条适应症「糖尿病肾病」能命中",
  afterIndication >= 1,
  `命中 ${afterIndication} 张`,
);

// 6. 搜索商品名
const afterBrand = await search("倍他乐克");
check("搜索商品名「倍他乐克」得到 1 张", afterBrand === 1, `实际 ${afterBrand}`);

// 7. 搜索机制步骤正文（搜索增强新增能力）
const afterMechanism = await search("腺苷酸环化酶");
const mechanismNames = await page.$$eval("main ul li h3", (els) =>
  els.map((e) => e.textContent?.trim() ?? ""),
);
check(
  "搜索机制步骤正文命中",
  afterMechanism >= 1 && mechanismNames.includes("美托洛尔"),
  `命中 ${afterMechanism} 张：${mechanismNames.join("、")}`,
);

// 8. 搜索不良反应（搜索增强新增能力）
const afterAdverse = await search("乳酸性酸中毒");
const adverseNames = await page.$$eval("main ul li h3", (els) =>
  els.map((e) => e.textContent?.trim() ?? ""),
);
check(
  "搜索不良反应命中二甲双胍",
  afterAdverse >= 1 && afterAdverse < total && adverseNames.includes("二甲双胍"),
  `命中 ${afterAdverse} 张：${adverseNames.join("、")}`,
);

// 9. 清空恢复
await clearSearch();
const afterClear = await countItems();
check("清空搜索后恢复全部", afterClear === total, `实际 ${afterClear} / ${total}`);

// 10. 分类筛选：抗菌药物（数量从角标读取，不写死）
const expectedAntibacterial = await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll("button[aria-pressed]"));
  const target = buttons.find((b) => b.textContent?.includes("抗菌药物"));
  const match = target?.textContent?.match(/(\d+)/);
  return match ? Number(match[1]) : -1;
});

const clicked = await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll("button[aria-pressed]"));
  const target = buttons.find((b) => b.textContent?.includes("抗菌药物"));
  if (target) {
    target.click();
    return true;
  }
  return false;
});
await new Promise((r) => setTimeout(r, 350));
const afterCategory = await countItems();
check(
  "筛选「抗菌药物」数量与角标一致",
  clicked && afterCategory === expectedAntibacterial,
  `实际 ${afterCategory} / 角标 ${expectedAntibacterial}`,
);

// 11. 空结果
await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll("button[aria-pressed]"));
  const target = buttons.find((b) => b.textContent?.trim().startsWith("全部"));
  if (target) target.click();
});
await page.type("#card-search", "zzzzzz");
await new Promise((r) => setTimeout(r, 350));
const emptyState = await page.evaluate(() =>
  document.body.textContent?.includes("没有匹配的卡片"),
);
check("无结果时显示空状态", Boolean(emptyState));

// 12. 详情页跳转
await page.goto(`${BASE}/cards`, { waitUntil: "networkidle0" });
await page.click("main ul li a");
await page.waitForNavigation({ waitUntil: "networkidle0" });
const url = page.url();
check("点击卡片可跳转详情页", url.includes("/cards/"), url);

// 13. 上一张/下一张导航
const navLinks = await page.$$eval('nav[aria-label="卡片导航"] a', (els) =>
  els.map((e) => e.getAttribute("href")),
);
check("详情页有相邻卡片导航", navLinks.length > 0, navLinks.join(", "));

// 14. 不良反应折叠面板
const accordionState = await page.evaluate(() => {
  const trigger = document.querySelector("[data-state]");
  return trigger ? trigger.getAttribute("data-state") : "none";
});
check("不良反应折叠面板存在", accordionState !== "none", `state=${accordionState}`);

console.log(`\n结果: ${results.filter((r) => r.pass).length}/${results.length} 通过`);
await browser.close();
process.exit(results.every((r) => r.pass) ? 0 : 1);
