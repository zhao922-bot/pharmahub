import "server-only";

import { getDatabase } from "@/lib/db/sqlite";
import { toDateKey } from "@/lib/review/sm2";
import type { QuestionKind } from "@/lib/quiz/generator";

/**
 * 测验记录与错题本的数据访问层。
 *
 * 与 study.ts 分开，是因为职责不同：study 管间隔重复，这里管测验。
 * 两者共用同一个 SQLite 连接（lib/db/sqlite.ts）。
 */

export interface QuizStats {
  /** 今日已答题数 */
  answeredToday: number;
  /** 今日答对题数 */
  correctToday: number;
  /** 累计答题数 */
  answeredTotal: number;
  /** 累计答对题数 */
  correctTotal: number;
  /** 错题本题目数 */
  wrongCount: number;
}

export interface WrongQuestionRecord {
  questionId: string;
  cardId: string;
  kind: QuestionKind;
  wrongCount: number;
  lastWrongAt: string;
  lastCorrectAt: string | null;
}

export interface QuizRepository {
  /** 记录一次答题，返回是否正确 */
  recordAttempt(input: {
    questionId: string;
    cardId: string;
    kind: QuestionKind;
    selectedId: string;
    correctId: string;
    now: Date;
  }): Promise<{ isCorrect: boolean }>;
  getStats(today: Date): Promise<QuizStats>;
  getWrongQuestions(): Promise<WrongQuestionRecord[]>;
  /** 答对后标记错题已攻克（不清除记录，只更新状态） */
  markCorrect(questionId: string, now: Date): Promise<void>;
  /** 移除一道错题（用户手动操作） */
  removeWrongQuestion(questionId: string): Promise<void>;
  clearWrongQuestions(): Promise<void>;
}

class SqliteQuizRepository implements QuizRepository {
  async recordAttempt(input: {
    questionId: string;
    cardId: string;
    kind: QuestionKind;
    selectedId: string;
    correctId: string;
    now: Date;
  }): Promise<{ isCorrect: boolean }> {
    const db = getDatabase();
    const isCorrect = input.selectedId === input.correctId;
    const todayKey = toDateKey(input.now);
    const nowIso = input.now.toISOString();

    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO quiz_attempt
           (question_id, card_id, kind, selected_id, correct_id, is_correct, answered_on, answered_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        input.questionId,
        input.cardId,
        input.kind,
        input.selectedId,
        input.correctId,
        isCorrect ? 1 : 0,
        todayKey,
        nowIso,
      );

      if (isCorrect) {
        // 答对了：更新错题本的「最近答对时间」，但不删除记录
        db.prepare(
          "UPDATE wrong_question SET last_correct_at = ? WHERE question_id = ?",
        ).run(nowIso, input.questionId);
      } else {
        // 答错了：加入错题本或累加错误次数
        db.prepare(
          `INSERT INTO wrong_question (question_id, card_id, kind, wrong_count, last_wrong_at)
           VALUES (?, ?, ?, 1, ?)
           ON CONFLICT(question_id) DO UPDATE SET
             wrong_count = wrong_count + 1,
             last_wrong_at = excluded.last_wrong_at`,
        ).run(input.questionId, input.cardId, input.kind, nowIso);
      }
    });

    tx();
    return { isCorrect };
  }

  async getStats(today: Date): Promise<QuizStats> {
    const db = getDatabase();
    const todayKey = toDateKey(today);

    const todayRow = db
      .prepare(
        `SELECT COUNT(*) AS answered, COALESCE(SUM(is_correct), 0) AS correct
         FROM quiz_attempt WHERE answered_on = ?`,
      )
      .get(todayKey) as { answered: number; correct: number };

    const total = db
      .prepare(
        "SELECT COUNT(*) AS answered, COALESCE(SUM(is_correct), 0) AS correct FROM quiz_attempt",
      )
      .get() as { answered: number; correct: number };

    const wrong = db
      .prepare("SELECT COUNT(*) AS n FROM wrong_question")
      .get() as { n: number };

    return {
      answeredToday: todayRow.answered,
      correctToday: todayRow.correct,
      answeredTotal: total.answered,
      correctTotal: total.correct,
      wrongCount: wrong.n,
    };
  }

  async getWrongQuestions(): Promise<WrongQuestionRecord[]> {
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
      kind: row.kind as QuestionKind,
      wrongCount: row.wrong_count,
      lastWrongAt: row.last_wrong_at,
      lastCorrectAt: row.last_correct_at,
    }));
  }

  async markCorrect(questionId: string, now: Date): Promise<void> {
    const db = getDatabase();
    db.prepare(
      "UPDATE wrong_question SET last_correct_at = ? WHERE question_id = ?",
    ).run(now.toISOString(), questionId);
  }

  async removeWrongQuestion(questionId: string): Promise<void> {
    const db = getDatabase();
    db.prepare("DELETE FROM wrong_question WHERE question_id = ?").run(questionId);
  }

  async clearWrongQuestions(): Promise<void> {
    const db = getDatabase();
    db.prepare("DELETE FROM wrong_question").run();
  }
}

export const quizRepository: QuizRepository = new SqliteQuizRepository();
