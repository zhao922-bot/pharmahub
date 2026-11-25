import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_QUESTIONS } from "../lib/data/cases.ts";
import { cardRepository } from "../lib/data/cards/index.ts";
import { generateCaseQuiz } from "../lib/quiz/case-generator.ts";
import { generateWrongBookQuiz } from "../lib/quiz/generator.ts";
import { getCategoryMastery } from "../lib/review/category-mastery.ts";

const categories = ["digestive", "endocrine", "cardiovascular", "analgesic"].map((id, order) => ({ id, order }));
const cards = categories.flatMap(({ id }) => [1, 2].map((i) => ({ id: `${id}-${i}`, category: id })));
const fresh = { categories, cards, learnedCardIds: [], dueCardIds: [], attemptStats: [] };

test("推荐保留评分顺序，并一次进入对应系统的测验、到期或新卡队列", () => {
  const { recommendations } = getCategoryMastery({
    ...fresh,
    learnedCardIds: ["digestive-1", "digestive-2", "cardiovascular-1", "cardiovascular-2", "analgesic-1", "analgesic-2"],
    dueCardIds: ["cardiovascular-1", "cardiovascular-2"],
    attemptStats: [{ cardId: "digestive-1", answered: 10, correct: 10 }, { cardId: "analgesic-1", answered: 10, correct: 0 }],
  });
  assert.deepEqual(recommendations.map((row) => row.category.id), ["analgesic", "cardiovascular", "endocrine"]);
  const [quiz, due, learn] = recommendations.map((row) => row.action);
  assert.match(quiz.reason, /正确率 0%/);
  assert.equal(quiz.href, "/quiz?category=analgesic");
  assert.match(due.reason, /2 张卡片到期/);
  assert.match(due.label, /复习这 2 张/);
  assert.equal(due.href, "/review?mode=due&category=cardiovascular");
  assert.equal(learn.href, "/review?mode=unlearned&category=endocrine");
});

test("新账户显示尚未测验，完成卡片但尚未测验时进入分类测验", () => {
  const { recommendations, rows } = getCategoryMastery(fresh);
  assert.equal(recommendations.length, 3);
  assert.ok(rows.every((row) => row.accuracy === null));
  for (const { category, action } of recommendations) {
    assert.match(action.reason, /尚未测验/);
    assert.equal(action.href, `/review?mode=unlearned&category=${category.id}`);
  }
  const learned = getCategoryMastery({ ...fresh, learnedCardIds: cards.map((card) => card.id) });
  assert.equal(learned.recommendations[0].action.href, "/quiz?category=digestive");
  assert.match(learned.recommendations[0].action.reason, /已学完卡片，尚未测验/);
  assert.deepEqual(getCategoryMastery({ ...fresh, cards: [] }).recommendations, []);
});

test("卡托普利干咳题的首次答题和错题重练保留两份说明书、章节和核对日期", async () => {
  const spec = CASE_QUESTIONS.find((item) => item.id === "acei-cough-switch-arb");
  const [initial] = generateCaseQuiz({ caseQuestions: [spec] });
  const allCards = await cardRepository.getAll();
  const [replay, regular] = generateWrongBookQuiz({
    allCards,
    categoryNames: new Map(categories.map(({ id }) => [id, id])),
    wrongQuestions: [
      { questionId: initial.id, cardId: initial.cardId, kind: "case" },
      { questionId: "captopril:category", cardId: initial.cardId, kind: "category" },
    ],
  });
  for (const question of [initial, replay]) {
    assert.deepEqual(question.references, { sources: spec.sources, sourcesCheckedOn: spec.sourcesCheckedOn });
    assert.equal(question.references.sources.length, 2);
    for (const source of question.references.sources) {
      assert.equal(new URL(source.url).hostname, "dailymed.nlm.nih.gov");
      assert.ok(source.sections);
    }
  }
  assert.equal(regular.kind, "category");
  assert.equal(regular.references, undefined);
});
