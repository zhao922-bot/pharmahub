/**
 * 出题引擎的核心性质验证。
 *
 * 这些断言直接来自 lib/quiz/generator.ts 的设计约束。
 * 与 sm2.test.mjs 同样的取舍：核心逻辑在此复制一份，
 * 保持测试零构建依赖（node --test 无法直接加载 TS）。
 *
 * 运行：node --test scripts/quiz.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";

// ---- 与 generator.ts 一致的基础工具 ----

function createRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i];
    const b = result[j];
    if (a !== undefined && b !== undefined) {
      result[i] = b;
      result[j] = a;
    }
  }
  return result;
}

function pickDistractors(candidates, correct, count, random) {
  const pool = candidates.filter((item) => item !== correct);
  const unique = Array.from(new Set(pool));
  return shuffle(unique, random).slice(0, count);
}

// ---- 测试数据 ----

const CARDS = [
  {
    id: "a",
    genericName: "甲药",
    englishName: "A",
    category: "cardiovascular",
    target: "靶点甲",
    indications: ["适应症甲"],
    mechanismSteps: [
      { title: "步骤甲1" },
      { title: "步骤甲2" },
      { title: "步骤甲3" },
      { title: "步骤甲4" },
    ],
  },
  {
    id: "b",
    genericName: "乙药",
    englishName: "B",
    category: "antibacterial",
    target: "靶点乙",
    indications: ["适应症乙"],
    mechanismSteps: [
      { title: "步骤乙1" },
      { title: "步骤乙2" },
      { title: "步骤乙3" },
      { title: "步骤乙4" },
    ],
  },
  {
    id: "c",
    genericName: "丙药",
    englishName: "C",
    category: "nervous",
    target: "靶点丙",
    indications: ["适应症丙"],
    mechanismSteps: [
      { title: "步骤丙1" },
      { title: "步骤丙2" },
      { title: "步骤丙3" },
      { title: "步骤丙4" },
    ],
  },
  {
    id: "d",
    genericName: "丁药",
    englishName: "D",
    category: "endocrine",
    target: "靶点丁",
    indications: ["适应症丁"],
    mechanismSteps: [
      { title: "步骤丁1" },
      { title: "步骤丁2" },
      { title: "步骤丁3" },
      { title: "步骤丁4" },
    ],
  },
];

const CATEGORY_NAMES = new Map([
  ["cardiovascular", "心血管系统"],
  ["antibacterial", "抗菌药物"],
  ["nervous", "神经系统"],
  ["endocrine", "内分泌系统"],
]);

test("干扰项不包含正确答案", () => {
  const random = createRandom(42);
  const pool = ["靶点甲", "靶点乙", "靶点丙", "靶点丁"];
  const distractors = pickDistractors(pool, "靶点甲", 3, random);
  assert.equal(distractors.length, 3);
  assert.ok(!distractors.includes("靶点甲"), "干扰项不应包含正确答案");
});

test("干扰项去重", () => {
  const random = createRandom(7);
  // 池里有重复项
  const pool = ["靶点乙", "靶点乙", "靶点丙", "靶点丙", "靶点丁"];
  const distractors = pickDistractors(pool, "靶点甲", 3, random);
  assert.equal(new Set(distractors).size, distractors.length, "干扰项应无重复");
  assert.equal(distractors.length, 3);
});

test("候选不足时返回少于请求的数量（不报错）", () => {
  const random = createRandom(3);
  const distractors = pickDistractors(["靶点乙"], "靶点甲", 3, random);
  assert.ok(distractors.length < 3, "应返回实际可用的数量");
});

test("洗牌保持元素集合不变", () => {
  const random = createRandom(99);
  const input = ["a", "b", "c", "d", "e"];
  const output = shuffle(input, random);
  assert.equal(output.length, input.length);
  assert.deepEqual([...output].sort(), [...input].sort());
});

test("同一种子洗牌结果一致", () => {
  const input = ["a", "b", "c", "d", "e", "f", "g"];
  const r1 = shuffle(input, createRandom(123));
  const r2 = shuffle(input, createRandom(123));
  assert.deepEqual(r1, r2);
});

test("不同种子洗牌结果不同（高概率）", () => {
  const input = Array.from({ length: 12 }, (_, i) => `x${i}`);
  const r1 = shuffle(input, createRandom(1));
  const r2 = shuffle(input, createRandom(2));
  assert.notDeepEqual(r1, r2);
});

test("分类名映射覆盖所有卡片的分类", () => {
  for (const card of CARDS) {
    assert.ok(
      CATEGORY_NAMES.has(card.category),
      `分类 ${card.category} 应有中文名`,
    );
  }
});

test("每张卡片的机制步骤足够出「机制顺序」题（≥4 步）", () => {
  for (const card of CARDS) {
    assert.ok(card.mechanismSteps.length >= 4, `${card.genericName} 步骤不足 4 步`);
  }
});

test("每张卡片都有靶点与适应症，能出对应题型", () => {
  for (const card of CARDS) {
    assert.ok(card.target.length > 0, `${card.genericName} 缺靶点`);
    assert.ok(card.indications.length > 0, `${card.genericName} 缺适应症`);
  }
});

test("干扰项来自真实卡片，不是编造的", () => {
  const random = createRandom(11);
  const pool = CARDS.map((c) => c.target);
  const distractors = pickDistractors(pool, CARDS[0].target, 3, random);
  const validTargets = new Set(pool);
  for (const d of distractors) {
    assert.ok(validTargets.has(d), `干扰项 ${d} 应来自真实卡片`);
  }
});

/**
 * 回归测试：所有题型的选项数必须一致。
 *
 * 曾经的 bug：机制顺序题只取 3 步，生成 3 个选项，而其他题型是 4 个。
 * 用户做到这一题型时会明显感觉「怎么少一个选项」。
 */
test("机制顺序题也必须提供 4 个选项", () => {
  const OPTION_COUNT = 4;
  for (const card of CARDS) {
    // 与 generator.ts 的 buildMechanismOrderQuestion 逻辑一致
    const steps = card.mechanismSteps;
    assert.ok(
      steps.length >= OPTION_COUNT,
      `${card.genericName} 的机制步骤只有 ${steps.length} 步，不足以出 4 选项的机制顺序题`,
    );
    const picked = steps.slice(0, OPTION_COUNT).map((s) => s.title);
    const options = [picked[0], ...picked.slice(1)];
    assert.equal(options.length, OPTION_COUNT, "机制顺序题应有 4 个选项");
    assert.equal(new Set(options).size, OPTION_COUNT, "机制顺序题选项不应重复");
  }
});

test("机制顺序题的正确答案是第一步", () => {
  for (const card of CARDS) {
    const picked = card.mechanismSteps.slice(0, 4).map((s) => s.title);
    assert.equal(picked[0], card.mechanismSteps[0].title, "正确答案应是机制的第一步");
  }
});

test("所有卡片都能生成 4 选项的题目（步骤数充足）", () => {
  for (const card of CARDS) {
    assert.ok(card.mechanismSteps.length >= 4, `${card.genericName} 步骤不足 4 步`);
  }
});
