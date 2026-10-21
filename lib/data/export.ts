import "server-only";

import { getDataContext } from "@/lib/db/context";
import { D1ExportRepository } from "@/lib/db/export-store";

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

export const exportRepository: ExportRepository = new D1ExportRepository(getDataContext);
