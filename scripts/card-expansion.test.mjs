import { test } from "node:test";
import assert from "node:assert/strict";
import { cardRepository } from "../lib/data/cards/index.ts";
import { CATEGORIES } from "../lib/data/categories.ts";
import { buildQuestion, generateWrongBookQuiz } from "../lib/quiz/generator.ts";

const cards = await cardRepository.getAll();
const categoryNames = new Map(CATEGORIES.map((c) => [c.id, c.name]));
const ids = [
  "spironolactone", "apixaban", "ezetimibe", "empagliflozin",
  "sitagliptin", "semaglutide", "doxycycline", "linezolid",
  "montelukast", "tiotropium", "lactulose", "colchicine",
  "diltiazem", "amiodarone", "acarbose", "pioglitazone",
  "famotidine", "gabapentin", "donepezil", "clindamycin",
  "trimethoprim-sulfamethoxazole", "epinephrine", "entecavir", "terbinafine",
  "adenosine", "heparin", "allopurinol", "alendronate",
  "repaglinide", "metoclopramide", "bisacodyl", "carbamazepine",
  "memantine", "cetirizine", "acetylcysteine", "amoxicillin-clavulanate",
  "bisoprolol", "sacubitril-valsartan", "rivaroxaban", "levetiracetam",
  "duloxetine", "budesonide-formoterol", "macrogol-3350", "ursodeoxycholic-acid",
  "febuxostat", "cefuroxime-axetil", "tenofovir-disoproxil", "clotrimazole",
  "rosuvastatin", "ticagrelor", "enoxaparin", "dapagliflozin",
  "prednisolone", "pregabalin", "escitalopram", "diclofenac",
  "ipratropium", "pantoprazole", "nitrofurantoin", "nystatin",
];
const kinds = ["target", "category", "indication", "mechanism-order"];

for (const id of ids) {
  test(`扩充卡片 ${id}：可检索、可用题型解析完整、未核对机制题关闭`, async () => {
    const card = await cardRepository.getById(id);
    assert.ok(card);
    for (const keyword of [card.genericName, card.englishName, card.target]) {
      assert.ok((await cardRepository.query({ keyword })).some((c) => c.id === id), keyword);
    }
    assert.ok(card.sources?.length);
    assert.match(card.sourcesCheckedOn, /^\d{4}-\d{2}-\d{2}$/);
    for (const s of card.sources) {
      assert.equal(new URL(s.url).protocol, "https:");
      assert.ok(s.title.trim() && s.sections.trim());
    }
    assert.equal(new Set(card.indicationQuizDistractorIds).size, 3);
    const allowed = card.indicationQuizDistractorIds.map((otherId) => {
      assert.notEqual(otherId, id);
      const other = cards.find((c) => c.id === otherId);
      assert.ok(other, `干扰卡片存在：${otherId}`);
      return other.indications[0];
    });
    for (const kind of kinds) {
      const q = buildQuestion(card, kind, cards, categoryNames);
      if (kind === "mechanism-order" && !card.mechanismQuiz) {
        assert.equal(q, null, "不得按正文段落强行生成顺序题");
        continue;
      }
      assert.ok(q);
      assert.equal(q.id, `${id}:${kind}`);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
      const correct = q.options.find((o) => o.id === q.correctOptionId)?.text;
      const expected = {
        target: card.target, category: categoryNames.get(card.category),
        indication: card.indications[0], "mechanism-order": card.mechanismQuiz?.steps[0],
      }[kind];
      assert.equal(correct, expected);
      assert.ok(q.explanation.includes(expected), `${kind} 解析包含依据`);
      if (kind === "indication") {
        assert.deepEqual(q.options.filter((o) => o.id !== q.correctOptionId).map((o) => o.text).sort(), [...allowed].sort());
      }
      if (kind === "target" && card.targetQuizDistractorIds) {
        assert.equal(new Set(card.targetQuizDistractorIds).size, 3);
        const targets = card.targetQuizDistractorIds.map((otherId) => {
          assert.notEqual(otherId, id);
          const other = cards.find((c) => c.id === otherId);
          assert.ok(other);
          return other.target;
        });
        assert.deepEqual(q.options.filter((o) => o.id !== q.correctOptionId).map((o) => o.text).sort(), targets.sort());
      }
      const rebuilt = generateWrongBookQuiz({
        wrongQuestions: [{ questionId: q.id, cardId: id, kind }],
        allCards: cards, categoryNames,
      });
      assert.deepEqual(rebuilt, [q]);
    }
  });
}

