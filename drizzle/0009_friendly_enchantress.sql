CREATE TABLE `budget_limits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`is_budget_limit_enabled` integer DEFAULT false,
	`total_budget_limit_amount` real,
	`daily_budget_limit_amount` real,
	`show_alert_on_phone_system` integer DEFAULT false
);
