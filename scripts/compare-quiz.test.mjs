import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPARE_GROUPS } from "../lib/data/compares.ts";
import { cardRepository } from "../lib/data/cards/index.ts";
import { CATEGORIES } from "../lib/data/categories.ts";
import { buildCompareQuestion, generateCompareQuiz, validateCompareAnswer } from "../lib/quiz/compare-generator.ts";
import { generateWrongBookQuiz, buildQuestion, QUESTION_KIND_LABELS } from "../lib/quiz/generator.ts";
import { quiz, wrongBook } from "../lib/copy.ts";

const cards = await cardRepository.getAll();
const categoryNames = new Map(CATEGORIES.map((category) => [category.id, category.name]));
const group = COMPARE_GROUPS[0];
const make = (source = group, seed = 1, count = 8) =>
  generateCompareQuiz({ group: source, allCards: cards, seed, count });

test("全部对比组可考、只考标记维度且每轮维度不重复", () => {
  for (const source of COMPARE_GROUPS) {
    const rows = source.rows.filter((row) => row.quizId);
    assert.ok(rows.length > 0, source.id);
    assert.equal(new Set(rows.map((row) => row.quizId)).size, rows.length);
    for (let seed = 1; seed <= 20; seed++) {
      const questions = make(source, seed);
      assert.equal(questions.length, Math.min(8, rows.length));
      assert.equal(new Set(questions.map((q) => q.comparison.dimension)).size, questions.length);
      for (const q of questions) {
        const row = rows.find((r) => r.quizId === q.id.split(":")[2]);
        assert.equal(q.options.length, source.drugIds.length);
        assert.deepEqual(new Set(q.options.map((o) => o.text)), new Set(source.drugIds.map(
          (id) => cards.find((card) => card.id === id).genericName,
        )));
        assert.equal(q.options.filter((o) => o.id === q.correctOptionId).length, 1);
        assert.equal(q.correctOptionId, `drug-${q.cardId}`);
        assert.ok(q.prompt.includes(row.values[source.drugIds.indexOf(q.cardId)]));
        for (const value of row.values) assert.ok(q.explanation.includes(value));
      }
      const coverage = source.drugIds.map((id) => questions.filter((q) => q.cardId === id).length);
      assert.ok(Math.max(...coverage) - Math.min(...coverage) <= 1);
    }
  }
});

test("相同种子可复现，换种子可换题序或所考药物", () => {
  assert.deepEqual(make(group, 7), make(group, 7));
  assert.ok(new Set(Array.from({ length: 10 }, (_, seed) =>
    JSON.stringify(make(group, seed).map((q) => q.id)))).size > 1);
});

test("小组不凑八题，数量上限和无效数量得到遵守", () => {
  assert.equal(make(group, 1, 1).length, 1);
  for (const count of [0, -1, NaN, Infinity]) assert.deepEqual(make(group, 1, count), []);
  assert.equal(make(group, 1, 100).length, group.rows.filter((r) => r.quizId).length);
});

test("共同点、未标记维度不出题，重复与空白取值防御性跳过", () => {
  assert.deepEqual(make({ ...group, rows: group.rows.map(({ quizId, ...row }) => row) }), []);
  for (const values of [["相同", "相同"], ["相同", " 相同 "], ["", "不同"], ["一个值"]]) {
    assert.deepEqual(make({ ...group, rows: [{ quizId: "shared", label: "共同点", values }] }), []);
  }
});

test("缺失卡片、重复药物、重复出题 id 时不生成损坏题目", () => {
  assert.deepEqual(make({ ...group, drugIds: ["deleted", group.drugIds[1]] }), []);
  assert.deepEqual(make({ ...group, drugIds: [group.drugIds[0], group.drugIds[0]] }), []);
  assert.deepEqual(make({ ...group, rows: [group.rows[0], group.rows[0]] }), []);
});

test("所有对比原题都能精确重建，重练不依赖测验种子", () => {
  for (const source of COMPARE_GROUPS) {
    for (const q of make(source, 42)) {
      assert.deepEqual(buildCompareQuestion(q.id, COMPARE_GROUPS, cards), q);
    }
  }
});

test("维度插入或排序调整不改变原题身份与所考内容", () => {
  const q = make()[0];
  const reordered = { ...group, rows: [...group.rows].reverse() };
  assert.deepEqual(buildCompareQuestion(q.id, [reordered], cards), q);
});

test("分组、维度或药物不存在及非法题目 id 均拒绝重建", () => {
  const q = make()[0];
  for (const id of [q.id + ":extra", "compare", "", q.id.replace(group.id, "deleted")]) {
    assert.equal(buildCompareQuestion(id, COMPARE_GROUPS, cards), null);
  }
  assert.equal(buildCompareQuestion(q.id, [{ ...group, rows: [] }], cards), null);
  assert.equal(buildCompareQuestion(q.id, COMPARE_GROUPS, []), null);
});

