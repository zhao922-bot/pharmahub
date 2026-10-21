import "server-only";

import { getDataContext } from "@/lib/db/context";
import { D1QuizRepository } from "@/lib/db/quiz-store";
import type { QuestionKind } from "@/lib/quiz/generator";

/**
 * 测验记录与错题本的数据访问层。
 *
 * 与 study.ts 分开，是因为职责不同：study 管间隔重复，这里管测验。
 * 两者使用当前登录账号的云端数据库会话（lib/db/context.ts）。
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

export const quizRepository: QuizRepository = new D1QuizRepository(getDataContext);
