ALTER TABLE `positions` ADD `side` text NOT NULL;--> statement-breakpoint
ALTER TABLE `trades` ADD `order_type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `trades` ADD `limit_price` real;