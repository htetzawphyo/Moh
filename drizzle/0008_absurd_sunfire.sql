DROP TABLE `today_expense`;--> statement-breakpoint
DROP TABLE `user_budget`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expense` (
	`expense_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category_id` integer NOT NULL,
	`amount` real NOT NULL,
	`expense_date` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expense`("expense_id", "title", "category_id", "amount", "expense_date") SELECT "expense_id", "title", "category_id", "amount", "expense_date" FROM `expense`;--> statement-breakpoint
DROP TABLE `expense`;--> statement-breakpoint
ALTER TABLE `__new_expense` RENAME TO `expense`;--> statement-breakpoint
PRAGMA foreign_keys=ON;