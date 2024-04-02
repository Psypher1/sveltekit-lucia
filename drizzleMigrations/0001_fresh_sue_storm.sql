CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`event_date` text NOT NULL,
	`tickets` integer NOT NULL
);
