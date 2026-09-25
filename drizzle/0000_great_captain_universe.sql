CREATE TABLE `AdminUser` (
	`id` varchar(191) NOT NULL,
	`username` varchar(191) NOT NULL,
	`passwordHash` text NOT NULL,
	`role` varchar(191) NOT NULL DEFAULT 'admin',
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `AdminUser_id` PRIMARY KEY(`id`),
	CONSTRAINT `AdminUser_username_key` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `Category` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `Category_id` PRIMARY KEY(`id`),
	CONSTRAINT `Category_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `OrderItem` (
	`id` varchar(191) NOT NULL,
	`orderId` varchar(191) NOT NULL,
	`productId` varchar(191) NOT NULL,
	`productName` varchar(191) NOT NULL,
	`price` int NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `OrderItem_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Order` (
	`id` varchar(191) NOT NULL,
	`customerName` varchar(191) NOT NULL,
	`phone` varchar(191) NOT NULL,
	`address` text NOT NULL,
	`note` text,
	`total` int NOT NULL,
	`status` varchar(191) NOT NULL DEFAULT 'baru',
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Product` (
	`id` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`category` varchar(191) NOT NULL,
	`price` int NOT NULL,
	`originalPrice` int,
	`stock` int NOT NULL DEFAULT 0,
	`unit` varchar(191) NOT NULL,
	`rating` double NOT NULL DEFAULT 0,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`features` json NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `Product_id` PRIMARY KEY(`id`),
	CONSTRAINT `Product_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `SiteSetting` (
	`id` varchar(191) NOT NULL,
	`key` varchar(191) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `SiteSetting_id` PRIMARY KEY(`id`),
	CONSTRAINT `SiteSetting_key_key` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE INDEX `OrderItem_orderId_idx` ON `OrderItem` (`orderId`);--> statement-breakpoint
CREATE INDEX `OrderItem_productId_idx` ON `OrderItem` (`productId`);