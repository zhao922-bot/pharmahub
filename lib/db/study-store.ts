import type { ReviewLog, ReviewQuality } from "@/lib/types";
import type { StudyProgress, StudyProgressRepository } from "@/lib/data/study";
import { calculateStreak, nextReviewDate, scheduleNext, toDateKey } from "@/lib/review/sm2";
import { rows, type ContextReader } from "./types";

interface LogRow {
  card_id: string; quality: ReviewQuality; repetitions: number; easiness: number;
  interval_days: number; next_review_at: string; last_reviewed_at: string; version: number;
}
function toLog(row: LogRow): ReviewLog {
  return { cardId: row.card_id, quality: row.quality, repetitions: row.repetitions,
    easiness: row.easiness, intervalDays: row.interval_days,
    nextReviewAt: row.next_review_at, lastReviewedAt: row.last_reviewed_at };
}

export class D1StudyRepository implements StudyProgressRepository {
  private readonly context: ContextReader;
  constructor(context: ContextReader) { this.context = context; }

  async getProgress(today: Date): Promise<StudyProgress> {
    const { db, userId } = await this.context();
    const day = toDateKey(today);
    const results = await db.batch([
      db.prepare("SELECT COUNT(*) AS n FROM review_log WHERE user_id = ?").bind(userId),
      db.prepare("SELECT COUNT(*) AS n FROM review_history WHERE user_id = ? AND reviewed_on = ?").bind(userId, day),
      db.prepare("SELECT COUNT(*) AS n FROM review_log WHERE user_id = ? AND next_review_at <= ?").bind(userId, day),
      db.prepare("SELECT COUNT(*) AS n FROM (SELECT card_id, MIN(reviewed_on) AS first_on FROM review_history WHERE user_id = ? GROUP BY card_id) WHERE first_on = ?").bind(userId, day),
      db.prepare("SELECT DISTINCT reviewed_on FROM review_history WHERE user_id = ?").bind(userId),
    ]);
    const count = (i: number) => Number((results[i].results[0] as { n: number }).n);
    const days = new Set((results[4].results as { reviewed_on: string }[]).map((r) => r.reviewed_on));
    return { learnedCount: count(0), reviewedTodayCount: count(1), dueTodayCount: count(2),
      newTodayCount: count(3), streakDays: calculateStreak(days, today), isPlaceholder: false };
  }

  async getReviewLog(cardId: string): Promise<ReviewLog | null> {
    const { db, userId } = await this.context();
    const row = await db.prepare("SELECT * FROM review_log WHERE user_id = ? AND card_id = ?").bind(userId, cardId).first<LogRow>();
    return row ? toLog(row) : null;
  }

  async getReviewLogs(cardIds: string[]): Promise<ReviewLog[]> {
    if (!cardIds.length) return [];
    const { db, userId } = await this.context();
    const wanted = new Set(cardIds);
    const found = await rows<LogRow>(db.prepare("SELECT * FROM review_log WHERE user_id = ?").bind(userId));
    return found.filter((row) => wanted.has(row.card_id)).map(toLog);
  }

  async getDueCardIds(today: Date): Promise<string[]> {
    const { db, userId } = await this.context();
    return (await rows<{ card_id: string }>(db.prepare("SELECT card_id FROM review_log WHERE user_id = ? AND next_review_at <= ? ORDER BY next_review_at ASC").bind(userId, toDateKey(today)))).map((r) => r.card_id);
  }

