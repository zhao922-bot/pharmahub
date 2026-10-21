/**
 * 学习热力图网格计算单元测试。
 *
 * 直接 import 真实源码。重点验证：
 * 1. 周一起始（JS 的 getDay() 是周日=0，最容易错的地方）
 * 2. 未来日期不出格子（否则会被误读成「那天没学」）
 * 3. 等级映射的阈值
 * 4. 连续天数的计算（含「今天没学但昨天学了」的边界）
 * 5. 月份标签只在月份变化时出现
 *
 * 运行：pnpm test
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildHeatmapGrid,
  countToLevel,
  DAYS_PER_WEEK,
  mondayFirstIndex,
} from "../lib/review/heatmap.ts";

// ---- 周索引 ----

test("周一返回 0", () => {
  // 2026-10-19 是周一
  assert.equal(mondayFirstIndex(new Date("2026-10-19T00:00:00+08:00")), 0);
});

test("周日返回 6（不是 0）", () => {
  // 2026-10-25 是周日；JS 的 getDay() 返回 0，必须转成 6
  assert.equal(mondayFirstIndex(new Date("2026-10-25T00:00:00+08:00")), 6);
});

test("周三返回 2", () => {
  assert.equal(mondayFirstIndex(new Date("2026-10-21T00:00:00+08:00")), 2);
});

// ---- 等级映射 ----

test("0 次为 0 级", () => {
  assert.equal(countToLevel(0), 0);
});

test("1~3 次为 1 级", () => {
  assert.equal(countToLevel(1), 1);
  assert.equal(countToLevel(3), 1);
});

test("4~7 次为 2 级", () => {
  assert.equal(countToLevel(4), 2);
  assert.equal(countToLevel(7), 2);
});

test("8~11 次为 3 级", () => {
  assert.equal(countToLevel(8), 3);
  assert.equal(countToLevel(11), 3);
});

test("12 次以上为 4 级", () => {
  assert.equal(countToLevel(12), 4);
  assert.equal(countToLevel(100), 4);
});

test("负数按 0 级处理", () => {
  assert.equal(countToLevel(-1), 0);
});

// ---- 网格结构 ----

test("网格列数等于请求的周数", () => {
  const grid = buildHeatmapGrid([], new Date("2026-10-19T00:00:00+08:00"), 10);
  assert.equal(grid.weeks.length, 10);
});

test("每列恰好 7 个位置", () => {
  const grid = buildHeatmapGrid([], new Date("2026-10-19T00:00:00+08:00"), 5);
  for (const week of grid.weeks) {
    assert.equal(week.cells.length, DAYS_PER_WEEK);
  }
});

test("最后一列包含今天", () => {
  const today = new Date("2026-10-19T00:00:00+08:00"); // 周一
  const grid = buildHeatmapGrid([], today, 4);
  const lastWeek = grid.weeks[grid.weeks.length - 1];
  const dates = lastWeek.cells.filter(Boolean).map((c) => c.date);
  assert.ok(dates.includes("2026-10-19"), `最后一列应含今天，实际 ${dates.join(",")}`);
});

test("未来日期为 null 而不是 0 次的格子", () => {
  const today = new Date("2026-10-19T00:00:00+08:00"); // 周一
  const grid = buildHeatmapGrid([], today, 2);
  const lastWeek = grid.weeks[grid.weeks.length - 1];
  // 周一是今天，周二到周日都是未来
  assert.ok(lastWeek.cells[0] !== null, "今天应有格子");
  for (let i = 1; i < DAYS_PER_WEEK; i += 1) {
    assert.equal(lastWeek.cells[i], null, `第 ${i} 天（未来）应为 null`);
  }
});

test("今天被标记 isToday", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid([], today, 3);
  const allCells = grid.weeks.flatMap((w) => w.cells.filter(Boolean));
  const todayCell = allCells.find((c) => c.date === "2026-10-19");
  assert.ok(todayCell);
  assert.equal(todayCell.isToday, true);
});

test("只有今天被标记 isToday", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid([], today, 3);
  const allCells = grid.weeks.flatMap((w) => w.cells.filter(Boolean));
  assert.equal(allCells.filter((c) => c.isToday).length, 1);
});

// ---- 数据填充 ----

test("复习次数被正确填入对应日期", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid(
    [{ date: "2026-10-19", count: 5 }],
    today,
    2,
  );
  const allCells = grid.weeks.flatMap((w) => w.cells.filter(Boolean));
  const cell = allCells.find((c) => c.date === "2026-10-19");
  assert.equal(cell.count, 5);
  assert.equal(cell.level, 2, "5 次应为 2 级");
});

test("没有记录的日期为 0 次", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid([], today, 2);
  const allCells = grid.weeks.flatMap((w) => w.cells.filter(Boolean));
  assert.ok(allCells.every((c) => c.count === 0));
});

test("总次数与学习天数正确统计", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid(
    [
      { date: "2026-10-19", count: 3 },
      { date: "2026-10-18", count: 4 },
      { date: "2026-10-15", count: 1 },
    ],
    today,
    4,
  );
  assert.equal(grid.totalCount, 8);
  assert.equal(grid.activeDays, 3);
});

// ---- 连续天数 ----

test("连续 3 天能算出最长与当前连续", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid(
    [
      { date: "2026-10-19", count: 1 },
      { date: "2026-10-18", count: 1 },
      { date: "2026-10-17", count: 1 },
    ],
    today,
    4,
  );
  assert.equal(grid.currentStreak, 3);
  assert.equal(grid.longestStreak, 3);
});

test("中断后当前连续归零", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid(
    [
      // 今天和昨天都没学，只有前天学了
      { date: "2026-10-17", count: 1 },
    ],
    today,
    4,
  );
  assert.equal(grid.currentStreak, 0);
  assert.equal(grid.longestStreak, 1);
});

test("今天没学但昨天学了，当前连续仍算数", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid(
    [
      { date: "2026-10-18", count: 1 },
      { date: "2026-10-17", count: 1 },
    ],
    today,
    4,
  );
  assert.equal(
    grid.currentStreak,
    2,
    "当天还没开始学不应算断签，否则早上打开就看到 0 天",
  );
});

test("最长连续取历史最大值而非最后一段", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid(
    [
      // 较早的连续 4 天
      { date: "2026-10-01", count: 1 },
      { date: "2026-10-02", count: 1 },
      { date: "2026-10-03", count: 1 },
      { date: "2026-10-04", count: 1 },
      // 最近的连续 2 天
      { date: "2026-10-18", count: 1 },
      { date: "2026-10-19", count: 1 },
    ],
    today,
    5,
  );
  assert.equal(grid.longestStreak, 4);
  assert.equal(grid.currentStreak, 2);
});

// ---- 月份标签 ----

test("月份标签在月份变化时更新", () => {
  // 从 9 月底跨到 10 月
  const today = new Date("2026-10-19T00:00:00+08:00");
  const grid = buildHeatmapGrid([], today, 8);
  const labels = grid.weeks.map((w) => w.monthLabel).filter((m) => m !== null);
  assert.ok(labels.includes(9), "应包含 9 月");
  assert.ok(labels.includes(10), "应包含 10 月");
});

test("空网格不报错", () => {
  const grid = buildHeatmapGrid([], new Date("2026-10-19T00:00:00+08:00"), 1);
  assert.equal(grid.weeks.length, 1);
  assert.equal(grid.totalCount, 0);
  assert.equal(grid.activeDays, 0);
});

// ---- 与 SM-2 的连续天数一致性 ----
// 两处都在算「当前连续天数」：首页进度卡用 calculateStreak，
// 热力图用 buildHeatmapGrid。算法不同（一个查 Set，一个扫网格），
// 必须保证结果一致，否则用户会看到两个互相矛盾的数字。

import { calculateStreak } from "../lib/review/sm2.ts";

test("当前连续天数与 SM-2 的 calculateStreak 一致（今天有记录）", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const dates = ["2026-10-19", "2026-10-18", "2026-10-17"];
  const set = new Set(dates);
  const grid = buildHeatmapGrid(dates.map((date) => ({ date, count: 1 })), today, 6);
  assert.equal(grid.currentStreak, calculateStreak(set, today));
  assert.equal(grid.currentStreak, 3);
});

test("当前连续天数与 SM-2 的 calculateStreak 一致（今天无记录）", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const dates = ["2026-10-18", "2026-10-17", "2026-10-16"];
  const set = new Set(dates);
  const grid = buildHeatmapGrid(dates.map((date) => ({ date, count: 2 })), today, 6);
  assert.equal(grid.currentStreak, calculateStreak(set, today));
  assert.equal(grid.currentStreak, 3);
});

test("当前连续天数与 SM-2 一致（完全断签）", () => {
  const today = new Date("2026-10-19T00:00:00+08:00");
  const dates = ["2026-10-10"];
  const set = new Set(dates);
  const grid = buildHeatmapGrid(dates.map((date) => ({ date, count: 1 })), today, 6);
  assert.equal(grid.currentStreak, calculateStreak(set, today));
  assert.equal(grid.currentStreak, 0);
});
