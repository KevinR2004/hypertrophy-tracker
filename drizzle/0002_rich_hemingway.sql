CREATE TABLE `meals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` timestamp NOT NULL,
	`mealType` enum('desayuno','snack1','almuerzo','snack2','pre_entrenamiento','post_entrenamiento','cena') NOT NULL,
	`description` text NOT NULL,
	`protein` int NOT NULL,
	`carbs` int NOT NULL,
	`fats` int NOT NULL,
	`calories` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `meals` ADD CONSTRAINT `meals_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;