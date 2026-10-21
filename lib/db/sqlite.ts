import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * SQLite 连接管理。
 *
 * 这个文件是**整个项目里唯一直接依赖 Node.js 与 better-sqlite3 的地方**。
 * 页面、组件、其他数据层都不 import 它，只通过 lib/data/study.ts 的接口访问。
 * 将来部署到 Cloudflare 时，替换的只是这一层（改用 D1 或纯客户端存储）。
 */

/** 数据库文件位置。生产环境建议通过环境变量指定到持久化磁盘 */
const DB_PATH = process.env.PHARMAHUB_DB_PATH ?? join(process.cwd(), "data", "pharmahub.db");

let db: Database.Database | null = null;

/** 建表语句。使用 IF NOT EXISTS，可重复执行 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS review_log (
  card_id         TEXT PRIMARY KEY,
  repetitions     INTEGER NOT NULL DEFAULT 0,
  easiness        REAL    NOT NULL DEFAULT 2.5,
  interval_days   INTEGER NOT NULL DEFAULT 0,
  next_review_at  TEXT    NOT NULL,
  last_reviewed_at TEXT   NOT NULL,
  updated_at      TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS review_history (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id         TEXT    NOT NULL,
  quality         INTEGER NOT NULL,
  reviewed_on     TEXT    NOT NULL,
  reviewed_at     TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_history_reviewed_on ON review_history(reviewed_on);
CREATE INDEX IF NOT EXISTS idx_history_card ON review_history(card_id);
CREATE INDEX IF NOT EXISTS idx_review_due ON review_log(next_review_at);

CREATE TABLE IF NOT EXISTS favorite (
  card_id    TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);

-- 测验答题记录。每次答题一行，用于统计正确率与错题本
CREATE TABLE IF NOT EXISTS quiz_attempt (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id   TEXT    NOT NULL,
  card_id       TEXT    NOT NULL,
  kind          TEXT    NOT NULL,
  selected_id   TEXT    NOT NULL,
  correct_id    TEXT    NOT NULL,
  is_correct    INTEGER NOT NULL,
  answered_on   TEXT    NOT NULL,
  answered_at   TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempt_on ON quiz_attempt(answered_on);
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_card ON quiz_attempt(card_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_question ON quiz_attempt(question_id);

-- 错题本。按题目聚合，记录错误次数；答对后仍保留，便于反复巩固
CREATE TABLE IF NOT EXISTS wrong_question (
  question_id   TEXT PRIMARY KEY,
  card_id       TEXT    NOT NULL,
  kind          TEXT    NOT NULL,
  wrong_count   INTEGER NOT NULL DEFAULT 1,
  last_wrong_at TEXT    NOT NULL,
  last_correct_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_wrong_card ON wrong_question(card_id);
`;

/** 获取（并缓存）数据库连接，首次调用时建表 */
export function getDatabase(): Database.Database {
  if (db) return db;

  // 确保 data 目录存在；数据库文件不存在时 better-sqlite3 会自动创建
  mkdirSync(dirname(DB_PATH), { recursive: true });

  const connection = new Database(DB_PATH);
  // WAL 模式提升并发读性能，也是 SQLite 官方推荐设置
  connection.pragma("journal_mode = WAL");
  connection.pragma("foreign_keys = ON");
  connection.exec(SCHEMA);

  db = connection;
  return db;
}

/** 仅测试使用：关闭连接并清空缓存 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
