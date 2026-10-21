import { index, integer, primaryKey, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reviewLog = sqliteTable("review_log", {
  userId: text("user_id").notNull(), cardId: text("card_id").notNull(),
  quality: integer("quality").notNull(), repetitions: integer("repetitions").notNull(),
  easiness: real("easiness").notNull(), intervalDays: integer("interval_days").notNull(),
  nextReviewAt: text("next_review_at").notNull(), lastReviewedAt: text("last_reviewed_at").notNull(),
  updatedAt: text("updated_at").notNull(), version: integer("version").notNull().default(0),
  operationId: text("operation_id").notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.cardId] }), index("review_due_user").on(table.userId, table.nextReviewAt)]);

export const reviewHistory = sqliteTable("review_history", {
  id: integer("id").primaryKey({ autoIncrement: true }), userId: text("user_id").notNull(),
  cardId: text("card_id").notNull(), quality: integer("quality").notNull(),
  reviewedOn: text("reviewed_on").notNull(), reviewedAt: text("reviewed_at").notNull(),
}, (table) => [index("history_user_date").on(table.userId, table.reviewedOn), index("history_user_card").on(table.userId, table.cardId)]);

export const favorite = sqliteTable("favorite", {
  userId: text("user_id").notNull(), cardId: text("card_id").notNull(),
  createdAt: text("created_at").notNull(), enabled: integer("enabled").notNull().default(1),
}, (table) => [primaryKey({ columns: [table.userId, table.cardId] })]);

export const quizAttempt = sqliteTable("quiz_attempt", {
  id: integer("id").primaryKey({ autoIncrement: true }), userId: text("user_id").notNull(),
  questionId: text("question_id").notNull(), cardId: text("card_id").notNull(), kind: text("kind").notNull(),
  selectedId: text("selected_id").notNull(), correctId: text("correct_id").notNull(),
  isCorrect: integer("is_correct").notNull(), answeredOn: text("answered_on").notNull(), answeredAt: text("answered_at").notNull(),
}, (table) => [index("quiz_user_date").on(table.userId, table.answeredOn)]);

export const wrongQuestion = sqliteTable("wrong_question", {
  userId: text("user_id").notNull(), questionId: text("question_id").notNull(),
  cardId: text("card_id").notNull(), kind: text("kind").notNull(), wrongCount: integer("wrong_count").notNull().default(1),
  lastWrongAt: text("last_wrong_at").notNull(), lastCorrectAt: text("last_correct_at"),
}, (table) => [primaryKey({ columns: [table.userId, table.questionId] })]);
