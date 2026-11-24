import type {
  ImportSummary,
  ValidatedImportDataset,
} from "@/lib/export/import";
import {
  pickLaterNullableTimestamp,
  pickLaterTimestamp,
} from "@/lib/export/import";
import {
  fromDateKey,
  INITIAL_STATE,
  nextReviewDate,
  scheduleNext,
  toDateKey,
  type ReviewState,
} from "@/lib/review/sm2";
import type { ReviewQuality } from "@/lib/types";
import { rows, type ContextReader, type DataContext } from "./types";

const BATCH_SIZE = 100;

async function runBatches(
  db: DataContext["db"],
  statements: D1PreparedStatement[],
): Promise<void> {
  for (let i = 0; i < statements.length; i += BATCH_SIZE) {
    await db.batch(statements.slice(i, i + BATCH_SIZE));
  }
}

export class D1ImportRepository {
  private readonly context: ContextReader;
  constructor(context: ContextReader) {
    this.context = context;
  }

  /** 将校验后的学习数据按当前登录 user_id 幂等合并写入 D1 */
  async mergeDataset(dataset: ValidatedImportDataset): Promise<ImportSummary> {
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

    const { db, userId } = await this.context();

    if (dataset.kind === "favorites") {
      const existing = await rows<{ card_id: string; enabled: number }>(
        db.prepare("SELECT card_id, enabled FROM favorite WHERE user_id = ?").bind(userId),
      );
      const stateByCard = new Map(existing.map((r) => [r.card_id, Number(r.enabled)]));
      const statements: D1PreparedStatement[] = [];

      for (const row of dataset.records) {
        const prev = stateByCard.get(row.cardId);
        if (prev === 1) {
          summary.skipped += 1;
          continue;
        }
        if (prev === 0) {
          statements.push(
            db
              .prepare(
                "UPDATE favorite SET enabled = 1, created_at = ? WHERE user_id = ? AND card_id = ?",
              )
              .bind(row.createdAt, userId, row.cardId),
          );
          stateByCard.set(row.cardId, 1);
          summary.updated += 1;
          continue;
        }
        statements.push(
          db
            .prepare(
              "INSERT INTO favorite (user_id, card_id, created_at, enabled) VALUES (?, ?, ?, 1)",
            )
            .bind(userId, row.cardId, row.createdAt),
        );
        stateByCard.set(row.cardId, 1);
        summary.inserted += 1;
      }

      await runBatches(db, statements);
      return summary;
    }

    if (dataset.kind === "reviews") {
      const existing = await rows<{ card_id: string; reviewed_at: string }>(
        db
          .prepare("SELECT card_id, reviewed_at FROM review_history WHERE user_id = ?")
          .bind(userId),
      );
      const seen = new Set(existing.map((r) => `${r.card_id}\u0000${r.reviewed_at}`));
      const insertStatements: D1PreparedStatement[] = [];
      const affectedCardIds = new Set<string>();

      for (const row of dataset.records) {
        const key = `${row.cardId}\u0000${row.reviewedAt}`;
        if (seen.has(key)) {
          summary.skipped += 1;
          continue;
        }
        seen.add(key);
        affectedCardIds.add(row.cardId);
        insertStatements.push(
          db
            .prepare(
              "INSERT INTO review_history (user_id, card_id, quality, reviewed_on, reviewed_at) VALUES (?, ?, ?, ?, ?)",
            )
            .bind(userId, row.cardId, row.quality, row.reviewedOn, row.reviewedAt),
        );
        summary.inserted += 1;
      }

      await runBatches(db, insertStatements);

      if (affectedCardIds.size > 0) {
        const upsertStatements: D1PreparedStatement[] = [];
        for (const cardId of affectedCardIds) {
          const history = await rows<{
            quality: ReviewQuality;
            reviewed_on: string;
            reviewed_at: string;
          }>(
            db
              .prepare(
                "SELECT quality, reviewed_on, reviewed_at FROM review_history WHERE user_id = ? AND card_id = ? ORDER BY reviewed_at ASC, id ASC",
              )
              .bind(userId, cardId),
          );
          if (history.length === 0) continue;

          let state: ReviewState = { ...INITIAL_STATE };
          for (const h of history) {
            state = scheduleNext(state, h.quality);
          }
          const last = history[history.length - 1];
          const nextReviewAt = toDateKey(
            nextReviewDate(fromDateKey(last.reviewed_on), state.intervalDays),
          );
          const operation = crypto.randomUUID();

          upsertStatements.push(
            db
              .prepare(
                `INSERT INTO review_log
                  (user_id, card_id, quality, repetitions, easiness, interval_days, next_review_at, last_reviewed_at, updated_at, version, operation_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
                 ON CONFLICT(user_id, card_id) DO UPDATE SET
                   quality = excluded.quality,
                   repetitions = excluded.repetitions,
                   easiness = excluded.easiness,
                   interval_days = excluded.interval_days,
                   next_review_at = excluded.next_review_at,
                   last_reviewed_at = excluded.last_reviewed_at,
                   updated_at = excluded.updated_at,
                   version = review_log.version + 1,
                   operation_id = excluded.operation_id`,
              )
              .bind(
                userId,
                cardId,
                last.quality,
                state.repetitions,
                state.easiness,
                state.intervalDays,
                nextReviewAt,
                last.reviewed_at,
                last.reviewed_at,
                operation,
              ),
          );
        }
        await runBatches(db, upsertStatements);
      }

      return summary;
    }

    if (dataset.kind === "quiz") {
      const existing = await rows<{
        question_id: string;
        answered_at: string;
        selected_id: string;
        is_correct: number;
      }>(
        db
          .prepare(
            "SELECT question_id, answered_at, selected_id, is_correct FROM quiz_attempt WHERE user_id = ?",
          )
          .bind(userId),
      );
      const seen = new Set(
        existing.map(
          (r) =>
            `${r.question_id}\u0000${r.answered_at}\u0000${r.selected_id}\u0000${Number(r.is_correct)}`,
        ),
      );
      const statements: D1PreparedStatement[] = [];

      for (const row of dataset.records) {
        const isCorrectNum = row.isCorrect ? 1 : 0;
        const key = `${row.questionId}\u0000${row.answeredAt}\u0000${row.selectedId}\u0000${isCorrectNum}`;
        if (seen.has(key)) {
          summary.skipped += 1;
          continue;
        }
        seen.add(key);
        statements.push(
          db
            .prepare(
              "INSERT INTO quiz_attempt (user_id, question_id, card_id, kind, selected_id, correct_id, is_correct, answered_on, answered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
            .bind(
              userId,
              row.questionId,
              row.cardId,
              row.kind,
              row.selectedId,
              row.correctId,
              isCorrectNum,
              row.answeredOn,
              row.answeredAt,
            ),
        );
        summary.inserted += 1;
      }

      await runBatches(db, statements);
      return summary;
    }

    const existingWrong = await rows<{
      question_id: string;
      card_id: string;
      kind: string;
      wrong_count: number;
      last_wrong_at: string;
      last_correct_at: string | null;
    }>(
      db
        .prepare(
          "SELECT question_id, card_id, kind, wrong_count, last_wrong_at, last_correct_at FROM wrong_question WHERE user_id = ?",
        )
        .bind(userId),
    );
    const byQuestion = new Map(
      existingWrong.map((r) => [
        r.question_id,
        {
          wrongCount: Number(r.wrong_count),
          lastWrongAt: r.last_wrong_at,
          lastCorrectAt: r.last_correct_at,
        },
      ]),
    );
    const statements: D1PreparedStatement[] = [];

    for (const row of dataset.records) {
      const prev = byQuestion.get(row.questionId);
      if (!prev) {
        statements.push(
          db
            .prepare(
              "INSERT INTO wrong_question (user_id, question_id, card_id, kind, wrong_count, last_wrong_at, last_correct_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            )
            .bind(
              userId,
              row.questionId,
              row.cardId,
              row.kind,
              row.wrongCount,
              row.lastWrongAt,
              row.lastCorrectAt,
            ),
        );
        byQuestion.set(row.questionId, {
          wrongCount: row.wrongCount,
          lastWrongAt: row.lastWrongAt,
          lastCorrectAt: row.lastCorrectAt,
        });
        summary.inserted += 1;
        continue;
      }

      const nextWrongCount = Math.max(prev.wrongCount, row.wrongCount);
      const nextLastWrongAt = pickLaterTimestamp(prev.lastWrongAt, row.lastWrongAt);
      const nextLastCorrectAt = pickLaterNullableTimestamp(
        prev.lastCorrectAt,
        row.lastCorrectAt,
      );

      if (
        nextWrongCount === prev.wrongCount &&
        nextLastWrongAt === prev.lastWrongAt &&
        nextLastCorrectAt === prev.lastCorrectAt
      ) {
        summary.skipped += 1;
        continue;
      }

      statements.push(
        db
          .prepare(
            "UPDATE wrong_question SET wrong_count = ?, last_wrong_at = ?, last_correct_at = ? WHERE user_id = ? AND question_id = ?",
          )
          .bind(
            nextWrongCount,
            nextLastWrongAt,
            nextLastCorrectAt,
            userId,
            row.questionId,
          ),
      );
      byQuestion.set(row.questionId, {
        wrongCount: nextWrongCount,
        lastWrongAt: nextLastWrongAt,
        lastCorrectAt: nextLastCorrectAt,
      });
      summary.updated += 1;
    }

    await runBatches(db, statements);
    return summary;
  }
}
