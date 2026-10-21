import test from "node:test";
import assert from "node:assert/strict";
import { cardRepository } from "../lib/data/cards/index.ts";
import { CATEGORIES } from "../lib/data/categories.ts";
import { COMPARE_GROUPS } from "../lib/data/compares.ts";
import { buildQuestion, generateQuiz, generateWrongBookQuiz } from "../lib/quiz/generator.ts";
import { validateQuizAnswer } from "../lib/quiz/validate-answer.ts";
const cards = await cardRepository.getAll();
const names = new Map(CATEGORIES.map((c) => [c.id, c.name]));
const kinds = ["target", "indication", "category", "mechanism-order"];
test("全库来源及候选完整；普通题可重建且服务端接受对应答案", () => {
  let checked = 0;
  for (const card of cards) {
    assert.ok(card.sources?.length, card.id);
    assert.match(card.sourcesCheckedOn, /^\d{4}-\d{2}-\d{2}$/);
    for (const key of ["targetQuizDistractorIds", "indicationQuizDistractorIds"]) {
      assert.equal(new Set(card[key]).size, 3, card.id + key);
      assert.ok(card[key].every((id) => id !== card.id && cards.some((c) => c.id === id)));
    }
    for (const kind of kinds) {
      const q = buildQuestion(card, kind, cards, names);
      if (kind === "mechanism-order" && !card.mechanismQuiz) { assert.equal(q, null); continue; }
      assert.ok(q, card.id + kind);
      assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
      const answer = { questionId: q.id, cardId: q.cardId, kind, selectedId: q.correctOptionId, correctId: q.correctOptionId };
      assert.equal(validateQuizAnswer(answer, COMPARE_GROUPS, cards, names)?.question.id, q.id);
      checked++;
    }
  }
  assert.equal(checked, cards.length * 3 + cards.filter((c) => c.mechanismQuiz).length);
});
test("缺少候选时关闭题型，不能从其他卡随机补全", () => {
  const card = cards[0];
  for (const kind of ["target", "indication"]) {
    const key = kind === "target" ? "targetQuizDistractorIds" : "indicationQuizDistractorIds";
    assert.equal(buildQuestion({ ...card, [key]: undefined }, kind, cards, names), null);
  }
});
test("讲解段落顺序不影响经核对主线；并行或未知机制不强出排序题", () => {
  const c = cards.find((c) => c.id === "digoxin");
  const q = buildQuestion(c, "mechanism-order", cards, names);
  assert.deepEqual(buildQuestion({ ...c, mechanismSteps: [...c.mechanismSteps].reverse() }, "mechanism-order", cards, names), q);
  for (const id of ["metformin", "fluoxetine", "trastuzumab", "ondansetron", "levetiracetam"]) {
    const card = cards.find((c) => c.id === id);
    assert.equal(buildQuestion(card, "mechanism-order", cards, names), null);
    assert.deepEqual(generateWrongBookQuiz({ wrongQuestions: [{ cardId: id, kind: "mechanism-order" }], allCards: cards, categoryNames: names }), []);
  }
});
test("不足四类题时仍能遍历全部合法题，不因卡片数与题型数锁步而漏题", () => {
  const selected = cards.filter((c) => ["spironolactone", "apixaban", "ezetimibe", "empagliflozin"].includes(c.id));
  for (const seed of [1, 4, 42]) {
    const questions = generateQuiz({ cards: selected, allCards: cards, categoryNames: names, count: 99, seed });
    assert.equal(questions.length, 12);
    assert.equal(new Set(questions.map((q) => q.id)).size, 12);
    assert.ok(questions.every((q) => q.kind !== "mechanism-order"));
  }
});
test("已确认的内容错误保留回归约束，不以来源数量替代医学判断", () => {
  const text = (id) => JSON.stringify(cards.find((c) => c.id === id));
  assert.match(text("oseltamivir"), /超过 48 小时仍可能获益/);
  assert.match(text("warfarin"), /不能一律桥接/);
  assert.match(text("gefitinib"), /属于不良反应/);
  assert.match(text("glibenclamide"), /使细胞膜去极化/);
  assert.match(text("methotrexate"), /5-甲酰四氢叶酸/);
  assert.match(text("ranitidine"), /2025/);
  assert.ok(COMPARE_GROUPS.every((g) => g.sources?.length && g.rows.filter((r) => r.quizId).every((r) => r.quizExplanation)));
});