  async recordReview(cardId: string, quality: ReviewQuality, now: Date): Promise<ReviewLog> {
    const { db, userId } = await this.context();
    const operation = crypto.randomUUID();
    const at = now.toISOString();
    // Conditional upsert + conditional history insert run in one D1 transaction.
    // Retry a concurrent update rather than losing another device's review.
    for (let retry = 0; retry < 5; retry++) {
      const prior = await db.prepare("SELECT * FROM review_log WHERE user_id = ? AND card_id = ?").bind(userId, cardId).first<LogRow>();
      const next = scheduleNext(prior ? { repetitions: prior.repetitions, easiness: prior.easiness, intervalDays: prior.interval_days }
        : { repetitions: 0, easiness: 2.5, intervalDays: 0 }, quality);
      const due = toDateKey(nextReviewDate(now, next.intervalDays));
      const result = await db.batch([
        db.prepare(`INSERT INTO review_log
          (user_id, card_id, quality, repetitions, easiness, interval_days, next_review_at, last_reviewed_at, updated_at, version, operation_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
          ON CONFLICT(user_id, card_id) DO UPDATE SET quality = excluded.quality, repetitions = excluded.repetitions,
          easiness = excluded.easiness, interval_days = excluded.interval_days, next_review_at = excluded.next_review_at,
          last_reviewed_at = excluded.last_reviewed_at, updated_at = excluded.updated_at,
          version = review_log.version + 1, operation_id = excluded.operation_id
          WHERE review_log.version = ? RETURNING *`).bind(userId, cardId, quality, next.repetitions, next.easiness,
          next.intervalDays, due, at, at, operation, prior?.version ?? -1),
        db.prepare(`INSERT INTO review_history (user_id, card_id, quality, reviewed_on, reviewed_at)
          SELECT ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM review_log WHERE user_id = ? AND card_id = ? AND operation_id = ?)`)
          .bind(userId, cardId, quality, toDateKey(now), at, userId, cardId, operation),
      ]);
      const saved = result[0].results[0] as unknown as LogRow | undefined;
      if (saved) return toLog(saved);
    }
    throw new Error("其他设备正在更新这张卡片，请稍后重试。");
  }

  async isFavorite(cardId: string): Promise<boolean> {
    const { db, userId } = await this.context();
    return !!await db.prepare("SELECT 1 FROM favorite WHERE user_id = ? AND card_id = ? AND enabled = 1").bind(userId, cardId).first();
  }

  async toggleFavorite(cardId: string, now: Date): Promise<boolean> {
    const { db, userId } = await this.context();
    const result = await db.prepare(`INSERT INTO favorite (user_id, card_id, created_at, enabled) VALUES (?, ?, ?, 1)
      ON CONFLICT(user_id, card_id) DO UPDATE SET enabled = 1 - favorite.enabled, created_at = excluded.created_at
      RETURNING enabled`).bind(userId, cardId, now.toISOString()).first<{ enabled: number }>();
    return result?.enabled === 1;
  }

  async getFavoriteCardIds(): Promise<string[]> {
    const { db, userId } = await this.context();
    return (await rows<{ card_id: string }>(db.prepare("SELECT card_id FROM favorite WHERE user_id = ? AND enabled = 1 ORDER BY created_at DESC").bind(userId))).map((r) => r.card_id);
  }

  async getCardStats(cardId: string): Promise<{ reviewCount: number; lastQuality: ReviewQuality | null }> {
    const { db, userId } = await this.context();
    const result = await db.batch([
      db.prepare("SELECT COUNT(*) AS n FROM review_history WHERE user_id = ? AND card_id = ?").bind(userId, cardId),
      db.prepare("SELECT quality FROM review_history WHERE user_id = ? AND card_id = ? ORDER BY id DESC LIMIT 1").bind(userId, cardId),
    ]);
    return { reviewCount: Number((result[0].results[0] as { n: number }).n),
      lastQuality: (result[1].results[0] as { quality: ReviewQuality } | undefined)?.quality ?? null };
  }

  async getDailyReviewCounts(since: Date): Promise<Array<{ date: string; count: number }>> {
    const { db, userId } = await this.context();
    return rows(db.prepare("SELECT reviewed_on AS date, COUNT(*) AS count FROM review_history WHERE user_id = ? AND reviewed_on >= ? GROUP BY reviewed_on ORDER BY reviewed_on ASC").bind(userId, toDateKey(since)));
  }
}
