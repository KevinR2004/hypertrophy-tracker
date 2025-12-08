CREATE TABLE `exercise_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`exercise_id` int NOT NULL,
	`set_number` int NOT NULL,
	`reps` int NOT NULL,
	`weight` int NOT NULL,
	`rir` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercise_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workout_day_id` int NOT NULL,
	`order_index` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`sets` int NOT NULL,
	`reps` varchar(50) NOT NULL,
	`rir` varchar(20) NOT NULL,
	`notes` text,
	`is_superset` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workout_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`day_number` int NOT NULL,
	`day_name` varchar(100) NOT NULL,
	`focus` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workout_days_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workout_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`workout_day_id` int NOT NULL,
	`session_date` timestamp NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workout_sessions_id` PRIMARY KEY(`id`)
);
