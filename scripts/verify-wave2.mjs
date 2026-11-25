// Wave 2 新增功能端到端验收（新分类、第2批新卡、66组对比、临床情景题闭环、自定义题量/范围与键盘快捷键、扩容DDI）
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { CASE_QUESTIONS } from "../lib/data/cases.ts";
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

  const recommendations = 'section[aria-labelledby="mastery-heading"] ol';
  await go("/");
  const fresh = await page.$eval(recommendations, (el) => el.textContent);
  const newCards = await page.$(recommendations + ' a[href*="mode=unlearned"]');
  check("新账户的推荐说明尚未测验", fresh.includes("尚未测验"));
  await newCards.click();
  await page.waitForFunction(() => location.pathname === '/review' && new URLSearchParams(location.search).has('category'));
  check("首页一键进入该系统的未学卡队列", (await page.$eval("main", (el) => el.textContent)).includes("查看机制与答案"));

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

  const firstCase = CASE_QUESTIONS.find((item) => quizText.includes(item.prompt));
  if (!firstCase) throw new Error("未识别页面上的病例");
  const feedback = '[aria-live="polite"]';
  async function checkSources(label) {
    await page.waitForSelector(feedback + ' button');
    const links = await page.$$eval(feedback + ' a', (items) => items.map((a) => ({ url: a.href, title: a.textContent })));
    const text = await page.$eval(feedback, (el) => el.textContent || "");
    check(label, firstCase.sources.every((source) =>
      links.some((a) => a.url === source.url && a.title.includes(source.title)) && text.includes(source.sections),
    ) && text.includes(firstCase.sourcesCheckedOn));
  }
  const options = await page.$$eval('ul li button', (items) => items.map((b) => b.textContent || ""));
  const wrongIndex = options.findIndex((text) => text.includes(firstCase.distractors[0]));
  if (wrongIndex < 0) throw new Error("未找到该病例的干扰项");
  await page.keyboard.press(String(wrongIndex + 1));
  await checkSources("首次作答后显示本题全部来源、章节和核对日期");
  const hasCardLink = (await page.$('[aria-live="polite"] a[href^="/cards/"]')) !== null;
  check("情景题作答后显示关联药物卡片链接", hasCardLink);
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => !document.querySelector('[aria-live="polite"]'));
  check(
    "作答后按 Enter 切换到下一题",
    (await page.$eval("main", (el) => el.textContent || "")).includes("第 2 / 5 题"),
  );

  const caseWrongRow = db.prepare("SELECT question_id FROM wrong_question WHERE kind = 'case'").get();
  check("情景题答错写入对应的错题记录", caseWrongRow?.question_id === "case:" + firstCase.id);

  await go("/wrong-book");
  const wrongText = await page.$eval("main", (el) => el.textContent || "");
  check("错题本显示「临床情景」标签", wrongText.includes("临床情景"));

  await go("/quiz/review");
  const reviewPrompt = await page.$eval("p.text-\\[15px\\]", (el) => el.textContent || "");
  check("错题重练能精确重建情景题", reviewPrompt === firstCase.prompt);
  await page.keyboard.press(String(wrongIndex + 1));
  await checkSources("错题重练后显示同一病例的全部依据");

  for (const kind of ["quiz", "wrong-book"]) {
    const csv = await (await fetch(`${BASE}/api/export/${kind}?format=csv`)).text();
    const json = await (await fetch(`${BASE}/api/export/${kind}?format=json`)).json();
    check(
      `${kind} 导出含情景题与「临床情景」标签`,
      csv.includes("临床情景") && json.records.some((r) => r.kindLabel === "临床情景"),
    );
  }

  const quizExportUrl = BASE + "/api/export/quiz?format=json";
  const quizBackup = await (await fetch(quizExportUrl)).json();
  for (const run of [1, 2]) {
    const response = await fetch(BASE + "/api/import", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(quizBackup),
    });
    const summary = await response.json();
    check("测验备份第 " + run + " 次导回原库均跳过已有作答", response.ok && summary.skipped === quizBackup.count && summary.inserted === 0);
  }
  const afterRestore = await (await fetch(quizExportUrl)).json();
  check("重新导出后作答内容和条数保持一致", JSON.stringify(afterRestore.records) === JSON.stringify(quizBackup.records));

  await go("/");
  const weakCategoryLink = await page.$(recommendations + ' a[href="/quiz?category=' + firstCase.category + '"]');
  check("已答错的系统在首页有专项测验入口", Boolean(weakCategoryLink));
  if (weakCategoryLink) {
    await weakCategoryLink.click();
    await page.waitForFunction((category) => location.pathname === '/quiz' && new URLSearchParams(location.search).get('category') === category, {}, firstCase.category);
    check("点击推荐后直接进入该系统测验", Boolean(await page.waitForSelector('[role="progressbar"]')));
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
