import { QUESTION_KIND_LABELS, type QuestionKind } from "@/lib/quiz/generator";
import { toDateKey } from "@/lib/review/sm2";
import type { ReviewQuality } from "@/lib/types";

export type ImportKind = "reviews" | "quiz" | "wrong-book" | "favorites";

export const IMPORT_KINDS: readonly ImportKind[] = [
  "reviews",
  "quiz",
  "wrong-book",
  "favorites",
];

const KIND_BY_LABEL = new Map<string, QuestionKind>(
  Object.entries(QUESTION_KIND_LABELS).map(([kind, label]) => [
    label,
    kind as QuestionKind,
  ]),
);

const VALID_QUESTION_KINDS = new Set<string>(Object.keys(QUESTION_KIND_LABELS));

export class ImportValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportValidationError";
  }
}

export interface ImportSummary {
  kind: ImportKind;
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
}

export interface ValidatedReviewRecord {
  cardId: string;
  quality: ReviewQuality;
  reviewedOn: string;
  reviewedAt: string;
}

export interface ValidatedQuizRecord {
  questionId: string;
  cardId: string;
  kind: QuestionKind;
  selectedId: string;
  correctId: string;
  isCorrect: boolean;
  answeredOn: string;
  answeredAt: string;
}

export interface ValidatedWrongQuestionRecord {
  questionId: string;
  cardId: string;
  kind: QuestionKind;
  wrongCount: number;
  lastWrongAt: string;
  lastCorrectAt: string | null;
}

export interface ValidatedFavoriteRecord {
  cardId: string;
  createdAt: string;
}

export type ValidatedImportDataset =
  | { kind: "reviews"; records: ValidatedReviewRecord[] }
  | { kind: "quiz"; records: ValidatedQuizRecord[] }
  | { kind: "wrong-book"; records: ValidatedWrongQuestionRecord[] }
  | { kind: "favorites"; records: ValidatedFavoriteRecord[] };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isImportKind(value: unknown): value is ImportKind {
  return (
    typeof value === "string" &&
    (IMPORT_KINDS as readonly string[]).includes(value)
  );
}

/** 校验 YYYY-MM-DD 是否为真实日历日期 */
export function isValidDateKey(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/** 校验 ISO 时刻或日期时间字符串，防止纯数字或非法格式混入 */
export function isValidIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(trimmed)) return false;
  const datePart = trimmed.slice(0, 10);
  if (!isValidDateKey(datePart)) return false;
  const ms = Date.parse(trimmed);
  return Number.isFinite(ms);
}

function parseReviewQuality(value: unknown, rowIndex: number): ReviewQuality {
  if (value === 0 || value === 1 || value === 2) {
    return value;
  }
  throw new ImportValidationError(
    `第 ${rowIndex} 条复习记录的评分无效（必须为 0、1 或 2）。`,
  );
}

function parseCardId(
  value: unknown,
  validCardIds: ReadonlySet<string>,
  rowIndex: number,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ImportValidationError(`第 ${rowIndex} 条记录缺少有效的卡片 ID。`);
  }
  if (!validCardIds.has(value)) {
    throw new ImportValidationError(
      `第 ${rowIndex} 条记录的卡片 ID「${value}」不在当前卡片库中，已拒绝导入。`,
    );
  }
  return value;
}

function parseQuestionKind(
  record: Record<string, unknown>,
  rowIndex: number,
): QuestionKind {
  if (typeof record.kind === "string" && VALID_QUESTION_KINDS.has(record.kind)) {
    return record.kind as QuestionKind;
  }
  if (typeof record.kindLabel === "string") {
    const mapped = KIND_BY_LABEL.get(record.kindLabel);
    if (mapped) return mapped;
  }
  throw new ImportValidationError(
    `第 ${rowIndex} 条记录缺少可识别的题型字段（kind 或 kindLabel）。`,
  );
}

function resolveDatePair(
  timestampRaw: unknown,
  dateKeyRaw: unknown,
  rowIndex: number,
  label: string,
): { timestamp: string; dateKey: string } {
  const hasTs = timestampRaw !== undefined && timestampRaw !== null && timestampRaw !== "";
  const hasDate = dateKeyRaw !== undefined && dateKeyRaw !== null && dateKeyRaw !== "";

  if (!hasTs && !hasDate) {
    throw new ImportValidationError(`第 ${rowIndex} 条记录缺少${label}时间。`);
  }

  let timestamp: string;
  if (hasTs) {
    if (!isValidIsoTimestamp(timestampRaw)) {
      throw new ImportValidationError(
        `第 ${rowIndex} 条记录的${label}时刻格式无效。`,
      );
    }
    timestamp = timestampRaw.trim();
  } else {
    if (!isValidDateKey(dateKeyRaw)) {
      throw new ImportValidationError(
        `第 ${rowIndex} 条记录的${label}日期格式无效（应为 YYYY-MM-DD）。`,
      );
    }
    timestamp = `${dateKeyRaw}T00:00:00.000Z`;
  }

  let dateKey: string;
  if (hasDate) {
    if (!isValidDateKey(dateKeyRaw)) {
      throw new ImportValidationError(
        `第 ${rowIndex} 条记录的${label}日期格式无效（应为 YYYY-MM-DD）。`,
      );
    }
    dateKey = dateKeyRaw;
  } else {
    dateKey = toDateKey(new Date(timestamp));
  }

  return { timestamp, dateKey };
}

