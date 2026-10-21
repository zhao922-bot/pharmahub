// 只允许统一验收入口分配的独立服务及临时数据库。
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";
const { baseURL: BASE, dbPath } = getVerificationContext();
const { cardRepository } = await import("../lib/data/cards/index.ts");
const { CATEGORIES } = await import("../lib/data/categories.ts");
const { generateQuiz, generateWrongBookQuiz } = await import("../lib/quiz/generator.ts");
const { hashString } = await import("../lib/quiz/random.ts");
const cards = await cardRepository.getAll();
const added = cards.filter((c) => c.sources?.length);
const categoryNames = new Map(CATEGORIES.map((c) => [c.id, c.name]));
let checks = 0;
const check = (name, ok) => { assert.ok(ok, name); checks++; console.log(`✓ ${name}`); };
const browser = await puppeteer.launch({
  executablePath: resolveBrowserPath(), headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
let db;
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewport({ width: 375, height: 900 });
  const go = (route) => page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  const answer = async (q, correct) => {
    assert.equal(await page.$eval("p.text-\\[15px\\]", (el) => el.textContent), q.prompt);
    const index = q.options.findIndex((o) => correct ? o.id === q.correctOptionId : o.id !== q.correctOptionId);
    await (await page.$$("ul li button"))[index].click();
    await page.waitForSelector('[aria-live="polite"]');
    const feedback = await page.$eval('[aria-live="polite"]', (el) => el.textContent);
    check(`${q.id} 提交与完整解析`, feedback.includes(correct ? "回答正确" : "回答错误") && feedback.includes(q.explanation));
  };
  const next = async () => {
    await page.$eval('[aria-live="polite"] button', (button) => button.click());
    await page.waitForFunction(() => !document.querySelector('[aria-live="polite"]'));
  };
  const questionsFor = (category, seed) => generateQuiz({
    cards: cards.filter((c) => c.category === category), allCards: cards,
    categoryNames, count: 8, seed: seed + hashString(category),
  });
  const findSeed = (card, index = 0) => {
    for (let seed = 1; seed < 10000; seed++) {
      const questions = questionsFor(card.category, seed);
      if (questions[index]?.cardId === card.id) return { seed, questions };
    }
    throw new Error(`未找到 ${card.id} 的固定验收题组`);
  };
  await go("/cards");
  db = new Database(dbPath, { readonly: true, fileMustExist: true });
  check("列表总数与全部卡片一致", (await page.$eval('p[aria-live="polite"]', (el) => el.textContent)).includes(`共 ${cards.length} 张卡片`));
  await mkdir(".preview/card-expansion", { recursive: true });
  await page.screenshot({ path: ".preview/card-expansion/library-mobile.png", fullPage: true });

  for (const card of added) {
    await go(`/cards?category=${card.category}`);
    await page.type("#card-search", card.genericName);
    await page.waitForFunction((id, keyword) =>
      document.querySelector("#card-search")?.value === keyword &&
      document.querySelector('p[aria-live="polite"]')?.textContent.includes("找到") &&
      document.querySelector(`a[href="/cards/${id}"]`),
    {}, card.id, card.genericName);
    check(`${card.id} 分类内搜索可找到并打开`, await page.$(`a[href="/cards/${card.id}"]`) !== null);
    await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click(`a[href="/cards/${card.id}"]`)]);
    const text = await page.$eval("main", (el) => el.textContent);
    check(`${card.id} 正文、图解与核对日期完整`, text.includes(card.memoryTip) &&
      card.mechanismSteps.every((s) => text.includes(s.detail)) && text.includes(card.sourcesCheckedOn) &&
      await page.$("figure svg") !== null && !(await overflow()));
    const sources = await page.$$eval('section[aria-labelledby="sources-heading"] a', (links) =>
      links.map((link) => ({ title: link.textContent, url: link.href, target: link.target, rel: link.rel })));
    check(`${card.id} 参考资料链接完整`, sources.length === card.sources.length &&
      sources.every((s, i) => s.title === card.sources[i].title && s.url === card.sources[i].url &&
        s.target === "_blank" && s.rel.includes("noopener")));
    await page.click('button[aria-label="收藏"]');
    await page.waitForSelector('button[aria-label="已收藏"]');
    await page.evaluate(() => [...document.querySelectorAll("button")]
      .find((b) => b.textContent.includes("记住了") && !b.textContent.includes("没记住")).click());
    await page.waitForFunction(() => document.body.textContent.includes("已记录，"));
    check(`${card.id} 收藏与自评写入临时数据库`,
      !!db.prepare("SELECT card_id FROM favorite WHERE card_id=?").get(card.id) &&
      !!db.prepare("SELECT card_id FROM review_log WHERE card_id=?").get(card.id));
    const { seed, questions } = findSeed(card);
    await go(`/quiz?category=${card.category}&seed=${seed}`);
    await answer(questions[0], false);
    check(`${card.id} 新卡答错进入错题本`, !!db.prepare("SELECT question_id FROM wrong_question WHERE question_id=?").get(questions[0].id));
  }

  // 检查此前发现的适应症歧义在真实页面中的选项和解析。
  const montelukast = added.find((c) => c.id === "montelukast");
  const { seed, questions } = findSeed(montelukast, 2);
  await go(`/quiz?category=respiratory&seed=${seed}`);
  for (let i = 0; i < 2; i++) { await answer(questions[i], true); await next(); }
  const options = await page.$$eval("ul li button", (buttons) => buttons.map((b) => b.textContent));
  check("孟鲁司特适应症界面无过敏性鼻炎假干扰项", options.every((text) => !text.includes("过敏性鼻炎")));
  await answer(questions[2], false);

  const wrong = db.prepare("SELECT question_id AS questionId, card_id AS cardId, kind FROM wrong_question ORDER BY wrong_count DESC, last_wrong_at DESC").all();
  await go("/wrong-book");
  check("新卡片可从错题本回看", (await page.$eval("main", (el) => el.textContent)).includes(montelukast.genericName));
  await go("/quiz/review");
  for (const q of generateWrongBookQuiz({ wrongQuestions: wrong, allCards: cards, categoryNames })) {
    await answer(q, true); await next();
  }
  check("新卡错题重练后正确状态持久化",
    db.prepare("SELECT COUNT(*) n FROM wrong_question WHERE last_correct_at IS NOT NULL").get().n === wrong.length);
  for (const kind of ["quiz", "wrong-book"]) {
    const payload = await (await fetch(`${BASE}/api/export/${kind}?format=json`)).json();
    check(`${kind} 导出保留全部新卡身份`, added.every((c) => payload.records.some((r) => r.cardId === c.id)));
  }
  for (const theme of ["light", "dark"]) {
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);
    for (const id of ["enoxaparin", "pregabalin", "nitrofurantoin"]) {
      await go(`/cards/${id}`);
      check(`${id} 手机 ${theme} 布局无横向溢出`, !(await overflow()));
      await page.screenshot({ path: `.preview/card-expansion/${id}-${theme}-mobile.png`, fullPage: true });
    }
  }
  await page.setViewport({ width: 1280, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
  await go("/cards");
  check("桌面列表无横向溢出", !(await overflow()));
  await page.screenshot({ path: ".preview/card-expansion/library-desktop.png", fullPage: true });
  check("无浏览器运行错误", errors.length === 0);
  console.log(`卡片扩充验收：${checks}/${checks} 通过，覆盖 ${added.length} 张带参考资料的卡片`);
} finally {
  db?.close();
  await browser.close();
}
