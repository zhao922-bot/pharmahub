import "server-only";

import { getDatabase } from "@/lib/db/sqlite";

/**
 * 学习数据导出。
 *
 * 设计取舍：导出走**独立的数据访问层**，而不是给 study.ts / quiz.ts 加方法。
 *
 * 原因：导出需要的是「原始流水」——每一次复习、每一次答题的完整记录，
 * 而 study.ts / quiz.ts 提供的是「当前状态」与「聚合统计」。
 * 把两种语义混在一个仓库里，接口会越来越难懂。分开更清晰。
 *
 * 所有查询都是只读，不做任何写入。
 */

/** 复习流水的一行 */
export interface ReviewHistoryExportRow {
  cardId: string;
  quality: number;
  /** 复习日期 YYYY-MM-DD */
  reviewedOn: string;
  /** 复习时刻 ISO 字符串 */
  reviewedAt: string;
}

/** 当前复习状态的一行（SM-2 计算后的结果） */
export interface ReviewStateExportRow {
  cardId: string;
  repetitions: number;
  easiness: number;
  intervalDays: number;
  nextReviewAt: string;
  lastReviewedAt: string;
}

/** 答题流水的一行 */
export interface QuizAttemptExportRow {
  questionId: string;
  cardId: string;
  kind: string;
  isCorrect: boolean;
  answeredOn: string;
  answeredAt: string;
}

/** 错题本的一行 */
export interface WrongQuestionExportRow {
  questionId: string;
  cardId: string;
  kind: string;
  wrongCount: number;
  lastWrongAt: string;
  lastCorrectAt: string | null;
}

/** 收藏的一行 */
export interface FavoriteExportRow {
  cardId: string;
  createdAt: string;
}

export interface ExportRepository {
  getReviewHistory(): Promise<ReviewHistoryExportRow[]>;
  getReviewStates(): Promise<ReviewStateExportRow[]>;
  getQuizAttempts(): Promise<QuizAttemptExportRow[]>;
  getWrongQuestions(): Promise<WrongQuestionExportRow[]>;
  getFavorites(): Promise<FavoriteExportRow[]>;
}

class SqliteExportRepository implements ExportRepository {
  async getReviewHistory(): Promise<ReviewHistoryExportRow[]> {
    const db = getDatabase();
    const rows = db
      .prepare(
        `SELECT card_id, quality, reviewed_on, reviewed_at
         FROM review_history
         ORDER BY reviewed_at ASC, id ASC`,
      )
      .all() as Array<{
      card_id: string;
      quality: number;
      reviewed_on: string;
      reviewed_at: string;
    }>;

    return rows.map((row) => ({
      cardId: row.card_id,
      quality: row.quality,
      reviewedOn: row.reviewed_on,
      reviewedAt: row.reviewed_at,
    }));
  }

  async getReviewStates(): Promise<ReviewStateExportRow[]> {
    const db = getDatabase();
    const rows = db
      .prepare(
        `SELECT card_id, repetitions, easiness, interval_days, next_review_at, last_reviewed_at
         FROM review_log
         ORDER BY next_review_at ASC`,
      )
      .all() as Array<{
      card_id: string;
      repetitions: number;
      easiness: number;
      interval_days: number;
      next_review_at: string;
      last_reviewed_at: string;
    }>;

    return rows.map((row) => ({
      cardId: row.card_id,
      repetitions: row.repetitions,
      easiness: row.easiness,
      intervalDays: row.interval_days,
      nextReviewAt: row.next_review_at,
      lastReviewedAt: row.last_reviewed_at,
    }));
  }

  async getQuizAttempts(): Promise<QuizAttemptExportRow[]> {
    const db = getDatabase();
    const rows = db
      .prepare(
        `SELECT question_id, card_id, kind, is_correct, answered_on, answered_at
         FROM quiz_attempt
         ORDER BY answered_at ASC, id ASC`,
      )
      .all() as Array<{
      question_id: string;
      card_id: string;
      kind: string;
      is_correct: number;
      answered_on: string;
      answered_at: string;
    }>;

    return rows.map((row) => ({
      questionId: row.question_id,
      cardId: row.card_id,
      kind: row.kind,
      isCorrect: row.is_correct === 1,
      answeredOn: row.answered_on,
      answeredAt: row.answered_at,
    }));
  }

  async getWrongQuestions(): Promise<WrongQuestionExportRow[]> {
    const db = getDatabase();
    const rows = db
      .prepare(
        `SELECT question_id, card_id, kind, wrong_count, last_wrong_at, last_correct_at
         FROM wrong_question
         ORDER BY wrong_count DESC, last_wrong_at DESC`,
      )
      .all() as Array<{
      question_id: string;
      card_id: string;
      kind: string;
      wrong_count: number;
      last_wrong_at: string;
      last_correct_at: string | null;
    }>;

    return rows.map((row) => ({
      questionId: row.question_id,
      cardId: row.card_id,
      kind: row.kind,
      wrongCount: row.wrong_count,
      lastWrongAt: row.last_wrong_at,
      lastCorrectAt: row.last_correct_at,
    }));
  }

  async getFavorites(): Promise<FavoriteExportRow[]> {
    const db = getDatabase();
    const rows = db
      .prepare("SELECT card_id, created_at FROM favorite ORDER BY created_at ASC")
      .all() as Array<{ card_id: string; created_at: string }>;

    return rows.map((row) => ({
      cardId: row.card_id,
      createdAt: row.created_at,
    }));
  }
}

export const exportRepository: ExportRepository = new SqliteExportRepository();
