"use server";

import { revalidatePath } from "next/cache";

import { studyRepository } from "@/lib/data/study";
import { quizRepository } from "@/lib/data/quiz";
import { cardRepository } from "@/lib/data/cards";
import { compareRepository } from "@/lib/data/compare";
import { validateQuizAnswer } from "@/lib/quiz/validate-answer";
import { CATEGORIES } from "@/lib/data/categories";
import { quiz as quizCopy } from "@/lib/copy";
import type { ReviewQuality } from "@/lib/types";

/**
 * 复习相关的服务端动作。
 *
 * 放在独立文件里并标注 "use server"，客户端组件可以通过表单或事件调用，
 * 但数据库与文件系统代码不会被打包进客户端 bundle。
 */

export interface RecordReviewResult {
  ok: boolean;
  /** 失败原因，成功时不返回 */
  message?: string;
  /** 下次复习日期（YYYY-MM-DD） */
  nextReviewAt?: string;
  /** 距离下次复习还有多少天 */
  intervalDays?: number;
}

/** 校验自评值是否合法（0 / 1 / 2） */
function isReviewQuality(value: number): value is ReviewQuality {
  return value === 0 || value === 1 || value === 2;
}

/** 记录一次复习自评 */
export async function recordReviewAction(
  cardId: string,
  quality: number,
): Promise<RecordReviewResult> {
  if (!isReviewQuality(quality)) {
    return { ok: false, message: "评分值无效" };
  }

  // 校验卡片真实存在，避免脏数据写入数据库
  const card = await cardRepository.getById(cardId);
  if (!card) {
    return { ok: false, message: "卡片不存在" };
  }

  const log = await studyRepository.recordReview(cardId, quality, new Date());

  // 首页的进度看板与待复习数会变化，需要重新渲染
  revalidatePath("/");
  revalidatePath("/cards");
  revalidatePath(`/cards/${cardId}`);

  return {
    ok: true,
    nextReviewAt: log.nextReviewAt,
    intervalDays: log.intervalDays,
  };
}

/** 切换收藏状态 */
export async function toggleFavoriteAction(cardId: string): Promise<{ ok: boolean; favorited: boolean }> {
  const card = await cardRepository.getById(cardId);
  if (!card) {
    return { ok: false, favorited: false };
  }
  const favorited = await studyRepository.toggleFavorite(cardId, new Date());
  revalidatePath("/");
  revalidatePath("/cards");
  revalidatePath(`/cards/${cardId}`);
  return { ok: true, favorited };
}

/** 提交一道测验题的答案 */
export async function submitQuizAnswerAction(input: unknown): Promise<{ ok: boolean; isCorrect: boolean; message?: string }> {
  const [groups, allCards] = await Promise.all([compareRepository.getAll(), cardRepository.getAll()]);
  const categoryNames = new Map(CATEGORIES.map((category) => [category.id, category.name]));
  const validated = validateQuizAnswer(input, groups, allCards, categoryNames);
  if (!validated) return { ok: false, isCorrect: false, message: quizCopy.answerInvalid };
  const { question, selectedId } = validated;
  const result = await quizRepository.recordAttempt({
    questionId: question.id, cardId: question.cardId, kind: question.kind,
    selectedId, correctId: question.correctOptionId, now: new Date(),
  });
  revalidatePath("/quiz");
  revalidatePath("/wrong-book");
  return { ok: true, isCorrect: result.isCorrect };
}

/** 从错题本移除一道题 */
export async function removeWrongQuestionAction(
  questionId: string,
): Promise<{ ok: boolean }> {
  await quizRepository.removeWrongQuestion(questionId);
  revalidatePath("/wrong-book");
  return { ok: true };
}

/** 清空错题本 */
export async function clearWrongBookAction(): Promise<{ ok: boolean }> {
  await quizRepository.clearWrongQuestions();
  revalidatePath("/wrong-book");
  return { ok: true };
}
