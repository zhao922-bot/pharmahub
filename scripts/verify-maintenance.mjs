/** 通过 pnpm verify -- verify-maintenance 复现存储受限、断网写入和界面回归。 */
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { mkdir } from "node:fs/promises";
import { getVerificationContext } from "./verify-context.mjs";
import { resolveBrowserPath } from "./browser-path.mjs";
const { baseURL, dbPath } = getVerificationContext();
const browser = await puppeteer.launch({ executablePath: resolveBrowserPath(), headless: true });
const results = [];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const check = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
};
const shotDir = `.preview/maintenance${process.env.PHARMAHUB_AUDIT_BASELINE ? "-before" : ""}`;
await mkdir(shotDir, { recursive: true });
const db = new Database(dbPath);
async function pageFor(route) {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(baseURL + route, { waitUntil: "networkidle0" });
  return page;
}
async function failWrites(page) {
  await page.setRequestInterception(true);
  page.on("request", (request) => request.method() === "POST" && request.headers()["next-action"]
    ? request.abort("failed") : request.continue());
}
async function clickText(page, text) {
  return page.evaluate((text) => {
    const button = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === text);
    if (!button) return false;
    button.click(); return true;
  }, text);
}
try {
  const page = await pageFor("/cards");
  await page.screenshot({ path: `${shotDir}/cards-mobile.png` });
  await page.setViewport({ width: 1366, height: 900 });
  await page.screenshot({ path: `${shotDir}/cards-desktop.png` });
  await page.close();
  const storage = await browser.newPage();
  const storageErrors = [];
  storage.on("pageerror", (e) => storageErrors.push(e.message));
  await storage.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await storage.evaluateOnNewDocument(() => Object.defineProperty(window, "localStorage", {
    get() { throw new DOMException("Storage unavailable", "SecurityError"); },
  }));
  await storage.goto(baseURL + "/cards", { waitUntil: "networkidle0" });
  check("浏览器禁用存储时页面仍可用", storageErrors.length === 0 && !!await storage.$("#card-search"), storageErrors.join("; "));
  check("存储不可用时仍跟随系统深色主题", await storage.evaluate(() => document.documentElement.classList.contains("dark")));
  await storage.close();

  const favorite = await pageFor("/cards/rosuvastatin");
  await failWrites(favorite);
  await favorite.click("button[aria-label='收藏']");
  await delay(900);
  check("收藏请求失败会提示并回滚", await favorite.evaluate(() =>
    !!document.querySelector("button[aria-label='收藏'][aria-pressed='false']") && document.body.innerText.includes("收藏操作失败")));
  check("失败请求没有写入收藏", db.prepare("SELECT COUNT(*) AS n FROM favorite").get().n === 0);
  await favorite.close();

  const review = await pageFor("/cards/rosuvastatin");
  await failWrites(review);
  await review.evaluate(() => { localStorage.setItem("pharmahub-theme", "dark"); });
  await review.reload({ waitUntil: "networkidle0" });
  // 用可见按钮标签匹配，避免把提示文案变更绑定到测试。
  await review.evaluate(() => [...document.querySelectorAll("section button")].find((b) => b.textContent.includes("记住了"))?.click());
  await delay(900);
  check("自评请求失败会显示可重试反馈", await review.evaluate(() => /保存失败|记录失败|稍后重试/.test(document.body.innerText)));
  check("失败请求没有写入复习", db.prepare("SELECT COUNT(*) AS n FROM review_history").get().n === 0);
  const contrast = await review.$$eval('section[aria-labelledby="review-heading"] button span', (elements) => {
    const rgb = (color) => color.match(/[\d.]+/g).map(Number);
    const blend = (front, back, opacity = 1) => {
      const a = (front[3] ?? 1) * opacity;
      return front.slice(0, 3).map((v, i) => v * a + back[i] * (1 - a));
    };
    const luminance = (color) => color.map((c) => c / 255).map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
      .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
    return elements.map((el) => {
      const ancestors = [];
      for (let p = el; p; p = p.parentElement) ancestors.unshift(p);
      const bg = ancestors.reduce((back, p) => blend(rgb(getComputedStyle(p).backgroundColor), back), [255, 255, 255]);
      const style = getComputedStyle(el), fg = blend(rgb(style.color), bg, Number(style.opacity));
      const [low, high] = [luminance(fg), luminance(bg)].sort((a, b) => a - b);
      return (high + 0.05) / (low + 0.05);
    });
  });
  check("深色自评按钮正文和提示对比度至少 4.5:1", contrast.length === 6 && contrast.every((ratio) => ratio >= 4.5), contrast.map((v) => v.toFixed(2)).join(", "));
  if (await review.$("#review-heading")) await review.$eval("#review-heading", (el) => el.scrollIntoView());
  await review.screenshot({ path: `${shotDir}/review-dark-mobile.png` });
  await review.close();

  db.prepare("INSERT INTO wrong_question (question_id,card_id,kind,wrong_count,last_wrong_at) VALUES (?,?,?,?,?)")
    .run("rosuvastatin:target", "rosuvastatin", "target", 1, new Date().toISOString());
  const wrong = await pageFor("/wrong-book");
  await failWrites(wrong);
  await clickText(wrong, "移除");
  await delay(900);
  check("移除错题失败会恢复条目并提示", await wrong.evaluate(() =>
    document.querySelectorAll("main ul li").length === 1 && /移除失败|操作失败|稍后重试/.test(document.body.innerText)));
  await wrong.reload({ waitUntil: "networkidle0" });
  await clickText(wrong, "清空错题本");
  await clickText(wrong, "确定清空");
  await delay(900);
  check("清空错题失败会保留条目并提示", await wrong.evaluate(() =>
    document.querySelectorAll("main ul li").length === 1 && /移除失败|操作失败|稍后重试/.test(document.body.innerText)));
  check("失败请求没有清除错题", db.prepare("SELECT COUNT(*) AS n FROM wrong_question").get().n === 1);
  await wrong.close();

  const quiz = await pageFor("/quiz");
  await quiz.screenshot({ path: `${shotDir}/quiz-mobile.png` });
  check("对比组可直接选择，无需长距离横滑", !!await quiz.$("select[name='compare']"));
  if (await quiz.$("select[name='compare']")) {
    const last = await quiz.$eval("select[name='compare']", (select) => select.options[select.options.length - 1].value);
    await quiz.select("select[name='compare']", last);
    await quiz.waitForFunction((id) => new URL(location.href).searchParams.get("compare") === id, {}, last);
    check("可直接跳到最后一组且保持选中", await quiz.$eval("select[name='compare']", (select) => select.value) === last);
    await quiz.goto(baseURL + "/quiz", { waitUntil: "networkidle0" });
  }
  for (const width of [320, 375, 768, 1366]) {
    await quiz.setViewport({ width, height: 900 });
    check(`${width}px 测验页无横向溢出`, await quiz.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  let action;
  quiz.on("request", (request) => {
    if (request.headers()["next-action"]) action = { id: request.headers()["next-action"], body: request.postData() };
  });
  await quiz.click("main ul li button");
  try { await quiz.waitForSelector('[aria-live="polite"]', { timeout: 7000 }); }
  catch {
    console.log("普通题提交诊断", action, await quiz.$eval("main", (el) => el.innerText));
    await quiz.screenshot({ path: `${shotDir}/quiz-submit-failure.png`, fullPage: true });
    throw new Error("普通题提交后未出现反馈");
  }
  const before = db.prepare("SELECT COUNT(*) AS n FROM quiz_attempt").get().n;
  check("普通测验仍能正常保存", before === 1 && !!action);
  if (action) {
    const answer = JSON.parse(action.body)[0];
    const wrongId = ["opt-0", "opt-1", "opt-2", "opt-3"].find((id) => id !== answer.correctId);
    for (const [name, payload] of [
      ["篡改正确答案", { ...answer, correctId: wrongId, selectedId: wrongId }],
      ["伪造普通题身份", { ...answer, questionId: "invented:target" }],
      ["提交不存在选项", { ...answer, selectedId: "opt-99" }],
      ["提交空参数", null],
    ]) {
      const response = await fetch(baseURL + "/quiz", { method: "POST", headers: {
        "Next-Action": action.id, "Content-Type": "text/plain;charset=UTF-8", Origin: baseURL,
      }, body: JSON.stringify([payload]) });
      const content = await response.text();
      check(`${name}被拒绝且不写入记录`, content.includes('"ok":false') && db.prepare("SELECT COUNT(*) AS n FROM quiz_attempt").get().n === before);
    }
  }
  await quiz.close();
} finally { db.close(); await browser.close(); }
console.log(`维护验收：${results.filter((r) => r.pass).length}/${results.length} 通过`);
if (results.some((r) => !r.pass)) process.exitCode = 1;
