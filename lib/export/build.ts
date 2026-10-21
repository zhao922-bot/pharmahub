import "server-only";

import { exportRepository } from "@/lib/data/export";
import { cardRepository } from "@/lib/data/cards";
import { getCategoryName } from "@/lib/data/categories";
import { buildExportFilename } from "@/lib/export/csv";
import { datasetToCsv, datasetToJson } from "@/lib/export/serialize";
import type { ExportColumn, ExportDataset, ExportRecord } from "@/lib/export/serialize";
import { QUESTION_KIND_LABELS } from "@/lib/quiz/generator";
import type { QuestionKind } from "@/lib/quiz/generator";

/**
 * 把学习数据组装成可下载的文件（CSV 或 JSON）。
 *
 * 架构：**先组装结构化记录，再序列化**。
 *
 * 早先的实现是「直接拼 CSV 行」，加 JSON 时就得把每个 builder 抄一遍——
 * 两份逻辑必然漂移（改了一处忘另一处，或者两处字段名不一致）。
 * 现在改成：
 *
 *   数据查询 → ExportDataset（列定义 + 记录对象） → CSV / JSON 序列化
 *
 * 好处是数据只查一次、字段只定义一次，两种格式天然一致。
 *
 * 为什么在记录里同时保留 id 和中文名：
 * 导出目的是「让人看懂 + 让脚本能处理」。id 是稳定的关联键，
 * 中文名是给人看的。卡片被删除时药名填「（卡片已删除）」而不是留空，
 * 避免用户以为导出出错。
 */

/** 可导出的数据类型 */
export type ExportKind = "reviews" | "quiz" | "wrong-book" | "favorites";

export const EXPORT_KINDS: readonly ExportKind[] = [
  "reviews",
  "quiz",
  "wrong-book",
  "favorites",
];

export function isExportKind(value: string): value is ExportKind {
  return (EXPORT_KINDS as readonly string[]).includes(value);
}

/** 导出格式 */
export type ExportFormat = "csv" | "json";

export const EXPORT_FORMATS: readonly ExportFormat[] = ["csv", "json"];

export function isExportFormat(value: string): value is ExportFormat {
  return (EXPORT_FORMATS as readonly string[]).includes(value);
}

/** 序列化后的文件 */
export interface ExportFile {
  filename: string;
  content: string;
  /** 记录数（不含表头），用于界面提示 */
  rowCount: number;
  /** MIME 类型，供 Route Handler 设置响应头 */
  contentType: string;
}

/** 评分值的中文含义，与界面三档自评一致 */
const QUALITY_LABELS: Record<number, string> = {
  0: "没记住",
  1: "模糊",
  2: "记住了",
};

function qualityLabel(quality: number): string {
  return QUALITY_LABELS[quality] ?? String(quality);
}

function kindLabel(kind: string): string {
  return QUESTION_KIND_LABELS[kind as QuestionKind] ?? kind;
}

/** 卡片 id → 展示信息，避免每行都去查一次 */
async function buildCardLookup() {
  const cards = await cardRepository.getAll();
  return new Map(
    cards.map((card) => [
      card.id,
      {
        genericName: card.genericName,
        englishName: card.englishName,
        categoryName: getCategoryName(card.category),
      },
    ]),
  );
}

/** 卡片被删除时的占位文案，CSV 与 JSON 共用 */
const DELETED_CARD = "（卡片已删除）";

// ---- 各类数据集 ----

/** 复习记录：每次自评一行，附带当前 SM-2 状态 */
async function buildReviewDataset(): Promise<ExportDataset> {
  const [history, states, lookup] = await Promise.all([
    exportRepository.getReviewHistory(),
    exportRepository.getReviewStates(),
    buildCardLookup(),
  ]);

  const stateByCard = new Map(states.map((state) => [state.cardId, state]));

  const columns: ExportColumn[] = [
    { key: "reviewedAt", header: "复习时刻" },
    { key: "reviewedOn", header: "复习日期" },
    { key: "cardId", header: "卡片ID" },
    { key: "genericName", header: "通用名" },
    { key: "englishName", header: "英文名" },
    { key: "categoryName", header: "所属分类" },
    { key: "qualityLabel", header: "自评" },
    { key: "quality", header: "自评分" },
    { key: "repetitions", header: "当前连续答对次数" },
    { key: "easiness", header: "当前难度因子" },
    { key: "intervalDays", header: "当前间隔天数" },
    { key: "nextReviewAt", header: "下次复习日期" },
  ];

  const records: ExportRecord[] = history.map((row) => {
    const card = lookup.get(row.cardId);
    const state = stateByCard.get(row.cardId);
    return {
      reviewedAt: row.reviewedAt,
      reviewedOn: row.reviewedOn,
      cardId: row.cardId,
      genericName: card?.genericName ?? DELETED_CARD,
      englishName: card?.englishName ?? "",
      categoryName: card?.categoryName ?? "",
      qualityLabel: qualityLabel(row.quality),
      quality: row.quality,
      // 难度因子保留两位小数；JSON 里保持数字类型便于计算
      easiness: state ? Number(state.easiness.toFixed(2)) : null,
      repetitions: state?.repetitions ?? null,
      intervalDays: state?.intervalDays ?? null,
      nextReviewAt: state?.nextReviewAt ?? "",
    };
  });

  return { kind: "reviews", columns, records };
}

