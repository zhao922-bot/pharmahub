import type { QuizRepository, QuizStats, WrongQuestionRecord } from "@/lib/data/quiz";
import { toDateKey } from "@/lib/review/sm2";
import { rows, type ContextReader } from "./types";

export class D1QuizRepository implements QuizRepository {
  private readonly context: ContextReader;
  constructor(context: ContextReader) { this.context = context; }

  async recordAttempt(input: Parameters<QuizRepository["recordAttempt"]>[0]): Promise<{ isCorrect: boolean }> {
    const { db, userId } = await this.context();
    const correct = input.selectedId === input.correctId;
    const at = input.now.toISOString();
    await db.batch([
      db.prepare(`INSERT INTO quiz_attempt
        (user_id, question_id, card_id, kind, selected_id, correct_id, is_correct, answered_on, answered_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(userId, input.questionId, input.cardId, input.kind,
        input.selectedId, input.correctId, correct ? 1 : 0, toDateKey(input.now), at),
      correct ? db.prepare("UPDATE wrong_question SET last_correct_at = ? WHERE user_id = ? AND question_id = ?").bind(at, userId, input.questionId)
        : db.prepare(`INSERT INTO wrong_question (user_id, question_id, card_id, kind, wrong_count, last_wrong_at)
          VALUES (?, ?, ?, ?, 1, ?) ON CONFLICT(user_id, question_id) DO UPDATE SET
          wrong_count = wrong_question.wrong_count + 1, last_wrong_at = excluded.last_wrong_at`)
          .bind(userId, input.questionId, input.cardId, input.kind, at),
    ]);
    return { isCorrect: correct };
  }

  async getStats(today: Date): Promise<QuizStats> {
    const { db, userId } = await this.context();
    const result = await db.batch([
      db.prepare("SELECT COUNT(*) AS answered, COALESCE(SUM(is_correct), 0) AS correct FROM quiz_attempt WHERE user_id = ? AND answered_on = ?").bind(userId, toDateKey(today)),
      db.prepare("SELECT COUNT(*) AS answered, COALESCE(SUM(is_correct), 0) AS correct FROM quiz_attempt WHERE user_id = ?").bind(userId),
      db.prepare("SELECT COUNT(*) AS n FROM wrong_question WHERE user_id = ?").bind(userId),
    ]);
    const daily = result[0].results[0] as { answered: number; correct: number };
    const total = result[1].results[0] as { answered: number; correct: number };
    return { answeredToday: daily.answered, correctToday: daily.correct, answeredTotal: total.answered,
      correctTotal: total.correct, wrongCount: Number((result[2].results[0] as { n: number }).n) };
  }

  async getWrongQuestions(): Promise<WrongQuestionRecord[]> {
    const { db, userId } = await this.context();
    return rows<WrongQuestionRecord>(db.prepare(`SELECT question_id AS questionId, card_id AS cardId, kind,
      wrong_count AS wrongCount, last_wrong_at AS lastWrongAt, last_correct_at AS lastCorrectAt
      FROM wrong_question WHERE user_id = ? ORDER BY wrong_count DESC, last_wrong_at DESC`).bind(userId));
  }

  async markCorrect(questionId: string, now: Date): Promise<void> {
    const { db, userId } = await this.context();
    await db.prepare("UPDATE wrong_question SET last_correct_at = ? WHERE user_id = ? AND question_id = ?").bind(now.toISOString(), userId, questionId).run();
  }
  async removeWrongQuestion(questionId: string): Promise<void> {
    const { db, userId } = await this.context();
    await db.prepare("DELETE FROM wrong_question WHERE user_id = ? AND question_id = ?").bind(userId, questionId).run();
  }
  async clearWrongQuestions(): Promise<void> {
    const { db, userId } = await this.context();
    await db.prepare("DELETE FROM wrong_question WHERE user_id = ?").bind(userId).run();
  }
}