test("错题同一药的不同维度分别保留，与旧四种题型混合重练", () => {
  const [firstRow, secondRow] = group.rows.filter((r) => r.quizId);
  const compareRecords = [firstRow, secondRow].map((row) => ({
    questionId: `compare:${group.id}:${row.quizId}:${group.drugIds[0]}`,
    cardId: group.drugIds[0], kind: "compare",
  }));
  const old = ["target", "category", "indication", "mechanism-order"].map((kind) => ({
    cardId: "metoprolol", kind,
  }));
  const records = [compareRecords[0], ...old, compareRecords[1], compareRecords[0]];
  const questions = generateWrongBookQuiz({
    wrongQuestions: records, allCards: cards, categoryNames, compareGroups: COMPARE_GROUPS,
  });
  assert.equal(questions.length, 6);
  assert.equal(questions[0].id, compareRecords[0].questionId);
  assert.equal(questions[5].id, compareRecords[1].questionId);
  for (const [index, record] of old.entries()) {
    assert.deepEqual(questions[index + 1], buildQuestion(
      cards.find((c) => c.id === record.cardId), record.kind, cards, categoryNames,
    ));
  }
});

test("错题重练跳过过期或错配记录，limit 对混合题生效", () => {
  const q = make()[0];
  const record = { questionId: q.id, cardId: q.cardId, kind: q.kind };
  const options = { allCards: cards, categoryNames, compareGroups: COMPARE_GROUPS };
  assert.deepEqual(generateWrongBookQuiz({ ...options, wrongQuestions: [
    { ...record, questionId: "compare:deleted:x:y" },
    { ...record, cardId: "metoprolol" },
    { cardId: q.cardId, kind: "compare" },
  ] }), []);
  assert.equal(generateWrongBookQuiz({ ...options,
    wrongQuestions: [record, { cardId: "metoprolol", kind: "target" }], limit: 1,
  }).length, 1);
});

test("服务端校验拒绝伪造答案、卡片、题目和组外选项", () => {
  const q = make()[0];
  const input = { questionId: q.id, cardId: q.cardId, selectedId: q.options[0].id, correctId: q.correctOptionId };
  assert.deepEqual(validateCompareAnswer(input, COMPARE_GROUPS, cards), q);
  for (const patch of [
    { correctId: "forged" }, { cardId: "metoprolol" },
    { questionId: q.id + ":forged" }, { selectedId: "drug-metoprolol" },
  ]) assert.equal(validateCompareAnswer({ ...input, ...patch }, COMPARE_GROUPS, cards), null);
});

test("新题型在测验、错题本、导出中的中文标签一致", () => {
  assert.equal(quiz.kindLabel.compare, QUESTION_KIND_LABELS.compare);
  assert.equal(wrongBook.kindLabel.compare, QUESTION_KIND_LABELS.compare);
});

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

test("扩充组的每个药物与维度都可重建，并带来源及独立辨析理由", () => {
  for (const id of expansionIds) {
    const source = COMPARE_GROUPS.find((g) => g.id === id);
    assert.ok(source, id);
    assert.ok(source.sources.length > 0);
    assert.ok(Number.isFinite(Date.parse(source.sourcesCheckedOn)));
    for (const row of source.rows.filter((r) => r.quizId)) {
      assert.ok(row.quizExplanation?.trim(), `${id}:${row.quizId}`);
      assert.ok(!row.values.includes(row.quizExplanation));
      for (const cardId of source.drugIds) {
        const q = buildCompareQuestion(`compare:${id}:${row.quizId}:${cardId}`, COMPARE_GROUPS, cards);
        assert.ok(q);
        assert.equal(q.correctOptionId, `drug-${cardId}`);
        assert.ok(q.explanation.endsWith(`\n\n${row.quizExplanation}`));
        const rebuilt = generateWrongBookQuiz({
          wrongQuestions: [{ questionId: q.id, cardId, kind: "compare" }],
          allCards: cards, categoryNames, compareGroups: COMPARE_GROUPS,
        });
        assert.deepEqual(rebuilt, [q]);
      }
    }
  }
});

