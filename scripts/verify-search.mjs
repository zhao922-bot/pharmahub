// 搜索增强端到端验证
import puppeteer from "puppeteer-core";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE } = getVerificationContext();
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

async function search(query) {
  await page.goto(`${BASE}/cards`, { waitUntil: "networkidle0" });
  const input = await page.$("#card-search");
  await input.click({ clickCount: 3 });
  await page.keyboard.press("Backspace");
  if (query) await page.keyboard.type(query, { delay: 8 });
  await new Promise(r => setTimeout(r, 700));
  return page.evaluate(() => {
    const items = Array.from(document.querySelectorAll("ul li")).map(li => {
      const name = li.querySelector("h3")?.textContent?.trim() || "";
      const snippet = li.querySelector(".border-primary\\/15 p")?.textContent?.trim() || "";
      const fieldLabel = li.querySelector(".border-primary\\/15 span")?.textContent?.trim() || "";
      const marks = Array.from(li.querySelectorAll("mark")).map(m => m.textContent);
      return { name, snippet, fieldLabel, marks };
    });
    const countText = document.querySelector('p[aria-live="polite"]')?.textContent?.trim() || "";
    return { items, countText };
  });
}

// 1. 按机制步骤正文搜索（旧实现做不到）
const r1 = await search("cAMP");
check("按机制步骤正文搜索命中", r1.items.length > 0, `命中 ${r1.items.length} 张：${r1.items.map(i=>i.name).join("、")}`);

// 注意：不能断言「首条命中一定是机制字段」。
// 靶点权重（60）高于机制（40），如果某张卡片的靶点正文里也含关键词，
// 它本来就会排在机制命中前面——这是设计意图，不是 bug。
// 这里改为：结果中至少有一条是机制命中，且每条都带字段标签。
check(
  "结果中含机制字段命中",
  r1.items.some((i) => i.fieldLabel.includes("机制")),
  r1.items.map((i) => `${i.name}:${i.fieldLabel}`).join(" | "),
);
check(
  "每条结果都有命中字段标签",
  r1.items.every((i) => i.fieldLabel.length > 0),
  r1.items.map((i) => i.fieldLabel).join(" | "),
);
check("高亮命中词", (r1.items[0]?.marks || []).some(m => m.toLowerCase().includes("camp")), (r1.items[0]?.marks||[]).join("|"));

// 2. 按不良反应搜索
const r2 = await search("乳酸性酸中毒");
check("按不良反应搜索命中", r2.items.some(i => i.name === "二甲双胍"), r2.items.map(i=>i.name).join("、"));
check("不良反应字段标签", r2.items[0]?.fieldLabel.includes("不良反应"), r2.items[0]?.fieldLabel || "");

// 3. 希腊字母与英文互搜
const rGreek = await search("β1");
const rAscii = await search("beta1");
check("β1 与 beta1 结果一致",
  JSON.stringify(rGreek.items.map(i=>i.name)) === JSON.stringify(rAscii.items.map(i=>i.name)),
  `β1=${rGreek.items.length} beta1=${rAscii.items.length}`);

// 4. 繁体输入
const rTrad = await search("受體");
check("繁体输入能搜到简体内容", rTrad.items.length > 0, `命中 ${rTrad.items.length} 张`);

// 5. 按记忆要点搜索
const r5 = await search("让肝以为能量不够");
check("按记忆要点搜索命中", r5.items.some(i => i.name === "二甲双胍"), r5.items.map(i=>i.name).join("、"));

// 6. 多词 AND
const r6 = await search("阻断 受体");
const r6b = await search("阻断");
check("多词 AND 结果不多于单词结果", r6.items.length <= r6b.items.length, `${r6.items.length} <= ${r6b.items.length}`);

// 7. 空结果
const r7 = await search("zzzz不存在");
check("无匹配显示空状态", r7.items.length === 0, r7.countText);

// 8. 清空恢复
const r8 = await search("");
check("清空搜索恢复全部", r8.items.length > 0, r8.countText);

// 9. 搜索提示可见
const hintVisible = await page.evaluate(() => document.body.textContent.includes("可以搜什么"));
check("无关键词时显示搜索范围提示", hintVisible);

await browser.close();
console.log(`\n结果: ${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
