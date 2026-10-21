/**
 * 对比分组数据单元测试。
 *
 * 对比视图的价值完全依赖数据完整性：一行缺值表格就有空洞，
 * 一个 id 写错整组就渲染不出来。这些在 TypeScript 里查不出来
 * （drugIds 只是 string[]），所以必须有测试兜底。
 *
 * 运行：pnpm test
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { COMPARE_GROUPS } from "../lib/data/compares.ts";
import { cardRepository } from "../lib/data/cards/index.ts";

const cards = await cardRepository.getAll();
const cardIds = new Set(cards.map((card) => card.id));

// ---- 基础完整性 ----

test("对比分组非空", () => {
  assert.ok(COMPARE_GROUPS.length > 0);
});

test("分组 id 唯一", () => {
  const ids = COMPARE_GROUPS.map((group) => group.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("每个分组都有标题与摘要", () => {
  for (const group of COMPARE_GROUPS) {
    assert.ok(group.title.length > 0, `${group.id} 缺标题`);
    assert.ok(group.summary.length > 0, `${group.id} 缺摘要`);
  }
});

// ---- 药物 id 有效性 ----

test("所有 drugId 都存在于卡片库", () => {
  for (const group of COMPARE_GROUPS) {
    for (const drugId of group.drugIds) {
      assert.ok(cardIds.has(drugId), `${group.id} 引用了不存在的卡片: ${drugId}`);
    }
  }
});

test("组内药物不重复", () => {
  for (const group of COMPARE_GROUPS) {
    assert.equal(
      new Set(group.drugIds).size,
      group.drugIds.length,
      `${group.id} 内药物重复`,
    );
  }
});

test("每组至少 2 个药物、最多 4 个", () => {
  for (const group of COMPARE_GROUPS) {
    assert.ok(group.drugIds.length >= 2, `${group.id} 药物少于 2 个`);
    // 上限 4 个：375px 下超过 4 列，配色会循环重复，扫视时无法区分
    assert.ok(group.drugIds.length <= 4, `${group.id} 药物超过 4 个`);
  }
});

// ---- 维度完整性（最容易出错的一项）----

test("每个维度的取值数与药物数一致", () => {
  for (const group of COMPARE_GROUPS) {
    for (const row of group.rows) {
      assert.equal(
        row.values.length,
        group.drugIds.length,
        `${group.id} 的维度「${row.label}」有 ${row.values.length} 个值，药物有 ${group.drugIds.length} 个`,
      );
    }
  }
});

test("维度取值都不为空", () => {
  for (const group of COMPARE_GROUPS) {
    for (const row of group.rows) {
      for (const [index, value] of row.values.entries()) {
        assert.ok(
          value && value.trim().length > 0,
          `${group.id} 的维度「${row.label}」第 ${index + 1} 个值为空`,
        );
      }
    }
  }
});

test("维度名在组内不重复", () => {
  for (const group of COMPARE_GROUPS) {
    const labels = group.rows.map((row) => row.label);
    assert.equal(new Set(labels).size, labels.length, `${group.id} 维度名重复`);
  }
});

test("每组至少 2 个维度", () => {
  for (const group of COMPARE_GROUPS) {
    assert.ok(group.rows.length >= 2, `${group.id} 维度少于 2 个`);
  }
});

// ---- takeaways ----

test("每组都有关键差异点", () => {
  for (const group of COMPARE_GROUPS) {
    assert.ok(group.takeaways.length > 0, `${group.id} 缺少 takeaways`);
  }
});

test("关键差异点不为空字符串", () => {
  for (const group of COMPARE_GROUPS) {
    for (const takeaway of group.takeaways) {
      assert.ok(takeaway.trim().length > 0, `${group.id} 有空的 takeaway`);
    }
  }
});

// ---- 唯一性约束 ----

test("同一组药物不重复出现在多个分组", () => {
  const seen = new Map();
  for (const group of COMPARE_GROUPS) {
    const key = [...group.drugIds].sort().join("+");
    assert.ok(!seen.has(key), `${group.id} 与 ${seen.get(key)} 对比的是同一组药物`);
    seen.set(key, group.id);
  }
});

// ---- 渲染可行性 ----

test("每个分组至少有一个维度取值存在差异", () => {
  // 如果所有维度取值都相同，这个对比就没有意义
  for (const group of COMPARE_GROUPS) {
    const hasDifference = group.rows.some(
      (row) => new Set(row.values).size > 1,
    );
    assert.ok(hasDifference, `${group.id} 所有维度取值都相同，没有对比价值`);
  }
});

test("分组 id 只含小写字母、数字与连字符（可安全用于 URL）", () => {
  for (const group of COMPARE_GROUPS) {
    assert.match(group.id, /^[a-z0-9-]+$/, `${group.id} 含不适合 URL 的字符`);
  }
});
