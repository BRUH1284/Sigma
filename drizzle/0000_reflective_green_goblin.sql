CREATE TABLE `activities` (
	`major_heading` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`met_value` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `activity_records` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_code` integer,
	`user_activity_id` text,
	`duration_m` real NOT NULL,
	`kcal` real NOT NULL,
	`time` integer NOT NULL,
	`sync_status` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`duration_m`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `data_versions` (
	`data_resource` integer PRIMARY KEY NOT NULL,
	`last_modified` integer,
	`checksum` text
);
--> statement-breakpoint
CREATE TABLE `user_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`major_heading` text NOT NULL,
	`description` text NOT NULL,
	`met_value` real NOT NULL,
	`sync_status` integer DEFAULT 0 NOT NULL
);
