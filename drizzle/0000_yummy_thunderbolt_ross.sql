CREATE TABLE `budget_limits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`is_budget_limit_enabled` integer DEFAULT false,
	`total_budget_limit_amount` real,
	`daily_budget_limit_amount` real,
	`show_alert_on_phone_system` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `budget` (
	`budget_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total_budget` real NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`is_active` integer DEFAULT 0 NOT NULL
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
	`title` text NOT NULL,
	`category_id` integer NOT NULL,
	`amount` real NOT NULL,
	`expense_date` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action
);
