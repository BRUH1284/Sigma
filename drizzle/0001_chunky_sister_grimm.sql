CREATE TABLE `activity_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activity_code` integer NOT NULL,
	`duration_m` integer NOT NULL,
	`time` integer NOT NULL,
	`last_modified` integer NOT NULL,
	`sync_status` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`duration_m`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`major_heading` text NOT NULL,
	`description` text NOT NULL,
	`met_value` real NOT NULL,
	`last_modified` integer NOT NULL,
	`sync_status` integer DEFAULT 0 NOT NULL
);
