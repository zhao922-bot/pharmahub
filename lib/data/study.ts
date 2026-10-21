import "server-only";

import type { ReviewLog, ReviewQuality } from "@/lib/types";
import { getDataContext } from "@/lib/db/context";
import { D1StudyRepository } from "@/lib/db/study-store";

/**
 * 学习记录数据访问层（云端数据库 实现）。
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

export const studyRepository: StudyProgressRepository = new D1StudyRepository(getDataContext);
