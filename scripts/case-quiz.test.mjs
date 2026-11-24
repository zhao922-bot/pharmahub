import { test } from "node:test";
import assert from "node:assert/strict";
import { CASE_QUESTIONS } from "../lib/data/cases.ts";
import { cardRepository } from "../lib/data/cards/index.ts";
import {
  buildCaseQuestion,
  generateCaseQuiz,
  validateCaseAnswer,
} from "../lib/quiz/case-generator.ts";
import { QUESTION_KIND_LABELS } from "../lib/quiz/generator.ts";
import { caseQuizCopy } from "../lib/copy-cases.ts";

const cards = await cardRepository.getAll();
const cardById = new Map(cards.map((card) => [card.id, card]));

test("题库规模达标、编号合法唯一且与 135 张基线卡片分类一致", () => {
  assert.ok(CASE_QUESTIONS.length >= 24);
  const ids = new Set();
  const categories = new Set();

  for (const spec of CASE_QUESTIONS) {
    assert.match(spec.id, /^[a-z0-9-]+$/);
    assert.ok(!ids.has(spec.id), `重复题目 id: ${spec.id}`);
    ids.add(spec.id);

    const card = cardById.get(spec.cardId);
    assert.ok(card, `未找到卡片: ${spec.cardId}`);
    assert.equal(spec.category, card.category, `分类不一致: ${spec.id}`);
    categories.add(spec.category);

    assert.ok(spec.prompt.trim().length > 0, `题干为空: ${spec.id}`);
    assert.ok(spec.explanation.trim().length > 0, `解析为空: ${spec.id}`);

    assert.equal(spec.distractors.length, 3, `干扰项数量不为 3: ${spec.id}`);
    const options = [spec.correctOption, ...spec.distractors];
    for (const option of options) {
      assert.ok(option.trim().length > 0, `存在空选项: ${spec.id}`);
    }
    assert.equal(new Set(options.map((item) => item.trim())).size, 4, `选项重复: ${spec.id}`);

    assert.ok(spec.sources.length > 0, `缺少来源: ${spec.id}`);
    for (const source of spec.sources) {
      assert.ok(source.title.trim().length > 0, `来源标题为空: ${spec.id}`);
      assert.ok(source.url.startsWith("https://"), `来源 URL 非 https: ${spec.id}`);
      assert.ok(source.sections.trim().length > 0, `来源章节为空: ${spec.id}`);
    }
    assert.match(spec.sourcesCheckedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Number.isFinite(Date.parse(spec.sourcesCheckedOn)), `日期无效: ${spec.id}`);
  }

  assert.ok(categories.size >= 10, `覆盖分类不足 10 个，当前为 ${categories.size}`);
});

test("buildCaseQuestion 可确定性重建全部情景题并拒绝非法输入", () => {
  for (const spec of CASE_QUESTIONS) {
    const questionId = `case:${spec.id}`;
    const q1 = buildCaseQuestion(questionId, CASE_QUESTIONS);
    const q2 = buildCaseQuestion(questionId, CASE_QUESTIONS);
    assert.ok(q1, questionId);
    assert.deepEqual(q1, q2);
    assert.equal(q1.id, questionId);
    assert.equal(q1.kind, "case");
    assert.equal(q1.cardId, spec.cardId);
    assert.equal(q1.prompt, spec.prompt);
    assert.equal(q1.explanation, spec.explanation);
    assert.equal(q1.options.length, 4);
    assert.deepEqual(
      q1.options.map((option) => option.id),
      ["opt-0", "opt-1", "opt-2", "opt-3"],
    );
    const correctOption = q1.options.find((option) => option.id === q1.correctOptionId);
    assert.ok(correctOption);
    assert.equal(correctOption.text, spec.correctOption);
  }

  for (const badId of [
    "",
    "case",
    "case:",
    "case:nonexistent-id",
    "case:bad_id",
    "case:a:b",
    CASE_QUESTIONS[0].id,
  ]) {
    assert.equal(buildCaseQuestion(badId, CASE_QUESTIONS), null);
  }

  const sample = CASE_QUESTIONS[0];
  assert.equal(buildCaseQuestion(`case:${sample.id}`, [sample, sample]), null);
  assert.equal(
    buildCaseQuestion(`case:${sample.id}`, [
      {
        ...sample,
        distractors: [sample.correctOption, sample.distractors[1], sample.distractors[2]],
      },
    ]),
    null,
  );
});

