CREATE TABLE `user_budget` (
	`user_budget_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_id` integer NOT NULL,
	`is_active` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`budget_id`) REFERENCES `budget`(`budget_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expense` (
	`expense_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_budget_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`amount` real NOT NULL,
	`expense_date` text NOT NULL,
	FOREIGN KEY (`user_budget_id`) REFERENCES `user_budget`(`user_budget_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expense`("expense_id", "user_budget_id", "category_id", "amount", "expense_date") SELECT "expense_id", "user_budget_id", "category_id", "amount", "expense_date" FROM `expense`;--> statement-breakpoint
DROP TABLE `expense`;--> statement-breakpoint
ALTER TABLE `__new_expense` RENAME TO `expense`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_today_expense` (
	`today_expense_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_budget_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`amount` real NOT NULL,
	`expense_date` text NOT NULL,
	FOREIGN KEY (`user_budget_id`) REFERENCES `user_budget`(`user_budget_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_today_expense`("today_expense_id", "user_budget_id", "category_id", "amount", "expense_date") SELECT "today_expense_id", "user_budget_id", "category_id", "amount", "expense_date" FROM `today_expense`;--> statement-breakpoint
DROP TABLE `today_expense`;--> statement-breakpoint
ALTER TABLE `__new_today_expense` RENAME TO `today_expense`;