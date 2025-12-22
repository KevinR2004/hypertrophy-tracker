CREATE TABLE `vacation_workout_days` (
`id` int AUTO_INCREMENT NOT NULL,
`day_number` int NOT NULL,
`day_name` varchar(100) NOT NULL,
`focus` text NOT NULL,
`difficulty` enum('fácil','moderado','difícil') NOT NULL DEFAULT 'moderado',
`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT `vacation_workout_days_id` PRIMARY KEY(`id`)
);

CREATE TABLE `vacation_exercises` (
`id` int AUTO_INCREMENT NOT NULL,
`vacation_day_id` int NOT NULL,
`order_index` int NOT NULL,
`name` varchar(200) NOT NULL,
`sets` int NOT NULL,
`reps` varchar(50) NOT NULL,
`rir` varchar(20) NOT NULL,
`notes` text,
`equipment` varchar(100),
`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT `vacation_exercises_id` PRIMARY KEY(`id`)
);
