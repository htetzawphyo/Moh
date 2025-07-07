CREATE TABLE `budget` (
	`budget_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total_budget` real NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `category` (
	`category_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_unique` ON `category` (`name`);--> statement-breakpoint
CREATE TABLE `expense` (
	`expense_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_budget_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`amount` real NOT NULL,
	`expense_date` text NOT NULL,
	FOREIGN KEY (`user_budget_id`) REFERENCES `user_budget`(`user_budget_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_budget` (
	`user_budget_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_id` integer NOT NULL,
	`total_remaining_budget` real NOT NULL,
	`daily_budget` real NOT NULL,
	`spent_today` real DEFAULT 0 NOT NULL,
	`remaining_daily_budget` real NOT NULL,
	FOREIGN KEY (`budget_id`) REFERENCES `budget`(`budget_id`) ON UPDATE no action ON DELETE no action
);
