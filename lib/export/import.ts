import type Database from "better-sqlite3";

import { QUESTION_KIND_LABELS, type QuestionKind } from "@/lib/quiz/generator";
import {
  INITIAL_STATE,
  nextReviewDate,
  scheduleNext,
  toDateKey,
  type ReviewState,
} from "@/lib/review/sm2";
import type { ReviewQuality } from "@/lib/types";

export type ImportKind = "reviews" | "quiz" | "wrong-book" | "favorites";

const IMPORT_KINDS: readonly ImportKind[] = [
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
  attemptId: string | null;
  // 旧备份没有流水 ID，按可用字段和出现次数匹配。
  legacyOccurrence: number;
  matchSelectedId: string | null;
  matchCorrectId: string | null;
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

function isImportKind(value: unknown): value is ImportKind {
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
    const occurrences = new Map<string, number>();
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
      if (item.attemptId !== undefined &&
          (typeof item.attemptId !== "string" || !/^[a-f0-9]{32}$/.test(item.attemptId))) {
        throw new ImportValidationError(`第 ${rowIndex} 条测验记录的答题记录 ID 无效。`);
      }
      const attemptId = item.attemptId ?? null;
      const questionId = item.questionId.trim();
      // 更早的导入器用这两个占位值保存没有选项信息的备份。
      const placeholder = item.correctId === "imported-correct" &&
        item.selectedId === (item.isCorrect ? "imported-correct" : "imported-wrong");
      const matchCorrectId = !placeholder && typeof item.correctId === "string" && item.correctId ? item.correctId : null;
      const matchSelectedId = !placeholder && typeof item.selectedId === "string" && item.selectedId ? item.selectedId : null;
      const correctId = matchCorrectId ?? "imported-correct";
      const selectedId = matchSelectedId ?? (item.isCorrect ? correctId : "imported-wrong");
      let legacyOccurrence = 0;
      if (!attemptId || placeholder) {
        const key = JSON.stringify([questionId, cardId, questionKind, timestamp, dateKey,
          item.isCorrect, matchSelectedId, matchCorrectId]);
        legacyOccurrence = (occurrences.get(key) ?? 0) + 1;
        occurrences.set(key, legacyOccurrence);
      }
      return {
        attemptId,
        legacyOccurrence,
        matchSelectedId,
        matchCorrectId,
        questionId,
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

function pickLaterTimestamp(a: string, b: string): string {
  return Date.parse(b) > Date.parse(a) ? b : a;
}

function pickLaterNullableTimestamp(
  a: string | null,
  b: string | null,
): string | null {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(b) > Date.parse(a) ? b : a;
}

/** 将校验后的学习数据事务性地合并写入 SQLite */
export function mergeImportDataset(
  db: Database.Database,
  dataset: ValidatedImportDataset,
): ImportSummary {
  const summary: ImportSummary = {
    kind: dataset.kind,
    total: dataset.records.length,
    inserted: 0,
    updated: 0,
    skipped: 0,
  };

  if (dataset.records.length === 0) {
    return summary;
  }

  const tx = db.transaction(() => {
    if (dataset.kind === "favorites") {
      const stmt = db.prepare(
        "INSERT OR IGNORE INTO favorite (card_id, created_at) VALUES (?, ?)",
      );
      for (const row of dataset.records) {
        const res = stmt.run(row.cardId, row.createdAt);
        if (res.changes > 0) summary.inserted += 1;
        else summary.skipped += 1;
      }
      return;
    }

    if (dataset.kind === "reviews") {
      const existsStmt = db.prepare(
        "SELECT 1 AS x FROM review_history WHERE card_id = ? AND reviewed_at = ? LIMIT 1",
      );
      const insertHistoryStmt = db.prepare(
        "INSERT INTO review_history (card_id, quality, reviewed_on, reviewed_at) VALUES (?, ?, ?, ?)",
      );
      const seen = new Set<string>();
      const affectedCardIds = new Set<string>();

      for (const row of dataset.records) {
        const dedupKey = `${row.cardId}\0${row.reviewedAt}`;
        if (seen.has(dedupKey) || existsStmt.get(row.cardId, row.reviewedAt)) {
          summary.skipped += 1;
          continue;
        }
        seen.add(dedupKey);
        insertHistoryStmt.run(
          row.cardId,
          row.quality,
          row.reviewedOn,
          row.reviewedAt,
        );
        affectedCardIds.add(row.cardId);
        summary.inserted += 1;
      }

      if (affectedCardIds.size > 0) {
        const historyStmt = db.prepare(
          "SELECT quality, reviewed_at FROM review_history WHERE card_id = ? ORDER BY reviewed_at ASC, id ASC",
        );
        const upsertLogStmt = db.prepare(
          `INSERT INTO review_log
             (card_id, repetitions, easiness, interval_days, next_review_at, last_reviewed_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(card_id) DO UPDATE SET
             repetitions = excluded.repetitions,
             easiness = excluded.easiness,
             interval_days = excluded.interval_days,
             next_review_at = excluded.next_review_at,
             last_reviewed_at = excluded.last_reviewed_at,
             updated_at = excluded.updated_at`,
        );
        const nowIso = new Date().toISOString();

        for (const cardId of affectedCardIds) {
          const rows = historyStmt.all(cardId) as Array<{
            quality: number;
            reviewed_at: string;
          }>;
          if (rows.length === 0) continue;

          let state: ReviewState = { ...INITIAL_STATE };
          let lastReviewedAt = rows[0]!.reviewed_at;
          for (const hist of rows) {
            const q = (
              hist.quality === 0 || hist.quality === 1 || hist.quality === 2
                ? hist.quality
                : 2
            ) as ReviewQuality;
            state = scheduleNext(state, q);
            lastReviewedAt = hist.reviewed_at;
          }

          const nextDate = nextReviewDate(
            new Date(lastReviewedAt),
            state.intervalDays,
          );
          upsertLogStmt.run(
            cardId,
            state.repetitions,
            state.easiness,
            state.intervalDays,
            toDateKey(nextDate),
            lastReviewedAt,
            nowIso,
          );
        }
      }
      return;
    }

    if (dataset.kind === "quiz") {
      const upgrade = db.prepare(`UPDATE quiz_attempt SET attempt_id = ?, selected_id = ?, correct_id = ?
        WHERE NOT EXISTS (SELECT 1 FROM quiz_attempt WHERE attempt_id = ?)
          AND id = (SELECT id FROM quiz_attempt WHERE question_id = ? AND card_id = ?
            AND kind = ? AND answered_at = ? AND answered_on = ? AND is_correct = ?
            AND correct_id = 'imported-correct' AND selected_id IN ('imported-correct', 'imported-wrong')
            ORDER BY id LIMIT 1)`);
      const insert = db.prepare(`INSERT INTO quiz_attempt
        (attempt_id, question_id, card_id, kind, selected_id, correct_id, is_correct, answered_on, answered_at)
        SELECT COALESCE(?, lower(hex(randomblob(16)))), ?, ?, ?, ?, ?, ?, ?, ?
        WHERE ? = 0 OR (
          SELECT COUNT(*) FROM quiz_attempt WHERE question_id = ? AND card_id = ?
            AND kind = ? AND answered_at = ? AND answered_on = ? AND is_correct = ?
            AND (? IS NULL OR selected_id = ?) AND (? IS NULL OR correct_id = ?)
        ) < ?
        ON CONFLICT(attempt_id) DO NOTHING`);
      for (const row of dataset.records) {
        const correct = Number(row.isCorrect);
        if (row.attemptId && row.legacyOccurrence === 0) {
          summary.updated += upgrade.run(
              row.attemptId, row.selectedId, row.correctId, row.attemptId,
              row.questionId, row.cardId, row.kind, row.answeredAt, row.answeredOn, correct,
          ).changes;
        }
        const result = insert.run(
          row.attemptId, row.questionId, row.cardId, row.kind, row.selectedId, row.correctId,
          correct, row.answeredOn, row.answeredAt,
          row.legacyOccurrence, row.questionId, row.cardId, row.kind, row.answeredAt, row.answeredOn,
          correct, row.matchSelectedId, row.matchSelectedId, row.matchCorrectId, row.matchCorrectId,
          row.legacyOccurrence,
        );
        summary.inserted += result.changes;
      }
      summary.skipped = summary.total - summary.inserted - summary.updated;
      return;
    }

    const selectStmt = db.prepare(
      "SELECT wrong_count, last_wrong_at, last_correct_at FROM wrong_question WHERE question_id = ?",
    );
    const insertWrongStmt = db.prepare(
      `INSERT INTO wrong_question
         (question_id, card_id, kind, wrong_count, last_wrong_at, last_correct_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
    const updateWrongStmt = db.prepare(
      `UPDATE wrong_question
       SET wrong_count = ?, last_wrong_at = ?, last_correct_at = ?
       WHERE question_id = ?`,
    );

    for (const row of dataset.records) {
      const existing = selectStmt.get(row.questionId) as
        | {
            wrong_count: number;
            last_wrong_at: string;
            last_correct_at: string | null;
          }
        | undefined;

      if (!existing) {
        insertWrongStmt.run(
          row.questionId,
          row.cardId,
          row.kind,
          row.wrongCount,
          row.lastWrongAt,
          row.lastCorrectAt,
        );
        summary.inserted += 1;
        continue;
      }

      const nextWrongCount = Math.max(existing.wrong_count, row.wrongCount);
      const nextLastWrongAt = pickLaterTimestamp(
        existing.last_wrong_at,
        row.lastWrongAt,
      );
      const nextLastCorrectAt = pickLaterNullableTimestamp(
        existing.last_correct_at,
        row.lastCorrectAt,
      );

      if (
        nextWrongCount === existing.wrong_count &&
        nextLastWrongAt === existing.last_wrong_at &&
        nextLastCorrectAt === existing.last_correct_at
      ) {
        summary.skipped += 1;
      } else {
        updateWrongStmt.run(
          nextWrongCount,
          nextLastWrongAt,
          nextLastCorrectAt,
          row.questionId,
        );
        summary.updated += 1;
      }
    }
  });

  tx();
  return summary;
}

/** 校验并导入学习数据 JSON（支持传入测试用 DB 与卡片 ID 集合） */
export async function importLearningDataset(
  raw: unknown,
  deps?: {
    db?: Database.Database;
    validCardIds?: ReadonlySet<string>;
  },
): Promise<ImportSummary> {
  let validCardIds = deps?.validCardIds;
  if (!validCardIds) {
    const { cardRepository } = await import("@/lib/data/cards");
    const cards = await cardRepository.getAll();
    validCardIds = new Set(cards.map((card) => card.id));
  }

  const parsed = parseImportDataset(raw, validCardIds);

  let db = deps?.db;
  if (!db) {
    const { getDatabase } = await import("@/lib/db/sqlite");
    db = getDatabase();
  }

  return mergeImportDataset(db, parsed);
}
