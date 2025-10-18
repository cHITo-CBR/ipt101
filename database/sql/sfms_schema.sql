-- phpMyAdmin SQL Dump for SFMS
-- Compatible with MySQL 8.0+

-- Create database
CREATE DATABASE IF NOT EXISTS `sfms` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sfms`;

-- --------------------------------------------------------
-- Table: courses
CREATE TABLE IF NOT EXISTS `courses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `courses_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed sample courses
INSERT INTO `courses` (`id`, `code`, `name`, `status`) VALUES
  (1,'BSIT','Information Technology','active'),
  (2,'BSCS','Computer Science','active'),
  (3,'BSBA','Business Administration','active'),
  (4,'BSA','Accountancy','active')
ON DUPLICATE KEY UPDATE `code`=VALUES(`code`);

-- --------------------------------------------------------
-- Table: departments
CREATE TABLE IF NOT EXISTS `departments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed sample departments
INSERT INTO `departments` (`id`, `code`, `name`, `status`) VALUES
  (1,'CS','Computer Science','active'),
  (2,'ENG','Engineering','active'),
  (3,'BUS','Business','active'),
  (4,'ART','Arts & Humanities','active'),
  (5,'SCI','Science','active')
ON DUPLICATE KEY UPDATE `code`=VALUES(`code`);

-- --------------------------------------------------------
-- Table: academic_years
CREATE TABLE IF NOT EXISTS `academic_years` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `label` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `academic_years_label_unique` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed sample academic years
INSERT INTO `academic_years` (`id`, `label`, `status`) VALUES
  (1,'2024-2025','active'),
  (2,'2023-2024','archived')
ON DUPLICATE KEY UPDATE `label`=VALUES(`label`);

-- --------------------------------------------------------
-- Table: students
CREATE TABLE IF NOT EXISTS `students` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_no` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `year_level` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `students_student_no_unique` (`student_no`),
  KEY `students_course_id_foreign` (`course_id`),
  CONSTRAINT `students_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed sample students
INSERT INTO `students` (`id`, `student_no`, `name`, `course_id`, `year_level`, `status`) VALUES
  (1,'S-0001','John Doe',1,3,'active'),
  (2,'S-0002','Jane Smith',2,2,'active'),
  (3,'S-0003','Amy Santiago',3,4,'active'),
  (4,'S-0004','Jake Peralta',1,1,'active')
ON DUPLICATE KEY UPDATE `student_no`=VALUES(`student_no`);

-- --------------------------------------------------------
-- Table: faculty
CREATE TABLE IF NOT EXISTS `faculty` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_no` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `department_id` BIGINT UNSIGNED NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `faculty_employee_no_unique` (`employee_no`),
  KEY `faculty_department_id_foreign` (`department_id`),
  CONSTRAINT `faculty_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed sample faculty
INSERT INTO `faculty` (`id`, `employee_no`, `name`, `department_id`, `status`) VALUES
  (1,'F-1001','Dr. Sarah Johnson',1,'active'),
  (2,'F-1002','Prof. Michael Brown',2,'active'),
  (3,'F-1003','Dr. Anna Garcia',3,'active')
ON DUPLICATE KEY UPDATE `employee_no`=VALUES(`employee_no`);

-- --------------------------------------------------------
-- Optional: users table minimal (if using login via Laravel migrations instead)
-- You can skip this; Laravel migrations will create `users` separately.

-- Notes:
-- 1) Import this file in phpMyAdmin: choose the `Import` tab and upload sfms_schema.sql.
-- 2) Or run migrations instead: php artisan migrate
