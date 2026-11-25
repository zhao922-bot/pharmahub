import { after, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";

import { cardRepository } from "../lib/data/cards/index.ts";
import { datasetToJson } from "../lib/export/serialize.ts";
import {
  importLearningDataset,
  ImportValidationError,
} from "../lib/export/import.ts";
import { INITIAL_STATE, scheduleNext } from "../lib/review/sm2.ts";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS review_log (
  card_id          TEXT PRIMARY KEY,
  repetitions      INTEGER NOT NULL DEFAULT 0,
  easiness         REAL    NOT NULL DEFAULT 2.5,
  interval_days    INTEGER NOT NULL DEFAULT 0,
  next_review_at   TEXT    NOT NULL,
  last_reviewed_at TEXT    NOT NULL,
  updated_at       TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS review_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id     TEXT    NOT NULL,
  quality     INTEGER NOT NULL,
  reviewed_on TEXT    NOT NULL,
  reviewed_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS favorite (
  card_id    TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempt (
  attempt_id  TEXT UNIQUE,
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT    NOT NULL,
  card_id     TEXT    NOT NULL,
  kind        TEXT    NOT NULL,
  selected_id TEXT    NOT NULL,
  correct_id  TEXT    NOT NULL,
  is_correct  INTEGER NOT NULL,
  answered_on TEXT    NOT NULL,
  answered_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS wrong_question (
  question_id     TEXT PRIMARY KEY,
  card_id         TEXT    NOT NULL,
  kind            TEXT    NOT NULL,
  wrong_count     INTEGER NOT NULL DEFAULT 1,
  last_wrong_at   TEXT    NOT NULL,
  last_correct_at TEXT
);
`;

const tempDirs = [];

function createTempDb() {
  const dir = mkdtempSync(join(tmpdir(), "pharmahub-import-"));
  tempDirs.push(dir);
  const db = new Database(join(dir, "test.db"));
  db.exec(SCHEMA);
  return db;
}

after(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
});

const allCards = await cardRepository.getAll();
const validCardIds = new Set(allCards.map((card) => card.id));

test("favorites：datasetToJson 往返导入并保持幂等", async () => {
  const db = createTempDb();
  try {
    const jsonText = datasetToJson(
      {
        kind: "favorites",
        columns: [
          { key: "cardId", header: "卡片ID" },
          { key: "genericName", header: "通用名" },
          { key: "createdAt", header: "收藏时刻" },
        ],
        records: [
          {
            cardId: "metoprolol",
            genericName: "美托洛尔",
            createdAt: "2026-10-18T08:00:00.000Z",
          },
          {
            cardId: "aspirin",
            genericName: "阿司匹林",
            createdAt: "2026-10-19T09:30:00.000Z",
          },
        ],
      },
      new Date("2026-10-20T00:00:00.000Z"),
    );

    const payload = JSON.parse(jsonText);
    const first = await importLearningDataset(payload, { db, validCardIds });
    assert.deepEqual(first, {
      kind: "favorites",
      total: 2,
      inserted: 2,
      updated: 0,
      skipped: 0,
    });

    const rows = db
      .prepare("SELECT card_id, created_at FROM favorite ORDER BY card_id ASC")
      .all();
    assert.equal(rows.length, 2);

    const second = await importLearningDataset(payload, { db, validCardIds });
    assert.deepEqual(second, {
      kind: "favorites",
      total: 2,
      inserted: 0,
      updated: 0,
      skipped: 2,
    });
  } finally {
    db.close();
  }
});

test("reviews：往返导入、重算 SM-2 状态且重复导入去重", async () => {
  const db = createTempDb();
  try {
    const jsonText = datasetToJson(
      {
        kind: "reviews",
        columns: [
          { key: "reviewedAt", header: "复习时刻" },
          { key: "reviewedOn", header: "复习日期" },
          { key: "cardId", header: "卡片ID" },
          { key: "quality", header: "自评分" },
        ],
        records: [
          {
            reviewedAt: "2026-10-18T08:00:00.000Z",
            reviewedOn: "2026-10-18",
            cardId: "metoprolol",
            quality: 2,
          },
          {
            reviewedAt: "2026-10-19T08:00:00.000Z",
            reviewedOn: "2026-10-19",
            cardId: "metoprolol",
            quality: 2,
          },
          {
            reviewedAt: "2026-10-19T09:00:00.000Z",
            reviewedOn: "2026-10-19",
            cardId: "aspirin",
            quality: 0,
          },
        ],
      },
      new Date("2026-10-20T00:00:00.000Z"),
    );

    const payload = JSON.parse(jsonText);
    const first = await importLearningDataset(payload, { db, validCardIds });
    assert.deepEqual(first, {
      kind: "reviews",
      total: 3,
      inserted: 3,
      updated: 0,
      skipped: 0,
    });

    const expectedMeto = scheduleNext(scheduleNext(INITIAL_STATE, 2), 2);
    const metoLog = db
      .prepare("SELECT * FROM review_log WHERE card_id = 'metoprolol'")
      .get();
    assert.equal(metoLog.repetitions, expectedMeto.repetitions);
    assert.equal(metoLog.interval_days, expectedMeto.intervalDays);
    assert.ok(Math.abs(metoLog.easiness - expectedMeto.easiness) < 1e-9);

    const aspLog = db
      .prepare("SELECT * FROM review_log WHERE card_id = 'aspirin'")
      .get();
    assert.equal(aspLog.repetitions, 0);
    assert.equal(aspLog.interval_days, 1);

    const second = await importLearningDataset(payload, { db, validCardIds });
    assert.deepEqual(second, {
      kind: "reviews",
      total: 3,
      inserted: 0,
      updated: 0,
      skipped: 3,
    });
  } finally {
    db.close();
  }
});

test("quiz：支持导出 JSON（含 kindLabel）往返导入与去重", async () => {
  const db = createTempDb();
  try {
    const jsonText = datasetToJson(
      {
        kind: "quiz",
        columns: [
          { key: "answeredAt", header: "答题时刻" },
          { key: "answeredOn", header: "答题日期" },
          { key: "questionId", header: "题目ID" },
          { key: "cardId", header: "卡片ID" },
          { key: "kindLabel", header: "题型" },
          { key: "isCorrect", header: "是否正确(布尔)" },
        ],
        records: [
          {
            answeredAt: "2026-10-19T10:00:00.000Z",
            answeredOn: "2026-10-19",
            questionId: "metoprolol:target",
            cardId: "metoprolol",
            kindLabel: "作用靶点",
            isCorrect: true,
          },
          {
            answeredAt: "2026-10-19T10:05:00.000Z",
            answeredOn: "2026-10-19",
            questionId: "aspirin:indication",
            cardId: "aspirin",
            kindLabel: "适应症",
            isCorrect: false,
          },
        ],
      },
      new Date("2026-10-20T00:00:00.000Z"),
    );

    const payload = JSON.parse(jsonText);
    const first = await importLearningDataset(payload, { db, validCardIds });
    assert.deepEqual(first, {
      kind: "quiz",
      total: 2,
      inserted: 2,
      updated: 0,
      skipped: 0,
    });

    const rows = db
      .prepare("SELECT question_id, kind, is_correct FROM quiz_attempt ORDER BY id ASC")
      .all();
    assert.equal(rows.length, 2);
    assert.equal(rows[0].kind, "target");
    assert.equal(rows[0].is_correct, 1);
    assert.equal(rows[1].kind, "indication");
    assert.equal(rows[1].is_correct, 0);

    const second = await importLearningDataset(payload, { db, validCardIds });
    assert.deepEqual(second, {
      kind: "quiz",
      total: 2,
      inserted: 0,
      updated: 0,
      skipped: 2,
    });
  } finally {
    db.close();
  }
});

test("wrong-book：支持导入合并最大错误次数与最新时间且保持幂等", async () => {
  const db = createTempDb();
  try {
    const initialJson = datasetToJson(
      {
        kind: "wrong-book",
        columns: [
          { key: "questionId", header: "题目ID" },
          { key: "cardId", header: "卡片ID" },
          { key: "kindLabel", header: "题型" },
          { key: "wrongCount", header: "错误次数" },
          { key: "lastWrongAt", header: "最近答错时刻" },
          { key: "lastCorrectAt", header: "最近答对时刻" },
        ],
        records: [
          {
            questionId: "aspirin:indication",
            cardId: "aspirin",
            kindLabel: "适应症",
            wrongCount: 2,
            lastWrongAt: "2026-10-19T10:00:00.000Z",
            lastCorrectAt: "",
          },
        ],
      },
      new Date("2026-10-20T00:00:00.000Z"),
    );

    const first = await importLearningDataset(JSON.parse(initialJson), {
      db,
      validCardIds,
    });
    assert.deepEqual(first, {
      kind: "wrong-book",
      total: 1,
      inserted: 1,
      updated: 0,
      skipped: 0,
    });

    // 幂等重导
    const repeat = await importLearningDataset(JSON.parse(initialJson), {
      db,
      validCardIds,
    });
    assert.deepEqual(repeat, {
      kind: "wrong-book",
      total: 1,
      inserted: 0,
      updated: 0,
      skipped: 1,
    });

    // 合并更新更大的错误次数与答对时间
    const mergePayload = {
      kind: "wrong-book",
      records: [
        {
          questionId: "aspirin:indication",
          cardId: "aspirin",
          kind: "indication",
          wrongCount: 4,
          lastWrongAt: "2026-10-18T10:00:00.000Z",
          lastCorrectAt: "2026-10-20T12:00:00.000Z",
        },
      ],
    };

    const merged = await importLearningDataset(mergePayload, {
      db,
      validCardIds,
    });
    assert.deepEqual(merged, {
      kind: "wrong-book",
      total: 1,
      inserted: 0,
      updated: 1,
      skipped: 0,
    });

    const row = db
      .prepare("SELECT * FROM wrong_question WHERE question_id = 'aspirin:indication'")
      .get();
    assert.equal(row.wrong_count, 4);
    assert.equal(row.last_wrong_at, "2026-10-19T10:00:00.000Z");
    assert.equal(row.last_correct_at, "2026-10-20T12:00:00.000Z");
  } finally {
    db.close();
  }
});

test("校验拦截：拒绝未知 kind、未知 cardId、非法日期与非法评分", async () => {
  const db = createTempDb();
  try {
    await assert.rejects(
      () => importLearningDataset(null, { db, validCardIds }),
      ImportValidationError,
    );

    await assert.rejects(
      () =>
        importLearningDataset(
          { kind: "unknown-kind", records: [] },
          { db, validCardIds },
        ),
      ImportValidationError,
    );

    await assert.rejects(
      () =>
        importLearningDataset(
          {
            kind: "favorites",
            records: [
              { cardId: "nonexistent-drug-id", createdAt: "2026-10-19T00:00:00.000Z" },
            ],
          },
          { db, validCardIds },
        ),
      ImportValidationError,
    );

    await assert.rejects(
      () =>
        importLearningDataset(
          {
            kind: "reviews",
            records: [
              {
                cardId: "metoprolol",
                quality: 5,
                reviewedAt: "2026-10-19T00:00:00.000Z",
              },
            ],
          },
          { db, validCardIds },
        ),
      ImportValidationError,
    );

    await assert.rejects(
      () =>
        importLearningDataset(
          {
            kind: "reviews",
            records: [
              {
                cardId: "metoprolol",
                quality: 2,
                reviewedOn: "2026-02-30",
              },
            ],
          },
          { db, validCardIds },
        ),
      ImportValidationError,
    );
  } finally {
    db.close();
  }
});


test("真实测验 JSON 往返保留选项、流水 ID 和同一时刻的多次答题", async () => {
  const dir = mkdtempSync(join(tmpdir(), "pharmahub-quiz-backup-"));
  tempDirs.push(dir);
  const previousPath = process.env.PHARMAHUB_DB_PATH;
  process.env.PHARMAHUB_DB_PATH = join(dir, "upgraded.db");
  const oldDb = new Database(process.env.PHARMAHUB_DB_PATH);
  oldDb.exec(SCHEMA.replace("  attempt_id  TEXT UNIQUE,", ""));
  const stamp = "2026-10-19T10:00:00.000Z";
  const insert = oldDb.prepare(`INSERT INTO quiz_attempt
    (question_id, card_id, kind, selected_id, correct_id, is_correct, answered_on, answered_at)
    VALUES ('aspirin:target','aspirin','target',?,'right',?,'2026-10-19',?)`);
  for (const option of ["wrong-1", "wrong-1", "wrong-2", "right"]) insert.run(option, Number(option === "right"), stamp);
  oldDb.close();
  const { buildExport } = await import("../lib/export/build.ts");
  const { closeDatabase } = await import("../lib/db/sqlite.ts");
  const destination = createTempDb();
  const oldDestination = createTempDb();
  try {
    const payload = JSON.parse((await buildExport("quiz", "json", new Date(stamp))).content);
    assert.deepEqual(payload.records.map(r => r.isCorrect), [false, false, false, true]);
    assert.equal(new Set(payload.records.map(r => r.attemptId)).size, 4);
    assert.deepEqual(payload.records.map(r => [r.kind, r.correctId, r.selectedId]), [
      ["target", "right", "wrong-1"], ["target", "right", "wrong-1"], ["target", "right", "wrong-2"], ["target", "right", "right"],
    ]);
    assert.equal((await importLearningDataset(payload)).skipped, 4);
    assert.equal((await importLearningDataset(payload, { db: destination, validCardIds })).inserted, 4);
    assert.equal((await importLearningDataset(payload, { db: destination, validCardIds })).skipped, 4);
    assert.deepEqual(destination.prepare("SELECT attempt_id, kind, selected_id, correct_id FROM quiz_attempt ORDER BY id").all(),
      payload.records.map(r => ({ attempt_id: r.attemptId, kind: r.kind, selected_id: r.selectedId, correct_id: r.correctId })));
    const legacy = { ...payload, records: payload.records.map(({ attemptId, selectedId, correctId, kind, ...row }) => row) };
    assert.equal((await importLearningDataset(legacy)).skipped, 4);
    assert.equal((await importLearningDataset(legacy, { db: oldDestination, validCardIds })).inserted, 4);
    assert.equal((await importLearningDataset(legacy, { db: oldDestination, validCardIds })).skipped, 4);
    assert.equal((await importLearningDataset(payload, { db: oldDestination, validCardIds })).updated, 4);
    assert.equal((await importLearningDataset(payload, { db: oldDestination, validCardIds })).skipped, 4);
    assert.equal((await importLearningDataset(legacy, { db: oldDestination, validCardIds })).skipped, 4);
  } finally {
    closeDatabase();
    destination.close();
    oldDestination.close();
    if (previousPath === undefined) delete process.env.PHARMAHUB_DB_PATH;
    else process.env.PHARMAHUB_DB_PATH = previousPath;
  }
});