/** 测验记录：每次答题一行 */
async function buildQuizDataset(): Promise<ExportDataset> {
  const [attempts, lookup] = await Promise.all([
    exportRepository.getQuizAttempts(),
    buildCardLookup(),
  ]);

  const columns: ExportColumn[] = [
    { key: "answeredAt", header: "答题时刻" },
    { key: "answeredOn", header: "答题日期" },
    { key: "questionId", header: "题目ID" },
    { key: "cardId", header: "卡片ID" },
    { key: "genericName", header: "通用名" },
    { key: "categoryName", header: "所属分类" },
    { key: "kindLabel", header: "题型" },
    { key: "isCorrectLabel", header: "是否正确" },
    { key: "isCorrect", header: "是否正确(布尔)" },
  ];

  const records: ExportRecord[] = attempts.map((row) => {
    const card = lookup.get(row.cardId);
    return {
      answeredAt: row.answeredAt,
      answeredOn: row.answeredOn,
      questionId: row.questionId,
      cardId: row.cardId,
      genericName: card?.genericName ?? DELETED_CARD,
      categoryName: card?.categoryName ?? "",
      kindLabel: kindLabel(row.kind),
      isCorrectLabel: row.isCorrect ? "是" : "否",
      isCorrect: row.isCorrect,
    };
  });

  return { kind: "quiz", columns, records };
}

/** 错题本 */
async function buildWrongBookDataset(): Promise<ExportDataset> {
  const [wrongQuestions, lookup] = await Promise.all([
    exportRepository.getWrongQuestions(),
    buildCardLookup(),
  ]);

  const columns: ExportColumn[] = [
    { key: "questionId", header: "题目ID" },
    { key: "cardId", header: "卡片ID" },
    { key: "genericName", header: "通用名" },
    { key: "categoryName", header: "所属分类" },
    { key: "kindLabel", header: "题型" },
    { key: "wrongCount", header: "错误次数" },
    { key: "lastWrongAt", header: "最近答错时刻" },
    { key: "lastCorrectAt", header: "最近答对时刻" },
    { key: "masteredLabel", header: "是否已答对过" },
  ];

  const records: ExportRecord[] = wrongQuestions.map((row) => {
    const card = lookup.get(row.cardId);
    return {
      questionId: row.questionId,
      cardId: row.cardId,
      genericName: card?.genericName ?? DELETED_CARD,
      categoryName: card?.categoryName ?? "",
      kindLabel: kindLabel(row.kind),
      wrongCount: row.wrongCount,
      lastWrongAt: row.lastWrongAt,
      lastCorrectAt: row.lastCorrectAt ?? "",
      masteredLabel: row.lastCorrectAt ? "是" : "否",
    };
  });

  return { kind: "wrong-book", columns, records };
}

/** 收藏 */
async function buildFavoriteDataset(): Promise<ExportDataset> {
  const [favorites, lookup, cards] = await Promise.all([
    exportRepository.getFavorites(),
    buildCardLookup(),
    cardRepository.getAll(),
  ]);

  const cardById = new Map(cards.map((card) => [card.id, card]));

  const columns: ExportColumn[] = [
    { key: "cardId", header: "卡片ID" },
    { key: "genericName", header: "通用名" },
    { key: "englishName", header: "英文名" },
    { key: "categoryName", header: "所属分类" },
    { key: "target", header: "作用靶点" },
    { key: "createdAt", header: "收藏时刻" },
  ];

  const records: ExportRecord[] = favorites.map((row) => {
    const card = lookup.get(row.cardId);
    const full = cardById.get(row.cardId);
    return {
      cardId: row.cardId,
      genericName: card?.genericName ?? DELETED_CARD,
      englishName: card?.englishName ?? "",
      categoryName: card?.categoryName ?? "",
      target: full?.target ?? "",
      createdAt: row.createdAt,
    };
  });

  return { kind: "favorites", columns, records };
}

/** 按类型取结构化数据集 */
export async function buildDataset(kind: ExportKind): Promise<ExportDataset> {
  switch (kind) {
    case "reviews":
      return buildReviewDataset();
    case "quiz":
      return buildQuizDataset();
    case "wrong-book":
      return buildWrongBookDataset();
    case "favorites":
      return buildFavoriteDataset();
  }
}

// ---- 序列化 ----

/** 按格式生成可下载文件 */
export async function buildExport(
  kind: ExportKind,
  format: ExportFormat,
  now: Date,
): Promise<ExportFile> {
  const dataset = await buildDataset(kind);

  if (format === "json") {
    return {
      filename: buildExportFilename(kind, now, "json"),
      content: datasetToJson(dataset, now),
      rowCount: dataset.records.length,
      contentType: "application/json; charset=utf-8",
    };
  }

  return {
    filename: buildExportFilename(kind, now, "csv"),
    content: datasetToCsv(dataset),
    rowCount: dataset.records.length,
    contentType: "text/csv; charset=utf-8",
  };
}

/** 各类型当前有多少条数据，用于界面上显示「可导出 N 条」 */
export async function getExportCounts(): Promise<Record<ExportKind, number>> {
  const [history, attempts, wrongQuestions, favorites] = await Promise.all([
    exportRepository.getReviewHistory(),
    exportRepository.getQuizAttempts(),
    exportRepository.getWrongQuestions(),
    exportRepository.getFavorites(),
  ]);

  return {
    reviews: history.length,
    quiz: attempts.length,
    "wrong-book": wrongQuestions.length,
    favorites: favorites.length,
  };
}
