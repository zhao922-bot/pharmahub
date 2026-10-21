import "server-only";

import type { ReviewLog, ReviewQuality } from "@/lib/types";
import { getDatabase } from "@/lib/db/sqlite";
import {
  calculateStreak,
  nextReviewDate,
  scheduleNext,
  startOfLocalDay,
  toDateKey,
  type ReviewState,
} from "@/lib/review/sm2";

/**
 * 学习记录数据访问层（SQLite 实现）。
 *
 * 所有函数都在服务端运行（server action / 服务端组件）。
 * 返回的对象都是纯数据，可以安全地序列化后传给客户端组件。
 */

/** 首页进度看板所需的聚合数据 */
export interface StudyProgress {
  /** 已学过的卡片数（至少复习过一次） */
  learnedCount: number;
  /** 今日已完成的复习次数 */
  reviewedTodayCount: number;
  /** 今日到期待复习的卡片数 */
  dueTodayCount: number;
  /** 连续学习天数 */
  streakDays: number;
  /** 今日新学（首次复习）的卡片数 */
  newTodayCount: number;
  /** 数据是否为真实记录；false 时界面显示占位说明 */
  isPlaceholder: boolean;
}

export interface StudyProgressRepository {
  getProgress(today: Date): Promise<StudyProgress>;
  getReviewLog(cardId: string): Promise<ReviewLog | null>;
  getReviewLogs(cardIds: string[]): Promise<ReviewLog[]>;
  getDueCardIds(today: Date): Promise<string[]>;
  /** 记录一次复习，返回更新后的记录 */
  recordReview(
    cardId: string,
    quality: ReviewQuality,
    now: Date,
  ): Promise<ReviewLog>;
  isFavorite(cardId: string): Promise<boolean>;
  toggleFavorite(cardId: string, now: Date): Promise<boolean>;
  getFavoriteCardIds(): Promise<string[]>;
  /** 某张卡的历史复习次数与最近一次评分，供卡片详情页展示 */
  getCardStats(cardId: string): Promise<{ reviewCount: number; lastQuality: ReviewQuality | null }>;
  /**
   * 按日聚合的复习次数，用于学习热力图。
   * 只返回有记录的日期（稀疏），补零由展示层负责。
   */
  getDailyReviewCounts(since: Date): Promise<Array<{ date: string; count: number }>>;
}

interface ReviewLogRow {
  card_id: string;
  repetitions: number;
  easiness: number;
  interval_days: number;
  next_review_at: string;
  last_reviewed_at: string;
}

function rowToLog(row: ReviewLogRow): ReviewLog {
  return {
    cardId: row.card_id,
    // 数据库里存的是三档评分，但 review_log 只保存当前状态，不保存上次评分，
    // 这里给一个占位值，真正的最近评分由 review_history 查询
    quality: 2,
    repetitions: row.repetitions,
    easiness: row.easiness,
    intervalDays: row.interval_days,
    nextReviewAt: row.next_review_at,
    lastReviewedAt: row.last_reviewed_at,
  };
}

class SqliteStudyRepository implements StudyProgressRepository {
  async getProgress(today: Date): Promise<StudyProgress> {
    const db = getDatabase();
    const todayKey = toDateKey(today);
    const todayStart = startOfLocalDay(today).getTime();

    const learned = db
      .prepare("SELECT COUNT(*) AS n FROM review_log")
      .get() as { n: number };

    const reviewedToday = db
      .prepare("SELECT COUNT(*) AS n FROM review_history WHERE reviewed_on = ?")
      .get(todayKey) as { n: number };

    // 今日到期：下次复习日期 <= 今天
    const dueToday = db
      .prepare("SELECT COUNT(*) AS n FROM review_log WHERE next_review_at <= ?")
      .get(todayKey) as { n: number };

    // 今日首次复习的卡片数（历史记录里今天第一次出现）
    const newToday = db
      .prepare(
        `SELECT COUNT(*) AS n FROM (
           SELECT card_id, MIN(reviewed_on) AS first_on
           FROM review_history GROUP BY card_id
         ) WHERE first_on = ?`,
      )
      .get(todayKey) as { n: number };

    // 连续天数：取出所有复习日期
    const dateRows = db
      .prepare("SELECT DISTINCT reviewed_on FROM review_history")
      .all() as Array<{ reviewed_on: string }>;
    const reviewDates = new Set(dateRows.map((r) => r.reviewed_on));
    const streakDays = calculateStreak(reviewDates, new Date(todayStart));

    return {
      learnedCount: learned.n,
      reviewedTodayCount: reviewedToday.n,
      dueTodayCount: dueToday.n,
      streakDays,
      newTodayCount: newToday.n,
      isPlaceholder: false,
    };
  }

  async getReviewLog(cardId: string): Promise<ReviewLog | null> {
    const db = getDatabase();
    const row = db
      .prepare("SELECT * FROM review_log WHERE card_id = ?")
      .get(cardId) as ReviewLogRow | undefined;
    if (!row) return null;

    const log = rowToLog(row);
    const last = db
      .prepare(
        "SELECT quality FROM review_history WHERE card_id = ? ORDER BY id DESC LIMIT 1",
      )
      .get(cardId) as { quality: number } | undefined;
    if (last) {
      log.quality = last.quality as ReviewQuality;
    }
    return log;
  }

