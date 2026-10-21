// 必须通过 pnpm verify -- verify-compare-quiz；只使用入口分配的临时数据库。
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE, dbPath } = getVerificationContext();
// 类型源码在隔离入口启用 strip-types 后加载；直接执行先被上面的保护拒绝。
const { COMPARE_GROUPS } = await import("../lib/data/compares.ts");
const { cardRepository } = await import("../lib/data/cards/index.ts");
const { CATEGORIES } = await import("../lib/data/categories.ts");
const { generateCompareQuiz } = await import("../lib/quiz/compare-generator.ts");
const { generateQuiz, generateWrongBookQuiz } = await import("../lib/quiz/generator.ts");
const { hashString } = await import("../lib/quiz/random.ts");
const { quiz: quizCopy } = await import("../lib/copy.ts");
const cards = await cardRepository.getAll();
const categoryNames = new Map(CATEGORIES.map((c) => [c.id, c.name]));
const SEED = 137;
const expansionIds = [
  "loop-vs-thiazide", "glucose-lowering-strategies",
  "analgesic-cox-selectivity", "phenytoin-vs-valproate",
  "metoprolol-vs-amlodipine", "common-antibiotic-targets",
  "omeprazole-vs-sucralfate", "domperidone-vs-ondansetron",
  "penicillin-g-vs-vancomycin", "morphine-vs-loperamide",
  "levothyroxine-vs-methimazole", "nitroglycerin-vs-metoprolol",
  "gentamicin-vs-azithromycin", "digoxin-vs-metoprolol",
  "aminophylline-vs-salbutamol", "cisplatin-vs-fluorouracil",
  "diazepam-vs-phenytoin", "metronidazole-vs-levofloxacin",
  "dexamethasone-vs-ibuprofen", "trastuzumab-vs-gefitinib",
  "atorvastatin-vs-aspirin", "ceftriaxone-vs-gentamicin",
  "levodopa-vs-haloperidol", "fluoxetine-vs-diazepam",
  "sertraline-vs-chlorpromazine", "mesalazine-vs-omeprazole",
  "indomethacin-vs-celecoxib", "imatinib-vs-gefitinib",
];
const expansionGroups = expansionIds.map((id) => {
  const group = COMPARE_GROUPS.find((g) => g.id === id);
  assert.ok(group, `缺少新增组 ${id}`);
  return group;
});
let checked = 0;
const check = (name, ok) => { assert.ok(ok, name); checked++; console.log(`✓ ${name}`); };
const db = new Database(dbPath);
const browser = await puppeteer.launch({
  executablePath: resolveBrowserPath(), headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 900 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let actionId;
  page.on("request", (request) => {
    if (request.headers()["next-action"]) actionId = request.headers()["next-action"];
  });
  const go = (url) => page.goto(`${BASE}${url}`, { waitUntil: "networkidle0" });
  const snapshot = () => page.evaluate(() => ({
    prompt: document.querySelector("p.text-\\[15px\\]")?.textContent,
    options: [...document.querySelectorAll("ul li button")].map((b) => b.textContent.trim()),
    total: Number(document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuemax")),
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  const expectedFor = (group) => generateCompareQuiz({
    group, allCards: cards, count: 8, seed: SEED + hashString(group.id),
  });
  const answer = async (question, correct) => {
    const before = await snapshot();
    assert.equal(before.prompt, question.prompt);
    const index = question.options.findIndex((o) =>
      correct ? o.id === question.correctOptionId : o.id !== question.correctOptionId);
    await (await page.$$("ul li button"))[index].click();
    await page.waitForSelector('[aria-live="polite"]');
    const feedback = await page.$eval('[aria-live="polite"]', (el) => el.textContent);
    assert.ok(feedback.includes(correct ? "回答正确" : "回答错误"));
    assert.ok(feedback.includes(question.explanation), `${question.id} 保留完整解析`);
    assert.ok(!(await snapshot()).overflow, `${question.id} 解析无横向溢出`);
    const contrastRatios = await page.$$eval(
      '[aria-live="polite"] p, [aria-live="polite"] span.font-semibold',
      (elements) => {
        const rgba = (color) => color.match(/[\d.]+/g).map(Number);
        const blend = (front, back) => front.slice(0, 3)
          .map((channel, i) => channel * (front[3] ?? 1) + back[i] * (1 - (front[3] ?? 1)));
        const luminance = (rgb) => rgb.map((value) => {
          const v = value / 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        }).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
        return elements.map((element) => {
          const ancestors = [];
          for (let node = element; node; node = node.parentElement) ancestors.unshift(node);
          const background = ancestors.reduce((color, node) =>
            blend(rgba(getComputedStyle(node).backgroundColor), color), [255, 255, 255]);
          const foreground = blend(rgba(getComputedStyle(element).color), background);
          const [min, max] = [luminance(background), luminance(foreground)].sort((a, b) => a - b);
          return (max + 0.05) / (min + 0.05);
        });
      },
    );
    assert.ok(contrastRatios.every((ratio) => ratio >= 4.5),
      `${question.id} 解析文字对比度至少 4.5:1，实际 ${contrastRatios.map((v) => v.toFixed(2))}`);
  };
  const next = async () => {
    await page.$eval('[aria-live="polite"] button', (button) => button.click());
    await page.waitForFunction(() => !document.querySelector('[aria-live="polite"]'));
  };

  for (const group of COMPARE_GROUPS) {
    await go(`/compare/${group.id}`);
    check(`${group.id} 对比页提供练习入口`,
      await page.$(`a[href="/quiz?compare=${group.id}"]`) !== null);
    if (expansionIds.includes(group.id)) {
      const sources = await page.$$eval('section[aria-labelledby="sources-heading"] a',
        (links) => links.map((link) => ({ title: link.textContent, url: link.href })));
      check(`${group.id} 资料链接完整且包含核对日期`,
        JSON.stringify(sources) === JSON.stringify(group.sources.map(({ title, url }) => ({ title, url }))) &&
        (await page.$eval("main", (el) => el.textContent)).includes(group.sourcesCheckedOn));
      check(`${group.id} 对比详情手机无横向溢出`, !(await snapshot()).overflow);
    }
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click(`a[href="/quiz?compare=${group.id}"]`),
    ]);
    check(`${group.id} 点击入口进入本组测验`, page.url().includes(`compare=${group.id}`));
    await go(`/quiz?compare=${group.id}&seed=${SEED}`);
    const state = await snapshot();
    check(`${group.id} 题量与选项匹配本组且手机无横向溢出`,
      state.total === expectedFor(group).length &&
      state.options.length === group.drugIds.length && !state.overflow);
    const active = await page.$$eval('main a[aria-current="page"]',
      (links) => links.map((link) => link.getAttribute("href")));
    check(`${group.id} 只高亮当前对比组`,
      active.length === 1 && active[0] === `/quiz?compare=${group.id}`);
    await page.reload({ waitUntil: "networkidle0" });
    check(`${group.id} 刷新原题与选项不变`, JSON.stringify(await snapshot()) === JSON.stringify(state));
  }

  const firstGroup = COMPARE_GROUPS[0];
  const firstQuestion = expectedFor(firstGroup)[0];
  await go(`/quiz?compare=${firstGroup.id}&seed=${SEED}`);
  // 暂停真实答案请求，保证慢网络下不会提前显示判定或进入下一题。
  await page.setRequestInterception(true);
  let releaseRequest;
  const held = new Promise((resolve) => { releaseRequest = resolve; });
  const hold = (request) => {
    if (request.headers()["next-action"]) releaseRequest(request);
    else void request.continue();
  };
  page.on("request", hold);
  await (await page.$$("ul li button"))[0].click();
  const heldRequest = await held;
  check("提交期间选项锁定且不显示判定与下一题", await page.evaluate(() =>
    !document.querySelector('[aria-live="polite"]') &&
    [...document.querySelectorAll("ul li button")].every((button) => button.disabled)));
  // 让服务器拒绝这次请求，验证失败恢复而不写入损坏记录。
  const rejectedBody = JSON.stringify([{
    questionId: firstQuestion.id, cardId: firstQuestion.cardId, kind: "compare",
    selectedId: "drug-forged", correctId: firstQuestion.correctOptionId,
  }]);
  await heldRequest.continue({ postData: rejectedBody });
  page.off("request", hold);
  await page.setRequestInterception(false);
  await page.waitForFunction((message) => document.body.textContent.includes(message), {}, quizCopy.answerInvalid);
  check("服务端拒绝后可重试且没有写库", await page.$("ul li button:not([disabled])") !== null &&
    db.prepare("SELECT COUNT(*) n FROM quiz_attempt").get().n === 0);

  // 保留旧两药组、三药组回归，并完整答完扩充组，覆盖其错题与解析链路。
  for (const group of [firstGroup, COMPARE_GROUPS.find((g) => g.drugIds.length === 3), ...expansionGroups]) {
    await go(`/quiz?compare=${group.id}&seed=${SEED}`);
    const questions = expectedFor(group);
    for (const question of questions) {
      await answer(question, false);
      check(`${question.id} 解析回链可用`,
        await page.$(`[aria-live="polite"] a[href="/compare/${group.id}"]`) !== null);
      await next();
    }
    check(`${group.id} 完成整组`, (await page.$eval("main", (el) => el.textContent)).includes("本组测验完成"));
    const retry = await page.$eval(`a[href*="compare=${group.id}&seed="]`, (el) => el.getAttribute("href"));
    check(`${group.id} 再来一组保留分组并更换种子`, retry === `/quiz?compare=${group.id}&seed=${SEED + 1}`);
    await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click(`a[href="${retry}"]`)]);
    check(`${group.id} 同页重开重置到第一题`,
      await page.$eval('[role="progressbar"]', (el) => el.getAttribute("aria-valuenow")) === "0");
  }
  // 伪造参数直接发向同一 server action，必须拒绝且不得增加答题记录。
  const attemptCount = db.prepare("SELECT COUNT(*) n FROM quiz_attempt").get().n;
  for (const patch of [
    { cardId: "metoprolol" }, { correctId: "forged" },
    { questionId: firstQuestion.id + ":forged" }, { kind: "target" },
  ]) {
    const body = await page.evaluate(async ({ actionId, input }) => {
      const response = await fetch(location.href, {
        method: "POST",
        headers: { "Next-Action": actionId, "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify([input]),
      });
      return response.text();
    }, { actionId, input: {
      questionId: firstQuestion.id, cardId: firstQuestion.cardId,
      selectedId: firstQuestion.correctOptionId, correctId: firstQuestion.correctOptionId,
      kind: "compare", ...patch,
    } });
    check(`篡改 ${Object.keys(patch)[0]} 被服务器拒绝`,
      body.includes('"ok":false') &&
      db.prepare("SELECT COUNT(*) n FROM quiz_attempt").get().n === attemptCount);
  }

  await go(`/quiz?compare=${firstGroup.id}&seed=${SEED}`);
  await answer(firstQuestion, false);
  check("同一原题重复答错累加而不重复建档",
    db.prepare("SELECT wrong_count n FROM wrong_question WHERE question_id=?").get(firstQuestion.id).n === 2);

  // 添加一条通过界面产生的普通错题，检查新旧题混合重练。
  await go(`/quiz?category=cardiovascular&seed=${SEED}`);
  const normal = generateQuiz({
    cards: cards.filter((c) => c.category === "cardiovascular"),
    allCards: cards, categoryNames, count: 8, seed: SEED + hashString("cardiovascular"),
  })[0];
  await answer(normal, false);
  const wrongRecords = db.prepare(`SELECT question_id AS questionId, card_id AS cardId,
    kind FROM wrong_question ORDER BY wrong_count DESC, last_wrong_at DESC`).all();
  await go("/wrong-book");
  check("错题本显示对比题标签、原组与维度",
    (await page.$eval("main", (el) => el.textContent)).includes(firstQuestion.comparison.dimension) &&
    await page.$(`main a[href="/compare/${firstGroup.id}"]`) !== null);
  for (const group of expansionGroups) {
    check(`${group.id} 全部新维度进入错题本并可回看对比`,
      expectedFor(group).every((q) => wrongRecords.some((record) => record.questionId === q.id)) &&
      await page.$(`main a[href="/compare/${group.id}"]`) !== null);
  }
  await go("/quiz/review");
  const reviewQuestions = generateWrongBookQuiz({
    wrongQuestions: wrongRecords, allCards: cards, categoryNames, compareGroups: COMPARE_GROUPS,
  });
  for (const question of reviewQuestions) { await answer(question, true); await next(); }
  check("新旧错题均原题重练成功，保留记录并标记已答对",
    db.prepare("SELECT COUNT(*) n FROM wrong_question WHERE last_correct_at IS NOT NULL").get().n === wrongRecords.length);
  await page.evaluate(() => [...document.querySelectorAll("main button, main a")]
    .find((element) => element.textContent.trim() === "再练一遍").click());
  await page.waitForSelector('[role="progressbar"]', { timeout: 5000 });
  check("错题重练完成后可直接再练一遍",
    await page.$eval('[role="progressbar"]', (el) => el.getAttribute("aria-valuenow")) === "0");
  const beforeRetry = db.prepare("SELECT COUNT(*) n FROM quiz_attempt").get().n;
  await answer(reviewQuestions[0], true);
  check("再次重练仍能正确提交答案",
    db.prepare("SELECT COUNT(*) n FROM quiz_attempt").get().n === beforeRetry + 1);

  for (const kind of ["quiz", "wrong-book"]) {
    const exported = await (await fetch(`${BASE}/api/export/${kind}?format=json`)).json();
    check(`${kind} JSON 导出保留对比题身份与中文标签`,
      exported.records.some((r) => r.questionId === firstQuestion.id && r.kindLabel === "同类药对比"));
    check(`${kind} JSON 导出包含扩充组的全部原题`,
      expansionGroups.flatMap(expectedFor).every((q) =>
        exported.records.some((r) => r.questionId === q.id && r.kindLabel === "同类药对比")));
    const csv = await (await fetch(`${BASE}/api/export/${kind}?format=csv`)).text();
    check(`${kind} CSV 导出包含对比题`, csv.includes(firstQuestion.id) && csv.includes("同类药对比"));
    check(`${kind} CSV 导出包含扩充组的全部原题`,
      expansionGroups.flatMap(expectedFor).every((q) => csv.includes(q.id)));
  }
  await go(`/quiz?compare=${firstGroup.id}&category=nervous&seed=${SEED}`);
  check("同时指定组和分类时只考指定组", (await snapshot()).prompt === firstQuestion.prompt);
  for (const query of ["compare=missing", "compare="]) {
    const response = await go(`/quiz?${query}`);
    check(`无效参数 ${query} 返回不存在页面`, response.status() === 404 ||
      (await page.$eval("body", (el) => el.textContent)).includes("页面不存在"));
  }
  // 切换分组时不能沿用上一组答题索引。
  await go(`/quiz?compare=${firstGroup.id}&seed=${SEED}`);
  await answer(firstQuestion, true);
  await next();
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click(`a[href="/quiz?compare=${COMPARE_GROUPS[1].id}"]`),
  ]);
  check("切换对比组重置进度", await page.$eval('[role="progressbar"]',
    (el) => el.getAttribute("aria-valuenow")) === "0");
  await mkdir(".preview", { recursive: true });
  await page.screenshot({ path: ".preview/compare-quiz-mobile.png", fullPage: true });
  await page.setViewport({ width: 1280, height: 900 });
  await page.screenshot({ path: ".preview/compare-quiz-desktop.png", fullPage: true });
  check("桌面无横向溢出", !(await snapshot()).overflow);
  // 新增内容在窄屏、桌面与深色模式下检查布局，并保存可人工复核的截图。
  for (const [width, theme] of [[320, "light"], [1280, "dark"]]) {
    await page.setViewport({ width, height: 900 });
    await page.evaluate((value) => localStorage.setItem("pharmahub-theme", value), theme);
    for (const group of expansionGroups) {
      await go(`/compare/${group.id}`);
      assert.equal(await page.$eval("html", (el) => el.classList.contains("dark")), theme === "dark");
      check(`${group.id} ${width}px ${theme} 详情无溢出`, !(await snapshot()).overflow);
      await page.screenshot({ path: `.preview/${group.id}-${width}-${theme}-detail.png`, fullPage: true });
      await go(`/quiz?compare=${group.id}&seed=${SEED}`);
      await answer(expectedFor(group)[0], true);
      check(`${group.id} ${width}px ${theme} 测验完整解析可读`, !(await snapshot()).overflow);
      await page.screenshot({ path: `.preview/${group.id}-${width}-${theme}-quiz.png`, fullPage: true });
      await next();
      await answer(expectedFor(group)[1], false);
      check(`${group.id} ${width}px ${theme} 答错解析对比度合格`, !(await snapshot()).overflow);
    }
  }
  check("浏览器无未捕获异常", errors.length === 0);
  console.log(`\n同类药对比测验验收：${checked}/${checked} 通过`);
} finally {
  await browser.close();
  db.close();
}
