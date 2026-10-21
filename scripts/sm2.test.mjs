/**
 * SM-2 算法的行为验证。
 *
 * 用 Node 内置的 node:test，不引入额外测试框架。
 * 运行：node --test scripts/sm2.test.mjs
 *
 * 这个测试直接复制了 lib/review/sm2.ts 的核心逻辑，
 * 原因：TS 源文件无法被 node --test 直接加载（需要编译步骤）。
 * 为避免"测试通过但线上代码不同"，下面的实现与源文件逐行对应，
 * 若修改算法必须同步修改这里（这是有意的取舍：保持零构建依赖的测试）。
 */

import { test } from "node:test";
import assert from "node:assert/strict";

const QUALITY_MAP = { 0: 2, 1: 3, 2: 5 };
const INITIAL_EASINESS = 2.5;
const MIN_EASINESS = 1.3;

function scheduleNext(current, quality) {
  const q = QUALITY_MAP[quality];
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  const easiness = Math.max(MIN_EASINESS, current.easiness + delta);

  if (q < 3) {
    return { repetitions: 0, easiness, intervalDays: 1 };
  }

  const repetitions = current.repetitions + 1;
  let intervalDays;
  if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 6;
  else intervalDays = Math.round(current.intervalDays * easiness);

  return { repetitions, easiness, intervalDays: Math.max(1, intervalDays) };
}

function toDateKey(date) {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function calculateStreak(reviewDates, today) {
  const cursor = new Date(today.getTime());
  cursor.setHours(0, 0, 0, 0);
  if (!reviewDates.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  for (let i = 0; i < 3650; i += 1) {
    if (!reviewDates.has(toDateKey(cursor))) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const NEW = { repetitions: 0, easiness: INITIAL_EASINESS, intervalDays: 0 };

test("新卡片第一次「记住了」→ 间隔 1 天", () => {
  const result = scheduleNext(NEW, 2);
  assert.equal(result.repetitions, 1);
  assert.equal(result.intervalDays, 1);
});

test("第二次「记住了」→ 间隔 6 天", () => {
  const first = scheduleNext(NEW, 2);
  const second = scheduleNext(first, 2);
  assert.equal(second.repetitions, 2);
  assert.equal(second.intervalDays, 6);
});

test("第三次及以后按难度因子增长", () => {
  let state = NEW;
  state = scheduleNext(state, 2); // 1 天
  state = scheduleNext(state, 2); // 6 天
  const third = scheduleNext(state, 2);
  // 6 × EF（EF 已因两次满分升到 2.6 左右）
  assert.ok(third.intervalDays > 6, `期望大于 6，实际 ${third.intervalDays}`);
  assert.equal(third.intervalDays, Math.round(state.intervalDays * third.easiness));
});

test("「记住了」会提高难度因子", () => {
  const result = scheduleNext(NEW, 2);
  assert.ok(result.easiness > INITIAL_EASINESS, "EF 应上升");
  // q=5 时 delta = 0.1
  assert.equal(Math.round(result.easiness * 100) / 100, 2.6);
});

test("「模糊」会降低难度因子", () => {
  const result = scheduleNext(NEW, 1);
  // q=3 时 delta = 0.1 - 2*(0.08+2*0.02) = 0.1 - 0.24 = -0.14
  assert.equal(Math.round(result.easiness * 100) / 100, 2.36);
});

test("「没记住」重置连续次数，间隔回到 1 天", () => {
  let state = NEW;
  state = scheduleNext(state, 2);
  state = scheduleNext(state, 2);
  assert.equal(state.repetitions, 2);

  const failed = scheduleNext(state, 0);
  assert.equal(failed.repetitions, 0, "连续次数应归零");
  assert.equal(failed.intervalDays, 1, "间隔应重置为 1 天");
});

test("「没记住」显著降低难度因子", () => {
  const result = scheduleNext(NEW, 0);
  // q=2 时 delta = 0.1 - 3*(0.08+3*0.02) = 0.1 - 0.42 = -0.32
  assert.equal(Math.round(result.easiness * 100) / 100, 2.18);
});

test("难度因子不会低于 1.3", () => {
  let state = { repetitions: 0, easiness: 1.35, intervalDays: 1 };
  for (let i = 0; i < 10; i += 1) {
    state = scheduleNext(state, 0);
  }
  assert.equal(state.easiness, MIN_EASINESS);
});

test("反复答错后间隔不会变成 0 或负数", () => {
  let state = NEW;
  for (let i = 0; i < 5; i += 1) {
    state = scheduleNext(state, 0);
    assert.ok(state.intervalDays >= 1, `间隔必须 ≥1，实际 ${state.intervalDays}`);
  }
});

test("间隔随时间单调增长（全部答对）", () => {
  let state = NEW;
  const intervals = [];
  for (let i = 0; i < 6; i += 1) {
    state = scheduleNext(state, 2);
    intervals.push(state.intervalDays);
  }
  for (let i = 1; i < intervals.length; i += 1) {
    assert.ok(
      intervals[i] >= intervals[i - 1],
      `间隔应非递减，实际 ${intervals.join(",")}`,
    );
  }
});

test("连续学习天数：今天有记录", () => {
  const today = new Date(2026, 9, 18);
  const dates = new Set(["2026-10-18", "2026-10-17", "2026-10-16"]);
  assert.equal(calculateStreak(dates, today), 3);
});

test("连续学习天数：今天没记录但昨天有，streak 保留", () => {
  const today = new Date(2026, 9, 18);
  const dates = new Set(["2026-10-17", "2026-10-16"]);
  assert.equal(calculateStreak(dates, today), 2);
});

test("连续学习天数：中断则归零", () => {
  const today = new Date(2026, 9, 18);
  const dates = new Set(["2026-10-10", "2026-10-09"]);
  assert.equal(calculateStreak(dates, today), 0);
});

test("连续学习天数：完全无记录", () => {
  const today = new Date(2026, 9, 18);
  assert.equal(calculateStreak(new Set(), today), 0);
});
