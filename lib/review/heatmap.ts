/**
 * 学习热力图的网格计算。
 *
 * 纯函数、无 React 依赖，便于单元测试。展示层只负责把网格画出来。
 *
 * 设计参考 GitHub 贡献图：一列是一周，纵向是周一到周日。
 * 但做了两处调整，因为本项目的使用场景与代码提交不同：
 *
 * 1. **从周一开始**而不是周日。中文语境下「这周」从周一开始，
 *    周日排在最下面也更符合日历直觉。
 * 2. **只画到「今天」**，未来日期留空而不是画成灰色格子。
 *    灰色空格会被误读成「那天没学」，而实际上是「还没到」。
 */

import { startOfLocalDay, toDateKey } from "@/lib/review/sm2";

/** 一周 7 天，从周一开始 */
export const DAYS_PER_WEEK = 7;

/** 热力图的等级：0 表示没学，1~4 表示强度递增 */
export type HeatLevel = 0 | 1 | 2 | 3 | 4;

/** 一个日期格子 */
export interface HeatCell {
  /** YYYY-MM-DD */
  date: string;
  /** 当天复习次数 */
  count: number;
  level: HeatLevel;
  /** 是否是未来日期（渲染时留空） */
  isFuture: boolean;
  /** 是否就是今天，用于加描边 */
  isToday: boolean;
  /** 日期在月内的日号，用于显示月份标签 */
  dayOfMonth: number;
}

/** 一周的一列 */
export interface HeatWeek {
  /** 这一列的 7 个格子；未来日期为 null */
  cells: Array<HeatCell | null>;
  /** 这一列里第一个非空格子所属月份（1-12），用于顶部月份标签 */
  monthLabel: number | null;
}

export interface HeatmapGrid {
  weeks: HeatWeek[];
  /** 总复习次数 */
  totalCount: number;
  /** 有学习记录的天数 */
  activeDays: number;
  /** 最长连续学习天数（在给定区间内） */
  longestStreak: number;
  /** 当前连续学习天数 */
  currentStreak: number;
}

/**
 * 把复习次数映射成 0~4 的等级。
 *
 * 阈值不是等分的，因为实际使用中「一天复习 1~3 张」是常态，
 * 等分会让大多数日子都挤在最低档，看不出差异。
 * 这里用 1 / 4 / 8 / 12 作为分界，符合「少量多次」的学习节奏。
 */
export function countToLevel(count: number): HeatLevel {
  if (count <= 0) return 0;
  if (count < 4) return 1;
  if (count < 8) return 2;
  if (count < 12) return 3;
  return 4;
}

/** 取某天的学习日期键，用于和数据库里的 reviewed_on 对齐 */
function dateKey(date: Date): string {
  return toDateKey(date);
}

/** 把日期归一到当天 00:00（UTC+8），避免时间部分干扰天数差计算 */
function startOfDay(date: Date): Date {
  return startOfLocalDay(date);
}

/**
 * 计算从周一开始的星期索引：周一 = 0，周日 = 6。
 *
 * JS 的 getDay() 是周日 = 0，直接用会导致整张图错位一天。
 */
export function mondayFirstIndex(date: Date): number {
  const jsDay = new Date(toDateKey(date) + "T00:00:00Z").getUTCDay(); // 0=周日
  return (jsDay + 6) % 7;
}

/**
 * 生成热力图网格。
 *
 * @param dailyCounts 稀疏的「日期 → 复习次数」数据
 * @param today 今天（用于确定右边界与「未来」判定）
 * @param weeks 要显示多少周，默认 26 周（约半年）
 */
export function buildHeatmapGrid(
  dailyCounts: ReadonlyArray<{ date: string; count: number }>,
  today: Date,
  weeks = 26,
): HeatmapGrid {
  const countByDate = new Map<string, number>();
  for (const entry of dailyCounts) {
    countByDate.set(entry.date, entry.count);
  }

  const todayStart = startOfDay(today);
  const todayKey = dateKey(todayStart);

  // 右边界：本周的周日（这样最后一列是完整的一周，视觉上不残缺）
  const todayWeekday = mondayFirstIndex(todayStart);
  const endOfThisWeek = new Date(todayStart);
  endOfThisWeek.setTime(endOfThisWeek.getTime() + (6 - todayWeekday) * 86_400_000);

  // 左边界：从右边界往前推 weeks 周，并回退到那一周的周一
  const startDate = new Date(endOfThisWeek);
  startDate.setTime(startDate.getTime() - (weeks * DAYS_PER_WEEK - 1) * 86_400_000);

  const weekList: HeatWeek[] = [];
  let totalCount = 0;
  let activeDays = 0;

  const cursor = new Date(startDate);

  for (let weekIndex = 0; weekIndex < weeks; weekIndex += 1) {
    const cells: Array<HeatCell | null> = [];
    let monthLabel: number | null = null;

    for (let dayIndex = 0; dayIndex < DAYS_PER_WEEK; dayIndex += 1) {
      const current = new Date(cursor);
      const key = dateKey(current);
      const isFuture = current.getTime() > todayStart.getTime();

      if (isFuture) {
        cells.push(null);
      } else {
        const count = countByDate.get(key) ?? 0;
        if (count > 0) {
          totalCount += count;
          activeDays += 1;
        }
        cells.push({
          date: key,
          count,
          level: countToLevel(count),
          isFuture: false,
          isToday: key === todayKey,
          dayOfMonth: Number(key.slice(8, 10)),
        });
        // 这一列第一次出现的月份作为标签
        if (monthLabel === null) {
          monthLabel = Number(key.slice(5, 7));
        }
      }

      cursor.setTime(cursor.getTime() + 86_400_000);
    }

    weekList.push({ cells, monthLabel });
  }

  const { longest, current } = computeStreaks(weekList);

  return {
    weeks: weekList,
    totalCount,
    activeDays,
    longestStreak: longest,
    currentStreak: current,
  };
}

/**
 * 计算最长连续天数与当前连续天数。
 *
 * 当前连续天数的判定：从今天往回数，直到遇到「没学」的一天。
 * 如果今天还没学但昨天学了，算作连续（当天还没开始不算断签）——
 * 这与常见学习类应用的行为一致，也避免早上打开就看到「连续 0 天」。
 */
function computeStreaks(weeks: readonly HeatWeek[]): {
  longest: number;
  current: number;
} {
  const flat: HeatCell[] = [];
  for (const week of weeks) {
    for (const cell of week.cells) {
      if (cell) flat.push(cell);
    }
  }

  let longest = 0;
  let running = 0;
  for (const cell of flat) {
    if (cell.count > 0) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  // 从末尾往回数当前连续天数
  let current = 0;
  let index = flat.length - 1;

  // 今天没学但昨天学了：跳过今天继续数
  const last = flat[index];
  if (last && last.count === 0) {
    index -= 1;
  }

  while (index >= 0) {
    const cell = flat[index];
    if (!cell || cell.count === 0) break;
    current += 1;
    index -= 1;
  }

  return { longest, current };
}
