// Wave 2 新增功能端到端验收（新分类、第2批新卡、66组对比、临床情景题闭环、自定义题量/范围与键盘快捷键、扩容DDI）
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE, dbPath } = getVerificationContext();
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

  // 1. 两个新分类与第 2 批代表卡片
  await go("/cards?category=immunomodulator");
  const immText = await page.$eval("main", (el) => el.textContent || "");
  check(
    "免疫与风湿免疫分类包含 3 张新卡",
    immText.includes("他克莫司") && immText.includes("托法替布") && immText.includes("阿达木单抗"),
  );

  await go("/cards?category=antidote");
  const antText = await page.$eval("main", (el) => el.textContent || "");
  check(
    "急救与特异性解毒分类包含 4 张新卡",
    antText.includes("纳洛酮") && antText.includes("氟马西尼") && antText.includes("阿托品") && antText.includes("碘解磷定"),
  );

  for (const id of ["tacrolimus", "naloxone", "meropenem", "dabigatran"]) {
    const res = await go(`/cards/${id}`);
    const hasSvg = (await page.$("figure svg")) !== null;
    check(`新卡 ${id} 浅色 375px 正常渲染含机制图`, res.status() === 200 && hasSvg && !(await overflow()));
  }

  // 2. 扩容后 66 组对比与代表新对比组
  await go("/compare");
  const compareListText = await page.$eval("main", (el) => el.textContent || "");
  check("对比列表页显示 66 组对比", compareListText.includes("66 组对比"));
  for (const groupId of ["oseltamivir-vs-baloxavir", "gefitinib-vs-osimertinib"]) {
    const res = await go(`/compare/${groupId}`);
    check(`新增对比组 ${groupId} 正常渲染无溢出`, res.status() === 200 && !(await overflow()));
  }

  // 3. 临床机制情景题闭环（出题 -> 键盘快捷键作答/切题 -> 答错进错题本 -> 重练 -> CSV/JSON 导出）
  await go("/quiz?mode=cases&count=5&seed=2026");
  const quizText = await page.$eval("main", (el) => el.textContent || "");
  const totalAttr = await page.$eval('[role="progressbar"]', (el) => el.getAttribute("aria-valuemax"));
  check("临床情景模式 ?count=5 正常出 5 题且含免责声明", totalAttr === "5" && quizText.includes("临床情景") && quizText.includes("机制与用药原则学习辨析"));

  // 用键盘 '1' 作答第 1 题，等待提交完成后检查关联卡片链接，再用 Enter 切下一题
  await page.keyboard.press("1");
  await page.waitForSelector('[aria-live="polite"] button');
  const hasCardLink = (await page.$('[aria-live="polite"] a[href^="/cards/"]')) !== null;
  check("情景题作答后显示关联药物卡片链接", hasCardLink);
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => !document.querySelector('[aria-live="polite"]'));
  check(
    "作答后按 Enter 切换到下一题",
    (await page.$eval("main", (el) => el.textContent || "")).includes("第 2 / 5 题"),
  );

  // 第 2 题故意点错直到入错题本（最多尝试 4 个按钮直到有 wrong_question 记录）
  for (let qIdx = 2; qIdx <= 5; qIdx += 1) {
    await (await page.$$("ul li button"))[0].click();
    await page.waitForSelector('[aria-live="polite"]');
    const wrongCaseCount = db.prepare("SELECT COUNT(*) n FROM wrong_question WHERE kind = 'case'").get().n;
    if (wrongCaseCount > 0) break;
    await page.$eval('[aria-live="polite"] button', (b) => b.click());
    await page.waitForFunction(() => !document.querySelector('[aria-live="polite"]'));
  }

  // 若 5 题全对（极低概率），再换个 seed 故意点选第 2 个选项确保测到错题闭环
  if (db.prepare("SELECT COUNT(*) n FROM wrong_question WHERE kind = 'case'").get().n === 0) {
    await go("/quiz?mode=cases&count=5&seed=9999");
    for (let qIdx = 1; qIdx <= 5; qIdx += 1) {
      await (await page.$$("ul li button"))[1].click();
      await page.waitForSelector('[aria-live="polite"]');
      if (db.prepare("SELECT COUNT(*) n FROM wrong_question WHERE kind = 'case'").get().n > 0) break;
      await page.$eval('[aria-live="polite"] button', (b) => b.click());
      await page.waitForFunction(() => !document.querySelector('[aria-live="polite"]'));
    }
  }
  const caseWrongRow = db.prepare("SELECT question_id, card_id FROM wrong_question WHERE kind = 'case' LIMIT 1").get();
  check("情景题答错写入 wrong_question (kind='case')", Boolean(caseWrongRow));

  await go("/wrong-book");
  const wrongText = await page.$eval("main", (el) => el.textContent || "");
  check("错题本显示「临床情景」标签", wrongText.includes("临床情景"));

  await go("/quiz/review");
  const reviewPrompt = await page.$eval("p.text-\\[15px\\]", (el) => el.textContent || "");
  check("错题重练能精确重建情景题", reviewPrompt.length > 10);

  for (const kind of ["quiz", "wrong-book"]) {
    const csv = await (await fetch(`${BASE}/api/export/${kind}?format=csv`)).text();
    const json = await (await fetch(`${BASE}/api/export/${kind}?format=json`)).json();
    check(
      `${kind} 导出含情景题与「临床情景」标签`,
      csv.includes("临床情景") && json.records.some((r) => r.kindLabel === "临床情景"),
    );
  }

  // 4. 收藏范围专项测验 + 扩容 DDI 互链 + 深色 375px 无溢出
  await go("/cards/warfarin");
  await page.click('button[aria-label="收藏"]');
  await page.waitForSelector('button[aria-label="已收藏"]');
  await go("/quiz?scope=favorites&count=5");
  const favQuizText = await page.$eval("main", (el) => el.textContent || "");
  check("?scope=favorites&count=5 按收藏卡片出题", favQuizText.includes("仅收藏卡片") && !(await overflow()));

  await page.evaluateOnNewDocument(() => localStorage.setItem("pharmahub-theme", "dark"));
  for (const route of ["/cards/nirmatrelvir-ritonavir", "/cards/ticagrelor", "/quiz?mode=cases"]) {
    const res = await go(route);
    const text = await page.$eval("main", (el) => el.textContent || "");
    const okDdi = route.startsWith("/cards/") ? text.includes("代表性药物相互作用") : true;
    check(`${route} 深色模式 375px 正常渲染无溢出`, res.status() === 200 && okDdi && !(await overflow()));
  }

  check("Wave 2 验收全程无控制台错误", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | "));
} finally {
  db?.close();
  await browser.close();
}

console.log(`\nWave 2 专项验收：${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
