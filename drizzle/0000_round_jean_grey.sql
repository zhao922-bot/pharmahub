CREATE TABLE `favorite` (
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`created_at` text NOT NULL,
	`enabled` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`user_id`, `card_id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`card_id` text NOT NULL,
	`kind` text NOT NULL,
	`selected_id` text NOT NULL,
	`correct_id` text NOT NULL,
	`is_correct` integer NOT NULL,
	`answered_on` text NOT NULL,
	`answered_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quiz_user_date` ON `quiz_attempt` (`user_id`,`answered_on`);--> statement-breakpoint
CREATE TABLE `review_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`quality` integer NOT NULL,
	`reviewed_on` text NOT NULL,
	`reviewed_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `history_user_date` ON `review_history` (`user_id`,`reviewed_on`);--> statement-breakpoint
CREATE INDEX `history_user_card` ON `review_history` (`user_id`,`card_id`);--> statement-breakpoint
CREATE TABLE `review_log` (
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`quality` integer NOT NULL,
	`repetitions` integer NOT NULL,
	`easiness` real NOT NULL,
	`interval_days` integer NOT NULL,
	`next_review_at` text NOT NULL,
	`last_reviewed_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`operation_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `card_id`)
);
--> statement-breakpoint
CREATE INDEX `review_due_user` ON `review_log` (`user_id`,`next_review_at`);--> statement-breakpoint
CREATE TABLE `wrong_question` (
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`card_id` text NOT NULL,
	`kind` text NOT NULL,
	`wrong_count` integer DEFAULT 1 NOT NULL,
	`last_wrong_at` text NOT NULL,
	`last_correct_at` text,
	PRIMARY KEY(`user_id`, `question_id`)
);
