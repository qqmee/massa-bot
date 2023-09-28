CREATE TABLE `info` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `slug` enum('CURRENT_RELEASE') COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `data` json DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_uidx` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE `user_stakers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `chatId` bigint NOT NULL,
  `botId` bigint NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `tag` varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `botId_chatId_idx` (`botId`,`chatId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE `sessions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `value` varchar(1000) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_uidx` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE VIEW `users` AS
SELECT
  json_unquote(json_extract(`s`.`key`,'$[0]')) AS `botId`,
  json_unquote(json_extract(`s`.`key`,'$[1]')) AS `userId`,
  json_unquote(json_extract(`s`.`key`,'$[2]')) AS `chatId`,
  json_unquote(json_extract(`s`.`value`,'$.__language_code')) AS `locale`,
  json_unquote(json_extract(`s`.`value`,'$.displayNodeMode')) AS `displayNodeMode`,
  if(cast(json_unquote(json_extract(`s`.`value`,'$.isBlocked')) AS json),1,0) AS `isBlocked`,
  if(cast(json_unquote(json_extract(`s`.`value`,'$.notificationsGithub')) AS json),1,0) AS `notificationsGithub`,
  if(cast(json_unquote(json_extract(`s`.`value`,'$.notificationsRolls')) AS json),1,0) AS `notificationsRolls`,
  json_unquote(json_extract(`s`.`value`,'$.createdAt')) AS `createdAt`
  FROM `sessions` `s`
