import type { ExportRepository } from "@/lib/data/export";
import { rows, type ContextReader } from "./types";

export class D1ExportRepository implements ExportRepository {
  private readonly context: ContextReader;
  constructor(context: ContextReader) { this.context = context; }
  async getReviewHistory() {
    const { db, userId } = await this.context();
    return rows<Awaited<ReturnType<ExportRepository["getReviewHistory"]>>[number]>(db.prepare(`SELECT card_id AS cardId, quality,
      reviewed_on AS reviewedOn, reviewed_at AS reviewedAt FROM review_history WHERE user_id = ? ORDER BY reviewed_at ASC, id ASC`).bind(userId));
  }
  async getReviewStates() {
    const { db, userId } = await this.context();
    return rows<Awaited<ReturnType<ExportRepository["getReviewStates"]>>[number]>(db.prepare(`SELECT card_id AS cardId, repetitions, easiness,
      interval_days AS intervalDays, next_review_at AS nextReviewAt, last_reviewed_at AS lastReviewedAt
      FROM review_log WHERE user_id = ? ORDER BY next_review_at ASC`).bind(userId));
  }
  async getQuizAttempts() {
    const { db, userId } = await this.context();
    const records = await rows<{questionId: string; cardId: string; kind: string; isCorrect: number; answeredOn: string; answeredAt: string}>(db.prepare(`SELECT question_id AS questionId,
      card_id AS cardId, kind, is_correct AS isCorrect, answered_on AS answeredOn, answered_at AS answeredAt
      FROM quiz_attempt WHERE user_id = ? ORDER BY answered_at ASC, id ASC`).bind(userId));
    return records.map((row) => ({ ...row, isCorrect: row.isCorrect === 1 }));
  }
  async getWrongQuestions() {
    const { db, userId } = await this.context();
    return rows<Awaited<ReturnType<ExportRepository["getWrongQuestions"]>>[number]>(db.prepare(`SELECT question_id AS questionId,
      card_id AS cardId, kind, wrong_count AS wrongCount, last_wrong_at AS lastWrongAt, last_correct_at AS lastCorrectAt
      FROM wrong_question WHERE user_id = ? ORDER BY wrong_count DESC, last_wrong_at DESC`).bind(userId));
  }
  async getFavorites() {
    const { db, userId } = await this.context();
    return rows<Awaited<ReturnType<ExportRepository["getFavorites"]>>[number]>(db.prepare(`SELECT card_id AS cardId,
      created_at AS createdAt FROM favorite WHERE user_id = ? AND enabled = 1 ORDER BY created_at ASC`).bind(userId));
  }
}