test("适应症人工候选不足时跳过出题，不回退到未审核的干扰项", () => {
  const card = cards.find((c) => c.id === "montelukast");
  for (const indicationQuizDistractorIds of [[], ["missing", card.id], ["metformin", "metformin", "missing"]]) {
    assert.equal(buildQuestion({ ...card, indicationQuizDistractorIds }, "indication", cards, categoryNames), null);
  }
});

test("孟鲁司特适应症题不把同样适用的过敏性鼻炎列为错误答案", () => {
  const card = cards.find((c) => c.id === "montelukast");
  const q = buildQuestion(card, "indication", cards, categoryNames);
  assert.ok(q.options.filter((o) => o.id !== q.correctOptionId).every((o) => !o.text.includes("过敏性鼻炎")));
});

test("靶点人工候选无效或不足时跳过出题，不回退到同机制选项", () => {
  const card = cards.find((c) => c.id === "famotidine");
  for (const targetQuizDistractorIds of [[], ["missing", card.id], ["metformin", "metformin", "missing"]]) {
    assert.equal(buildQuestion({ ...card, targetQuizDistractorIds }, "target", cards, categoryNames), null);
  }
});

test("新旧同机制卡片不能互为错误靶点，限制不依赖候选池顺序", () => {
  for (const [first, second] of [
    ["famotidine", "ranitidine"], ["diltiazem", "amlodipine"],
    ["clindamycin", "azithromycin"], ["epinephrine", "salbutamol"],
    ["repaglinide", "glibenclamide"], ["cetirizine", "loratadine"],
    ["carbamazepine", "phenytoin"], ["metoclopramide", "domperidone"],
    ["amoxicillin-clavulanate", "amoxicillin"],
    ["bisoprolol", "metoprolol"], ["sacubitril-valsartan", "losartan"],
    ["rivaroxaban", "apixaban"], ["febuxostat", "allopurinol"],
    ["duloxetine", "fluoxetine"], ["budesonide-formoterol", "budesonide"],
    ["cefuroxime-axetil", "ceftriaxone"], ["clotrimazole", "fluconazole"],
    ["rosuvastatin", "atorvastatin"], ["ticagrelor", "clopidogrel"],
    ["enoxaparin", "heparin"], ["dapagliflozin", "empagliflozin"],
    ["prednisolone", "dexamethasone"], ["pregabalin", "gabapentin"],
    ["escitalopram", "sertraline"], ["diclofenac", "ibuprofen"],
    ["ipratropium", "tiotropium"], ["pantoprazole", "omeprazole"],
    ["nystatin", "amphotericin-b"],
  ]) {
    for (const [id, excluded] of [[first, second], [second, first]]) {
      const card = cards.find((c) => c.id === id);
      const other = cards.find((c) => c.id === excluded);
      const safe = (card.targetQuizDistractorIds ?? ["metformin", "levothyroxine", "aciclovir"])
        .map((candidate) => cards.find((c) => c.id === candidate));
      assert.equal(buildQuestion(card, "target", [card, other, ...safe.slice(0, 2)], categoryNames), null);
      const pool = [other, card, ...safe];
      for (const candidatePool of [pool, [...pool].reverse()]) {
        const q = buildQuestion(card, "target", candidatePool, categoryNames);
        assert.ok(q, `${id} 应有足够安全候选`);
        assert.ok(q.options.every((o) => o.text !== other.target));
      }
    }
  }
});
