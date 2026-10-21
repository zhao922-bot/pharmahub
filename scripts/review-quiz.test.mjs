/**
 * 错题重练出题逻辑测试。
 *
 * 直接 import 真实源码。重点验证三件事：
 * 1. 错题能按原题型精确重建（题干、选项、正确答案都正确）
 * 2. 重建是确定性的（同一道错题每次选项顺序一致）
 * 3. 异常数据被安全跳过（卡片已删除、题型无法生成）
 *
 * 运行：pnpm test（或 node --test --experimental-strip-types --import ./scripts/ts-alias-hook.mjs scripts/review-quiz.test.mjs）
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { buildQuestion, generateWrongBookQuiz } from "../lib/quiz/generator.ts";

import { cardRepository } from "../lib/data/cards/index.ts";
const all = await cardRepository.getAll();
const CARDS = [all.find((c) => c.id === "metoprolol"), all.find((c) => c.id === "metformin"),
  ...all.filter((c) => !["metoprolol", "metformin"].includes(c.id))];

const CATEGORY_NAMES = new Map([
  ["cardiovascular", "心血管系统"],
  ["endocrine", "内分泌系统"],
  ["nervous", "神经系统"],
  ["antibacterial", "抗菌药物"],
  ["analgesic", "解热镇痛抗炎"],
  ["digestive", "消化系统"],
]);

const ALL_KINDS = ["target", "indication", "category", "mechanism-order"];

test("四种题型都能从卡片重建", () => {
  for (const kind of ALL_KINDS) {
    const question = buildQuestion(CARDS[0], kind, CARDS, CATEGORY_NAMES);
    assert.ok(question, `题型 ${kind} 应能生成`);
    assert.equal(question.kind, kind);
    assert.equal(question.cardId, "metoprolol");
    assert.equal(question.options.length, 4, `题型 ${kind} 应有 4 个选项`);
    assert.ok(
      question.options.some((option) => option.id === question.correctOptionId),
      "正确答案必须在选项里",
    );
  }
});

test("题目 id 与错题本记录格式一致", () => {
  for (const kind of ALL_KINDS) {
    const question = buildQuestion(CARDS[0], kind, CARDS, CATEGORY_NAMES);
    assert.equal(question.id, `metoprolol:${kind}`);
  }
});

test("重建是确定性的：两次调用选项顺序一致", () => {
  for (const kind of ALL_KINDS) {
    const first = buildQuestion(CARDS[0], kind, CARDS, CATEGORY_NAMES);
    const second = buildQuestion(CARDS[0], kind, CARDS, CATEGORY_NAMES);
    assert.deepEqual(
      first.options.map((o) => o.id),
      second.options.map((o) => o.id),
      `题型 ${kind} 的选项顺序应稳定`,
    );
    assert.equal(first.correctOptionId, second.correctOptionId);
  }
});

test("重建的题目与首次生成时答案一致", () => {
  // 靶点题的正确答案就是卡片的 target
  const targetQuestion = buildQuestion(CARDS[0], "target", CARDS, CATEGORY_NAMES);
  const correctOption = targetQuestion.options.find(
    (o) => o.id === targetQuestion.correctOptionId,
  );
  assert.equal(correctOption.text, CARDS[0].target);
});

test("机制顺序题的正确答案是第一步", () => {
  const question = buildQuestion(CARDS[0], "mechanism-order", CARDS, CATEGORY_NAMES);
  const correctOption = question.options.find((o) => o.id === question.correctOptionId);
  assert.equal(correctOption.text, CARDS[0].mechanismQuiz.steps[0]);
});

test("按错题本顺序生成题目", () => {
  const questions = generateWrongBookQuiz({
    wrongQuestions: [
      { cardId: "metformin", kind: "indication" },
      { cardId: "metoprolol", kind: "target" },
    ],
    allCards: CARDS,
    categoryNames: CATEGORY_NAMES,
  });
  assert.equal(questions.length, 2);
  // 顺序必须沿用输入顺序（错误次数多的在前）
  assert.equal(questions[0].cardId, "metformin");
  assert.equal(questions[0].kind, "indication");
  assert.equal(questions[1].cardId, "metoprolol");
  assert.equal(questions[1].kind, "target");
});

test("卡片已删除时跳过该错题", () => {
  const questions = generateWrongBookQuiz({
    wrongQuestions: [
      { cardId: "deleted-card", kind: "target" },
      { cardId: "metoprolol", kind: "target" },
    ],
    allCards: CARDS,
    categoryNames: CATEGORY_NAMES,
  });
  assert.equal(questions.length, 1, "应只生成存在卡片的题目");
  assert.equal(questions[0].cardId, "metoprolol");
});

test("重复的错题记录只出一次", () => {
  const questions = generateWrongBookQuiz({
    wrongQuestions: [
      { cardId: "metoprolol", kind: "target" },
      { cardId: "metoprolol", kind: "target" },
    ],
    allCards: CARDS,
    categoryNames: CATEGORY_NAMES,
  });
  assert.equal(questions.length, 1, "同一道题不应重复出题");
});

test("limit 参数限制题目数量", () => {
  const questions = generateWrongBookQuiz({
    wrongQuestions: [
      { cardId: "metoprolol", kind: "target" },
      { cardId: "metoprolol", kind: "indication" },
      { cardId: "metformin", kind: "target" },
    ],
    allCards: CARDS,
    categoryNames: CATEGORY_NAMES,
    limit: 2,
  });
  assert.equal(questions.length, 2);
});

test("没有经核对主线时跳过机制顺序题", () => {
  const shortCard = {
    ...CARDS[0],
    id: "short",
    mechanismQuiz: undefined,
    mechanismSteps: [
      { title: "第一步", detail: "" },
      { title: "第二步", detail: "" },
    ],
  };
  const questions = generateWrongBookQuiz({
    wrongQuestions: [{ cardId: "short", kind: "mechanism-order" }],
    allCards: [shortCard, ...CARDS],
    categoryNames: CATEGORY_NAMES,
  });
  assert.equal(questions.length, 0, "步骤不足时应跳过而不是生成残缺题目");
});

test("空错题本生成空数组", () => {
  const questions = generateWrongBookQuiz({
    wrongQuestions: [],
    allCards: CARDS,
    categoryNames: CATEGORY_NAMES,
  });
  assert.deepEqual(questions, []);
});

test("不同卡片的同一题型互不影响", () => {
  const a = buildQuestion(CARDS[0], "target", CARDS, CATEGORY_NAMES);
  const b = buildQuestion(CARDS[1], "target", CARDS, CATEGORY_NAMES);
  assert.notEqual(a.id, b.id);
  // 各自正确答案不同
  const aCorrect = a.options.find((o) => o.id === a.correctOptionId).text;
  const bCorrect = b.options.find((o) => o.id === b.correctOptionId).text;
  assert.notEqual(aCorrect, bCorrect);
});
