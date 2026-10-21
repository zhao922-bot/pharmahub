import { test } from "node:test";
import assert from "node:assert/strict";
import { validateQuizAnswer } from "../lib/quiz/validate-answer.ts";
import { buildQuestion, generateQuiz } from "../lib/quiz/generator.ts";
import { buildCompareQuestion } from "../lib/quiz/compare-generator.ts";
import { cardRepository } from "../lib/data/cards/index.ts";
import { CATEGORIES } from "../lib/data/categories.ts";
import { COMPARE_GROUPS } from "../lib/data/compares.ts";
const cards = await cardRepository.getAll();
const names = new Map(CATEGORIES.map((c) => [c.id, c.name]));
const card = cards.find((c) => c.id === "atorvastatin");
const input = (question, selectedId = question.correctOptionId) => ({
  questionId: question.id, cardId: question.cardId, kind: question.kind,
  selectedId, correctId: question.correctOptionId,
});
const validate = (answer) => validateQuizAnswer(answer, COMPARE_GROUPS, cards, names);
test("不同轮次和分类中的普通题与重练及服务端重建完全一致", () => {
  for (const seed of [1, 142, 20261021]) {
    for (const pool of [cards, cards.filter((c) => c.category === "cardiovascular")]) {
      const questions = generateQuiz({ cards: pool, allCards: cards, categoryNames: names, count: 16, seed });
      assert.equal(questions.length, 16);
      for (const question of questions) {
        assert.deepEqual(validate(input(question)), { question, selectedId: question.correctOptionId });
      }
    }
  }
});
for (const kind of ["target", "category", "indication", "mechanism-order"]) {
  test(`服务端校验 ${kind} 的正确和错误选择，拒绝篡改答案`, () => {
    const question = buildQuestion(card, kind, cards, names);
    assert.ok(question);
    const wrong = question.options.find((o) => o.id !== question.correctOptionId).id;
    assert.deepEqual(validate(input(question)), { question, selectedId: question.correctOptionId });
    assert.equal(validate(input(question, wrong)).selectedId, wrong);
    assert.equal(validate({ ...input(question, wrong), correctId: wrong }), null);
    assert.equal(validate({ ...input(question), selectedId: "opt-99" }), null);
    assert.equal(validate({ ...input(question), questionId: "unrelated:target" }), null);
    assert.equal(validate({ ...input(question), cardId: "metformin" }), null);
  });
}
test("服务端校验拒绝缺失、畸形或题型不匹配的请求", () => {
  const q = buildQuestion(card, "target", cards, names);
  for (const bad of [null, undefined, [], "answer", {}, { ...input(q), kind: "unknown" },
    { ...input(q), questionId: "compare:a:b:c" }, { ...input(q), cardId: 42 },
    { ...input(q), selectedId: "x".repeat(513) }]) assert.equal(validate(bad), null);
});
test("统一校验保留对比题身份和服务端正确答案校验", () => {
  const g = COMPARE_GROUPS[0], row = g.rows.find((r) => r.quizId);
  const q = buildCompareQuestion(`compare:${g.id}:${row.quizId}:${g.drugIds[0]}`, COMPARE_GROUPS, cards);
  assert.deepEqual(validate(input(q)), { question: q, selectedId: q.correctOptionId });
  assert.equal(validate({ ...input(q), kind: "target" }), null);
  assert.equal(validate({ ...input(q), correctId: "forged" }), null);
});
