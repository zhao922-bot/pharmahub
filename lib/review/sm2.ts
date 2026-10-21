import type { ReviewLog, ReviewQuality } from "@/lib/types";

/**
 * SM-2 间隔重复算法。
 *
 * 纯函数实现，不依赖数据库或日期库，便于单独测试。
 * 算法来源：SuperMemo 2（Piotr Wozniak, 1987），这是 Anki 等记忆软件的基础算法。
 *
 * 与标准 SM-2 的差异（必须说明，否则复习节奏会与预期不符）：
 * 标准 SM-2 使用 0~5 六级评分。本项目按产品需求只用三档自评，
 * 映射关系为：
 *   0「没记住」 → quality 2（完全想不起来）
 *   1「模糊」   → quality 3（想起来了但很吃力，勉强正确）
 *   2「记住了」 → quality 5（轻松准确回忆）
 *
 * 注意 quality 4（犹豫后正确）没有被使用：三档设计下没有对应选项。
 * 这会让「模糊」的难度因子略低于标准 SM-2 的 quality 4，复习间隔增长稍慢，
 * 属于偏保守的取舍——宁可多复习一次，也不要过早遗忘。
 */

/** SM-2 的难度因子初始值 */
export const INITIAL_EASINESS = 2.5;

/** 难度因子下限，低于此值间隔将不再缩短 */
export const MIN_EASINESS = 1.3;

/** 三档自评 → SM-2 的 0~5 评分 */
const QUALITY_MAP: Record<ReviewQuality, number> = {
  0: 2,
  1: 3,
  2: 5,
};

/** 首次与第二次答对时的固定间隔（天） */
const FIRST_INTERVAL = 1;
const SECOND_INTERVAL = 6;

/** 一次复习的完整状态，对应 ReviewLog 去掉时间戳后的部分 */
export interface ReviewState {
  repetitions: number;
  easiness: number;
  intervalDays: number;
}

/** 新卡片的初始状态 */
export const INITIAL_STATE: ReviewState = {
  repetitions: 0,
  easiness: INITIAL_EASINESS,
  intervalDays: 0,
};

/**
 * 根据自评结果计算下一次复习状态。
 *
 * SM-2 规则：
 * - quality < 3：本次算失败，连续答对次数归零，间隔重置为 1 天，
 *   但难度因子仍然按公式调整（这样反复答错的卡片会越来越"难"）。
 * - quality >= 3：连续答对次数 +1；
 *   - 第 1 次：间隔 1 天
 *   - 第 2 次：间隔 6 天
 *   - 之后：间隔 = 上次间隔 × 难度因子
 *
 * 难度因子更新公式（对所有评分都生效）：
 *   EF' = EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02))
 *   且 EF' 不低于 1.3
 */
export function scheduleNext(
  current: ReviewState,
  quality: ReviewQuality,
): ReviewState {
  const q = QUALITY_MAP[quality];

  // 难度因子：无论对错都更新
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  const easiness = Math.max(MIN_EASINESS, current.easiness + delta);

  if (q < 3) {
    // 答错：连续答对归零，明天重来
    return {
      repetitions: 0,
      easiness,
      intervalDays: FIRST_INTERVAL,
    };
  }

  const repetitions = current.repetitions + 1;

  let intervalDays: number;
  if (repetitions === 1) {
    intervalDays = FIRST_INTERVAL;
  } else if (repetitions === 2) {
    intervalDays = SECOND_INTERVAL;
  } else {
    // 用更新后的难度因子计算，保证与 EF 的变化同步
    intervalDays = Math.round(current.intervalDays * easiness);
  }

  // 间隔至少 1 天，避免同一天反复出现
  intervalDays = Math.max(FIRST_INTERVAL, intervalDays);

  return { repetitions, easiness, intervalDays };
}

/** 所有设备统一使用 UTC+8 的学习日，不受服务器时区影响。 */
const STUDY_OFFSET_MS = 8 * 60 * 60 * 1000;
export function nextReviewDate(from: Date, intervalDays: number): Date {
  return new Date(startOfLocalDay(from).getTime() + intervalDays * 86_400_000);
}
export function startOfLocalDay(date: Date): Date {
  return fromDateKey(toDateKey(date));
}
export function toDateKey(date: Date): string {
  return new Date(date.getTime() + STUDY_OFFSET_MS).toISOString().slice(0, 10);
}
export function fromDateKey(key: string): Date {
  const date = new Date(key + 'T00:00:00+08:00');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !Number.isFinite(date.getTime()) || toDateKey(date) !== key) {
    throw new Error('无效的日期字符串: ' + key);
  }
  return date;
}

/** 两个日期相差的整天数（按 UTC+8 的 0 点计） */
export function daysBetween(from: Date, to: Date): number {
  const a = startOfLocalDay(from).getTime();
  const b = startOfLocalDay(to).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** 判断某张卡今天是否到期 */
export function isDue(log: Pick<ReviewLog, "nextReviewAt">, today: Date): boolean {
  return fromDateKey(log.nextReviewAt).getTime() <= startOfLocalDay(today).getTime();
}

/**
 * 计算连续学习天数。
 *
 * 规则：从今天（或昨天）往前数，连续每天都有复习记录的天数。
 * 若今天还没复习但昨天复习了，连续天数仍然保留——否则用户每天早上打开
 * 应用都会看到 streak 归零，体验上不合理。
 *
 * @param reviewDates 已复习的日期集合（YYYY-MM-DD）
 */
export function calculateStreak(reviewDates: ReadonlySet<string>, today: Date): number {
  const cursor = startOfLocalDay(today);

  // 今天没记录就从昨天开始数
  if (!reviewDates.has(toDateKey(cursor))) {
    cursor.setTime(cursor.getTime() - 86_400_000);
  }

  let streak = 0;
  // 上限 10 年，防止数据异常导致死循环
  const maxIterations = 3650;
  for (let i = 0; i < maxIterations; i += 1) {
    if (!reviewDates.has(toDateKey(cursor))) break;
    streak += 1;
    cursor.setTime(cursor.getTime() - 86_400_000);
  }
  return streak;
}
