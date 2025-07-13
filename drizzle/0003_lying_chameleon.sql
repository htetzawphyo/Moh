CREATE TABLE `today_expense` (
	`today_expense_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_budget_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`amount` real NOT NULL,
	`expense_date` text NOT NULL,
	FOREIGN KEY (`user_budget_id`) REFERENCES `user_budget`(`user_budget_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `expense` DROP COLUMN `show_as_today`;