  async getReviewLogs(cardIds: string[]): Promise<ReviewLog[]> {
    if (cardIds.length === 0) return [];
    const db = getDatabase();
    const placeholders = cardIds.map(() => "?").join(",");
    const rows = db
      .prepare(`SELECT * FROM review_log WHERE card_id IN (${placeholders})`)
      .all(...cardIds) as ReviewLogRow[];
    return rows.map(rowToLog);
  }

  async getDueCardIds(today: Date): Promise<string[]> {
    const db = getDatabase();
    const todayKey = toDateKey(today);
    const rows = db
      .prepare(
        "SELECT card_id FROM review_log WHERE next_review_at <= ? ORDER BY next_review_at ASC",
      )
      .all(todayKey) as Array<{ card_id: string }>;
    return rows.map((r) => r.card_id);
  }

  async recordReview(
    cardId: string,
    quality: ReviewQuality,
    now: Date,
  ): Promise<ReviewLog> {
    const db = getDatabase();
    const existing = await this.getReviewLog(cardId);

    const current: ReviewState = existing
      ? {
          repetitions: existing.repetitions,
          easiness: existing.easiness,
          intervalDays: existing.intervalDays,
        }
      : { repetitions: 0, easiness: 2.5, intervalDays: 0 };

    const next = scheduleNext(current, quality);
    const nextDate = nextReviewDate(now, next.intervalDays);
    const nowIso = now.toISOString();
    const todayKey = toDateKey(now);

    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO review_log
           (card_id, repetitions, easiness, interval_days, next_review_at, last_reviewed_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(card_id) DO UPDATE SET
           repetitions = excluded.repetitions,
           easiness = excluded.easiness,
           interval_days = excluded.interval_days,
           next_review_at = excluded.next_review_at,
           last_reviewed_at = excluded.last_reviewed_at,
           updated_at = excluded.updated_at`,
      ).run(
        cardId,
        next.repetitions,
        next.easiness,
        next.intervalDays,
        toDateKey(nextDate),
        nowIso,
        nowIso,
      );

      db.prepare(
        "INSERT INTO review_history (card_id, quality, reviewed_on, reviewed_at) VALUES (?, ?, ?, ?)",
      ).run(cardId, quality, todayKey, nowIso);
    });

    tx();

    return {
      cardId,
      quality,
      repetitions: next.repetitions,
      easiness: next.easiness,
      intervalDays: next.intervalDays,
      nextReviewAt: toDateKey(nextDate),
      lastReviewedAt: nowIso,
    };
  }

  async isFavorite(cardId: string): Promise<boolean> {
    const db = getDatabase();
    const row = db
      .prepare("SELECT 1 AS x FROM favorite WHERE card_id = ?")
      .get(cardId) as { x: number } | undefined;
    return Boolean(row);
  }

  async toggleFavorite(cardId: string, now: Date): Promise<boolean> {
    const db = getDatabase();
    const existing = await this.isFavorite(cardId);
    if (existing) {
      db.prepare("DELETE FROM favorite WHERE card_id = ?").run(cardId);
      return false;
    }
    db.prepare("INSERT INTO favorite (card_id, created_at) VALUES (?, ?)").run(
      cardId,
      now.toISOString(),
    );
    return true;
  }

  async getFavoriteCardIds(): Promise<string[]> {
    const db = getDatabase();
    const rows = db
      .prepare("SELECT card_id FROM favorite ORDER BY created_at DESC")
      .all() as Array<{ card_id: string }>;
    return rows.map((r) => r.card_id);
  }

  async getCardStats(
    cardId: string,
  ): Promise<{ reviewCount: number; lastQuality: ReviewQuality | null }> {
    const db = getDatabase();
    const count = db
      .prepare("SELECT COUNT(*) AS n FROM review_history WHERE card_id = ?")
      .get(cardId) as { n: number };
    const last = db
      .prepare(
        "SELECT quality FROM review_history WHERE card_id = ? ORDER BY id DESC LIMIT 1",
      )
      .get(cardId) as { quality: number } | undefined;
    return {
      reviewCount: count.n,
      lastQuality: last ? (last.quality as ReviewQuality) : null,
    };
  }

  async getDailyReviewCounts(
    since: Date,
  ): Promise<Array<{ date: string; count: number }>> {
    const db = getDatabase();
    const sinceKey = toDateKey(since);
    const rows = db
      .prepare(
        `SELECT reviewed_on AS date, COUNT(*) AS count
         FROM review_history
         WHERE reviewed_on >= ?
         GROUP BY reviewed_on
         ORDER BY reviewed_on ASC`,
      )
      .all(sinceKey) as Array<{ date: string; count: number }>;

    return rows.map((row) => ({ date: row.date, count: row.count }));
  }
}

export const studyRepository: StudyProgressRepository = new SqliteStudyRepository();