test("扩充组的共同风险、观察指标与治疗边界不作为单独识药依据", () => {
  const shared = [
    ["loop-vs-thiazide", "共同的电解质风险"],
    ["glucose-lowering-strategies", "低血糖风险"],
    ["analgesic-cox-selectivity", "重要风险"],
    ["phenytoin-vs-valproate", "共同的学习提醒"],
    ["metoprolol-vs-amlodipine", "共同的观察指标"],
    ["common-antibiotic-targets", "重要风险举例"],
    ["common-antibiotic-targets", "选药仍需考虑"],
    ["omeprazole-vs-sucralfate", "共同的治疗边界"],
    ["domperidone-vs-ondansetron", "共同的心律风险"],
    ["penicillin-g-vs-vancomycin", "共同的作用结果"],
    ["penicillin-g-vs-vancomycin", "风险与选药边界"],
    ["morphine-vs-loperamide", "共同的受体联系"],
    ["morphine-vs-loperamide", "共同的胃肠效应"],
    ["morphine-vs-loperamide", "重要风险与边界"],
    ["levothyroxine-vs-methimazole", "共同的随访要求"],
    ["levothyroxine-vs-methimazole", "其他重要风险"],
    ["nitroglycerin-vs-metoprolol", "共同的低血压风险"],
    ["nitroglycerin-vs-metoprolol", "重要用药边界"],
    ["gentamicin-vs-azithromycin", "共同的作用结果"],
    ["gentamicin-vs-azithromycin", "重要风险与选药边界"],
    ["digoxin-vs-metoprolol", "共同的房室传导效应"],
    ["digoxin-vs-metoprolol", "重要风险与监测"],
    ["aminophylline-vs-salbutamol", "共同的支气管效应"],
    ["aminophylline-vs-salbutamol", "重要风险举例"],
    ["aminophylline-vs-salbutamol", "共同的学习边界"],
    ["cisplatin-vs-fluorouracil", "共同的骨髓风险"],
    ["cisplatin-vs-fluorouracil", "其他重要风险"],
    ["diazepam-vs-phenytoin", "共同的中枢不良反应"],
    ["diazepam-vs-phenytoin", "共同的停药提醒"],
    ["diazepam-vs-phenytoin", "其他重要风险"],
    ["metronidazole-vs-levofloxacin", "共同的核酸联系"],
    ["metronidazole-vs-levofloxacin", "共同的神经系统风险"],
    ["metronidazole-vs-levofloxacin", "选药与风险边界"],
    ["dexamethasone-vs-ibuprofen", "共同的抗炎结果"],
    ["dexamethasone-vs-ibuprofen", "共同的胃肠道提醒"],
    ["dexamethasone-vs-ibuprofen", "疗程与随访重点"],
    ["dexamethasone-vs-ibuprofen", "共同的感染判断边界"],
    ["trastuzumab-vs-gefitinib", "共同的选药要求"],
    ["trastuzumab-vs-gefitinib", "重要风险与监测"],
    ["atorvastatin-vs-aspirin", "重要风险与监测"],
    ["atorvastatin-vs-aspirin", "共同的治疗边界"],
    ["ceftriaxone-vs-gentamicin", "重要风险与监测"],
    ["ceftriaxone-vs-gentamicin", "共同的选药要求"],
    ["levodopa-vs-haloperidol", "共同的体位性低血压风险"],
    ["levodopa-vs-haloperidol", "其他重要风险"],
    ["levodopa-vs-haloperidol", "资料与联用边界"],
    ["fluoxetine-vs-diazepam", "共同的嗜睡风险"],
    ["fluoxetine-vs-diazepam", "重要风险与随访"],
    ["fluoxetine-vs-diazepam", "本组药物的相互作用提醒"],
    ["sertraline-vs-chlorpromazine", "共同的心律风险"],
    ["sertraline-vs-chlorpromazine", "其他重要风险"],
    ["sertraline-vs-chlorpromazine", "共同的治疗边界"],
    ["mesalazine-vs-omeprazole", "制剂与机制理解"],
    ["mesalazine-vs-omeprazole", "共同的肾脏风险"],
    ["mesalazine-vs-omeprazole", "治疗与监测边界"],
    ["indomethacin-vs-celecoxib", "共同的药物类别"],
    ["indomethacin-vs-celecoxib", "共同的重要风险"],
    ["indomethacin-vs-celecoxib", "共同的治疗边界"],
    ["imatinib-vs-gefitinib", "共同的药物类别"],
    ["imatinib-vs-gefitinib", "共同的选药要求"],
    ["imatinib-vs-gefitinib", "重要风险与监测"],
  ];
  for (const [id, label] of shared) {
    const source = COMPARE_GROUPS.find((g) => g.id === id);
    const row = source.rows.find((r) => r.label === label);
    assert.ok(row);
    assert.equal(row.quizId, undefined);
    assert.ok(make(source).every((q) => q.comparison.dimension !== label));
  }
});

test("未提供扩展解析的旧题仍保持原有解释格式", () => {
  const legacyGroup = { ...group, rows: group.rows.map((row) => ({ ...row, quizExplanation: undefined })) };
  const q = make(legacyGroup)[0];
  const row = legacyGroup.rows.find((r) => r.quizId === q.id.split(":")[2]);
  assert.equal(row.quizExplanation, undefined);
  const expected = `${row.label}\n${group.drugIds.map((id, i) =>
    `${cards.find((c) => c.id === id).genericName}：${row.values[i]}`).join("\n")}`;
  assert.equal(q.explanation, expected);
});
