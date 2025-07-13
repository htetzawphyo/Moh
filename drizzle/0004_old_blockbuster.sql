PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_budget` (
	`budget_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total_budget` real NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`is_active` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_budget`("budget_id", "total_budget", "start_date", "end_date", "is_active") SELECT "budget_id", "total_budget", "start_date", "end_date", "is_active" FROM `budget`;--> statement-breakpoint
DROP TABLE `budget`;--> statement-breakpoint
ALTER TABLE `__new_budget` RENAME TO `budget`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `user_budget` ADD `is_active` integer DEFAULT 0 NOT NULL;