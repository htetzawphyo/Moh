ALTER TABLE `budget_limits` ADD `vibrate_on_phone_system` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `budget_limits` DROP COLUMN `show_alert_on_phone_system`;