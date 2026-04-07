CREATE TABLE `positions` (
	`id` text PRIMARY KEY NOT NULL,
	`symbol` text NOT NULL,
	`quantity` real NOT NULL,
	`avg_cost` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `price_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`open` real NOT NULL,
	`high` real NOT NULL,
	`low` real NOT NULL,
	`close` real NOT NULL,
	`timestamp` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trades` (
	`id` text PRIMARY KEY NOT NULL,
	`symbol` text NOT NULL,
	`side` text NOT NULL,
	`quantity` real NOT NULL,
	`price` real NOT NULL,
	`total` real NOT NULL,
	`status` text NOT NULL,
	`executed_at` integer,
	`created_at` integer NOT NULL
);
