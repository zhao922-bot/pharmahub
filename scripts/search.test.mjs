/**
 * 搜索逻辑单元测试。
 *
 * 直接 import 真实的 TS 源码（Node 22 的 --experimental-strip-types），
 * 而不是把逻辑复制一份——搜索的归一化规则很容易写错，
 * 复制一份测试等于测了个假货。
 *
 * 运行：node --test scripts/search.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  normalizeSearchText,
  normalizeWithMap,
  tokenizeQuery,
  buildSearchIndex,
  searchCardIndex,
  buildSnippet,
  splitHighlighted,
} from "../lib/search/index.ts";

// ---- 测试数据 ----

const CARDS = [
  {
    id: "metoprolol",
    genericName: "美托洛尔",
    englishName: "Metoprolol",
    brandNames: ["倍他乐克"],
    categoryName: "心血管系统",
    target: "选择性阻断心肌 β1 肾上腺素受体",
    indications: ["高血压", "心绞痛"],
    mechanismSteps: [
      { title: "口服吸收后到达心肌", detail: "药物经门静脉进入体循环，随血流分布到心脏。" },
      { title: "竞争性占据 β1 受体", detail: "与去甲肾上腺素竞争同一位点，但不激活受体。" },
      { title: "阻断 Gs 蛋白偶联的信号通路", detail: "腺苷酸环化酶不被活化，cAMP 生成减少。" },
    ],
    adverseReactions: ["心动过缓", "支气管痉挛"],
    memoryTip: "β1 阻断，心率下降。",
  },
  {
    id: "metformin",
    genericName: "二甲双胍",
    englishName: "Metformin",
    brandNames: ["格华止"],
    categoryName: "内分泌系统",
    target: "激活 AMPK，减少肝糖输出",
    indications: ["2 型糖尿病"],
    mechanismSteps: [
      { title: "进入肝细胞", detail: "经有机阳离子转运体 OCT1 摄取。" },
      { title: "轻度抑制线粒体复合体Ⅰ", detail: "ATP 生成减少，AMP/ATP 比值升高。" },
      { title: "激活 AMPK", detail: "下游糖异生关键酶转录受抑。" },
    ],
    adverseReactions: ["胃肠道反应", "乳酸性酸中毒"],
    memoryTip: "让肝以为能量不够。",
  },
];

const INDEX = buildSearchIndex(CARDS);

// ---- 归一化 ----

test("归一化：全角转半角", () => {
  assert.equal(normalizeSearchText("β１"), "beta1");
  assert.equal(normalizeSearchText("ＡＢＣ"), "abc");
});

test("归一化：希腊字母转英文拼写", () => {
  assert.equal(normalizeSearchText("β1"), "beta1");
  assert.equal(normalizeSearchText("α"), "alpha");
  assert.equal(normalizeSearchText("μ"), "mu");
});

test("归一化：繁体转简体", () => {
  assert.equal(normalizeSearchText("膽"), "胆");
  assert.equal(normalizeSearchText("藥"), "药");
  assert.equal(normalizeSearchText("受體"), "受体");
});

test("归一化：丢弃空白", () => {
  assert.equal(normalizeSearchText("β1 受体"), "beta1受体");
  assert.equal(normalizeSearchText(" a b c "), "abc");
});

test("归一化保留原文下标映射", () => {
  const { text, map } = normalizeWithMap("β1受体");
  // β(1) → b,e,t,a(4)，1 → 1，受 → 受，体 → 体
  assert.equal(text, "beta1受体");
  assert.equal(map.length, text.length);
  // 前 4 个归一化字符都来自原文下标 0（β）
  assert.deepEqual(map.slice(0, 4), [0, 0, 0, 0]);
  // 原文下标 1 的 '1' 对应归一化下标 4
  assert.equal(map[4], 1);
});

test("分词：按空白切分后再归一化", () => {
  assert.deepEqual(tokenizeQuery("β1 阻断"), ["beta1", "阻断"]);
  assert.deepEqual(tokenizeQuery("  高血压  "), ["高血压"]);
  assert.deepEqual(tokenizeQuery("   "), []);
});

// ---- 搜索 ----

test("空查询返回全部，且不带命中信息", () => {
  const hits = searchCardIndex(INDEX, "");
  assert.equal(hits.length, 2);
  assert.ok(hits.every((hit) => hit.match === null));
});

test("按药名搜索命中", () => {
  const hits = searchCardIndex(INDEX, "美托洛尔");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].id, "metoprolol");
  assert.equal(hits[0].match.field.kind, "genericName");
});

test("按机制步骤正文搜索（原实现做不到）", () => {
  // 「cAMP」只出现在美托洛尔的第 3 步 detail 里
  const hits = searchCardIndex(INDEX, "cAMP");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].id, "metoprolol");
  assert.equal(hits[0].match.field.kind, "mechanismStep");
  assert.equal(hits[0].match.field.stepIndex, 3);
});

test("按不良反应搜索（原实现做不到）", () => {
  const hits = searchCardIndex(INDEX, "乳酸性酸中毒");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].id, "metformin");
  assert.equal(hits[0].match.field.kind, "adverseReaction");
});

test("按记忆要点搜索（原实现做不到）", () => {
  const hits = searchCardIndex(INDEX, "让肝以为能量不够");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].id, "metformin");
  assert.equal(hits[0].match.field.kind, "memoryTip");
});

test("希腊字母与英文拼写互搜", () => {
  const byGreek = searchCardIndex(INDEX, "β1");
  const byAscii = searchCardIndex(INDEX, "beta1");
  assert.equal(byGreek.length, byAscii.length);
  assert.ok(byGreek.length >= 1);
  assert.deepEqual(
    byGreek.map((h) => h.id),
    byAscii.map((h) => h.id),
  );
});

test("繁体输入可搜到简体内容", () => {
  // 「受體」是繁体，卡片里是「受体」
  const hits = searchCardIndex(INDEX, "受體");
  assert.ok(hits.length >= 1, "繁体查询应能命中简体内容");
});

test("多词元是 AND 语义", () => {
  // 「阻断」与「受体」都在美托洛尔里
  assert.equal(searchCardIndex(INDEX, "阻断 受体").length, 1);
  // 「阻断」不在二甲双胍里，两个词同时命中只可能是美托洛尔
  assert.equal(searchCardIndex(INDEX, "阻断 受体")[0].id, "metoprolol");
});

test("无匹配返回空数组", () => {
  assert.deepEqual(searchCardIndex(INDEX, "不存在的词xyz"), []);
});

test("药名命中的得分高于正文命中", () => {
  const nameHit = searchCardIndex(INDEX, "二甲双胍")[0];
  const bodyHit = searchCardIndex(INDEX, "乳酸性酸中毒")[0];
  assert.ok(nameHit.score > bodyHit.score, "药名命中应排在正文命中之前");
});

test("同分结果按 id 稳定排序", () => {
  // 两次调用结果必须完全一致
  const first = searchCardIndex(INDEX, "受体").map((h) => h.id);
  const second = searchCardIndex(INDEX, "受体").map((h) => h.id);
  assert.deepEqual(first, second);
});

// ---- 片段与高亮 ----

test("片段包含命中词并带省略号（命中在中间）", () => {
  // 关键词前后都要有足够多的字，才会同时出现前后省略号
  const longText =
    "这是一段非常长的文本，前面铺垫了很多很多内容，中间包含关键词，后面还有很多内容继续写下去不断延伸";
  const { text } = buildSnippet(longText, ["关键词"]);
  assert.ok(text.includes("关键词"));
  assert.ok(text.startsWith("…"), "前面被截断应有省略号");
  assert.ok(text.endsWith("…"), "后面被截断应有省略号");
});

test("片段在命中位于开头时不加前缀省略号", () => {
  const { text } = buildSnippet("关键词出现在最开头，后面还有很多内容继续写下去不断延伸", [
    "关键词",
  ]);
  assert.ok(text.startsWith("关键词"), "开头命中不应加前缀省略号");
  assert.ok(text.endsWith("…"), "后面被截断应有省略号");
});

test("片段在命中位于结尾时不加后缀省略号", () => {
  const { text } = buildSnippet("前面有很多很多内容铺垫然后才出现关键词", ["关键词"]);
  assert.ok(text.startsWith("…"), "前面被截断应有省略号");
  assert.ok(text.endsWith("关键词"), "结尾命中不应加后缀省略号");
});

test("片段高亮区间准确覆盖命中词", () => {
  const { text, ranges } = buildSnippet("阻断β1受体产生效应", ["beta1"]);
  assert.equal(ranges.length, 1);
  const range = ranges[0];
  // 高亮出来的应当是原文里的 "β1"，而不是归一化后的 "beta1"
  assert.equal(text.slice(range.start, range.end), "β1");
});

test("splitHighlighted 正确切分", () => {
  const parts = splitHighlighted("abcDEFghi", [{ start: 3, end: 6 }]);
  assert.deepEqual(parts, [
    { text: "abc", highlighted: false },
    { text: "DEF", highlighted: true },
    { text: "ghi", highlighted: false },
  ]);
});

test("splitHighlighted 合并重叠区间", () => {
  const parts = splitHighlighted("abcdef", [
    { start: 1, end: 4 },
    { start: 3, end: 5 },
  ]);
  assert.deepEqual(parts, [
    { text: "a", highlighted: false },
    { text: "bcde", highlighted: true },
    { text: "f", highlighted: false },
  ]);
});

test("splitHighlighted 无区间时原样返回", () => {
  assert.deepEqual(splitHighlighted("abc", []), [{ text: "abc", highlighted: false }]);
});

test("命中多个字段时统计其他命中数", () => {
  // 「受体」出现在 target 与 mechanismStep 里
  const hit = searchCardIndex(INDEX, "受体")[0];
  assert.ok(hit.match.otherMatchCount >= 1, "应统计到其他字段的命中");
});