test("generateCaseQuiz 按分类与种子确定性抽题并遵守数量边界", () => {
  const all1 = generateCaseQuiz({ caseQuestions: CASE_QUESTIONS, count: 24, seed: 7 });
  const all2 = generateCaseQuiz({ caseQuestions: CASE_QUESTIONS, count: 24, seed: 7 });
  assert.deepEqual(all1, all2);
  assert.equal(all1.length, 24);
  assert.equal(new Set(all1.map((q) => q.id)).size, 24);

  const seqVariants = new Set(
    Array.from({ length: 8 }, (_, seed) =>
      JSON.stringify(
        generateCaseQuiz({ caseQuestions: CASE_QUESTIONS, count: 10, seed }).map((q) => q.id),
      ),
    ),
  );
  assert.ok(seqVariants.size > 1);

  const coveredCategories = new Set(CASE_QUESTIONS.map((item) => item.category));
  for (const category of coveredCategories) {
    const expectedCount = CASE_QUESTIONS.filter((item) => item.category === category).length;
    const filtered = generateCaseQuiz({
      caseQuestions: CASE_QUESTIONS,
      category,
      count: 50,
      seed: 3,
    });
    assert.equal(filtered.length, expectedCount);
    for (const q of filtered) {
      const card = cardById.get(q.cardId);
      assert.equal(card?.category, category);
    }
  }

  assert.deepEqual(
    generateCaseQuiz({ caseQuestions: CASE_QUESTIONS, category: "immunomodulator", count: 5 }),
    [],
  );
  for (const invalidCount of [0, -1, NaN, Infinity]) {
    assert.deepEqual(
      generateCaseQuiz({ caseQuestions: CASE_QUESTIONS, count: invalidCount }),
      [],
    );
  }
  assert.equal(generateCaseQuiz({ caseQuestions: CASE_QUESTIONS, count: 3.9, seed: 2 }).length, 3);
});

test("validateCaseAnswer 允许提交正确或错误选项并拒绝伪造请求", () => {
  const question = buildCaseQuestion(`case:${CASE_QUESTIONS[0].id}`, CASE_QUESTIONS);
  assert.ok(question);
  const wrongOption = question.options.find((option) => option.id !== question.correctOptionId);
  assert.ok(wrongOption);

  const validCorrect = validateCaseAnswer(
    {
      questionId: question.id,
      cardId: question.cardId,
      kind: "case",
      selectedId: question.correctOptionId,
      correctId: question.correctOptionId,
    },
    CASE_QUESTIONS,
  );
  assert.deepEqual(validCorrect, question);

  const validWrong = validateCaseAnswer(
    {
      questionId: question.id,
      cardId: question.cardId,
      kind: "case",
      selectedId: wrongOption.id,
      correctId: question.correctOptionId,
    },
    CASE_QUESTIONS,
  );
  assert.deepEqual(validWrong, question);

  const baseInput = {
    questionId: question.id,
    cardId: question.cardId,
    kind: "case",
    selectedId: question.correctOptionId,
    correctId: question.correctOptionId,
  };
  for (const patch of [
    { kind: "target" },
    { kind: "compare" },
    { correctId: wrongOption.id },
    { correctId: "forged" },
    { cardId: "losartan" },
    { questionId: "case:unknown-id" },
    { selectedId: "opt-99" },
  ]) {
    assert.equal(validateCaseAnswer({ ...baseInput, ...patch }, CASE_QUESTIONS), null);
  }
});

test("临床情景文案标签与题型常量一致", () => {
  assert.equal(caseQuizCopy.modeTitle, QUESTION_KIND_LABELS.case);
  assert.ok(caseQuizCopy.disclaimerNote.includes("不构成"));
});