/** 校验并规范化导入的 JSON 数据集（纯函数，可用于单元测试与服务端校验） */
export function parseImportDataset(
  raw: unknown,
  validCardIds: ReadonlySet<string>,
): ValidatedImportDataset {
  if (!isPlainObject(raw)) {
    throw new ImportValidationError("导入内容必须是包含 kind 与 records 的 JSON 对象。");
  }

  if (!isImportKind(raw.kind)) {
    throw new ImportValidationError(
      "未知的数据类型（kind 必须为 reviews、quiz、wrong-book 或 favorites）。",
    );
  }

  if (!Array.isArray(raw.records)) {
    throw new ImportValidationError("导入内容缺少 records 数组。");
  }

  const kind = raw.kind;

  if (kind === "favorites") {
    const records: ValidatedFavoriteRecord[] = raw.records.map((item, idx) => {
      const rowIndex = idx + 1;
      if (!isPlainObject(item)) {
        throw new ImportValidationError(`第 ${rowIndex} 条收藏记录格式无效。`);
      }
      const cardId = parseCardId(item.cardId, validCardIds, rowIndex);
      if (!isValidIsoTimestamp(item.createdAt)) {
        throw new ImportValidationError(
          `第 ${rowIndex} 条收藏记录的收藏时刻（createdAt）格式无效。`,
        );
      }
      return { cardId, createdAt: item.createdAt.trim() };
    });
    return { kind, records };
  }

  if (kind === "reviews") {
    const records: ValidatedReviewRecord[] = raw.records.map((item, idx) => {
      const rowIndex = idx + 1;
      if (!isPlainObject(item)) {
        throw new ImportValidationError(`第 ${rowIndex} 条复习记录格式无效。`);
      }
      const cardId = parseCardId(item.cardId, validCardIds, rowIndex);
      const quality = parseReviewQuality(item.quality, rowIndex);
      const { timestamp, dateKey } = resolveDatePair(
        item.reviewedAt,
        item.reviewedOn,
        rowIndex,
        "复习",
      );
      return {
        cardId,
        quality,
        reviewedAt: timestamp,
        reviewedOn: dateKey,
      };
    });
    return { kind, records };
  }

  if (kind === "quiz") {
    const records: ValidatedQuizRecord[] = raw.records.map((item, idx) => {
      const rowIndex = idx + 1;
      if (!isPlainObject(item)) {
        throw new ImportValidationError(`第 ${rowIndex} 条测验记录格式无效。`);
      }
      const cardId = parseCardId(item.cardId, validCardIds, rowIndex);
      if (typeof item.questionId !== "string" || item.questionId.trim().length === 0) {
        throw new ImportValidationError(`第 ${rowIndex} 条测验记录缺少题目 ID。`);
      }
      if (typeof item.isCorrect !== "boolean") {
        throw new ImportValidationError(
          `第 ${rowIndex} 条测验记录的 isCorrect 必须为布尔值。`,
        );
      }
      const questionKind = parseQuestionKind(item, rowIndex);
      const { timestamp, dateKey } = resolveDatePair(
        item.answeredAt,
        item.answeredOn,
        rowIndex,
        "答题",
      );
      const correctId =
        typeof item.correctId === "string" && item.correctId.length > 0
          ? item.correctId
          : "imported-correct";
      const selectedId =
        typeof item.selectedId === "string" && item.selectedId.length > 0
          ? item.selectedId
          : item.isCorrect
            ? correctId
            : "imported-wrong";

      return {
        questionId: item.questionId.trim(),
        cardId,
        kind: questionKind,
        selectedId,
        correctId,
        isCorrect: item.isCorrect,
        answeredAt: timestamp,
        answeredOn: dateKey,
      };
    });
    return { kind, records };
  }

  const records: ValidatedWrongQuestionRecord[] = raw.records.map(
    (item, idx) => {
      const rowIndex = idx + 1;
      if (!isPlainObject(item)) {
        throw new ImportValidationError(`第 ${rowIndex} 条错题记录格式无效。`);
      }
      const cardId = parseCardId(item.cardId, validCardIds, rowIndex);
      if (typeof item.questionId !== "string" || item.questionId.trim().length === 0) {
        throw new ImportValidationError(`第 ${rowIndex} 条错题记录缺少题目 ID。`);
      }
      const questionKind = parseQuestionKind(item, rowIndex);
      if (
        typeof item.wrongCount !== "number" ||
        !Number.isInteger(item.wrongCount) ||
        item.wrongCount < 0
      ) {
        throw new ImportValidationError(
          `第 ${rowIndex} 条错题记录的错误次数（wrongCount）必须为非负整数。`,
        );
      }
      if (!isValidIsoTimestamp(item.lastWrongAt)) {
        throw new ImportValidationError(
          `第 ${rowIndex} 条错题记录的最近答错时刻（lastWrongAt）格式无效。`,
        );
      }
      let lastCorrectAt: string | null = null;
      if (
        item.lastCorrectAt !== null &&
        item.lastCorrectAt !== undefined &&
        item.lastCorrectAt !== ""
      ) {
        if (!isValidIsoTimestamp(item.lastCorrectAt)) {
          throw new ImportValidationError(
            `第 ${rowIndex} 条错题记录的最近答对时刻（lastCorrectAt）格式无效。`,
          );
        }
        lastCorrectAt = item.lastCorrectAt.trim();
      }

      return {
        questionId: item.questionId.trim(),
        cardId,
        kind: questionKind,
        wrongCount: item.wrongCount,
        lastWrongAt: item.lastWrongAt.trim(),
        lastCorrectAt,
      };
    },
  );
  return { kind, records };
}

export function pickLaterTimestamp(a: string, b: string): string {
  return Date.parse(b) > Date.parse(a) ? b : a;
}

export function pickLaterNullableTimestamp(
  a: string | null,
  b: string | null,
): string | null {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(b) > Date.parse(a) ? b : a;
}
