CREATE TABLE `departments` (
  `departments_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`departments_id`)
);

CREATE TABLE `announcements` (
  `announcements_id` INT NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8,
  PRIMARY KEY (`announcements_id`)
);

CREATE TABLE `courses` (
  `courses_id` INT NOT NULL AUTO_INCREMENT,
  `course_name` VARCHAR(255) NOT NULL,
  `departments_id` INT NOT NULL,
  PRIMARY KEY (`courses_id`),
  FOREIGN KEY (`departments_id`) REFERENCES `departments`(`departments_id`)
);

CREATE TABLE `course_instance` (
  `instance_id` INT NOT NULL AUTO_INCREMENT,
  `year` YEAR(4) NULL,
  `semester` INT NULL,
  `courses_id` INT NULL,
  PRIMARY KEY (`instance_id`),
  FOREIGN KEY(`courses_id`) REFERENCES `courses` (`courses_id`)
);

CREATE TABLE `professors` (
  `professors_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  PRIMARY KEY (`professors_id`)
);

CREATE TABLE `professors_courses` (
  `professors_id` INT NOT NULL,
  `instance_id` INT NOT NULL,
FOREIGN KEY (`instance_id`) REFERENCES `course_instance` (`instance_id`),
FOREIGN KEY (`professors_id`) REFERENCES `professors` (`professors_id`)
);


CREATE TABLE `departments_professors`(
  `professors_id` INT NOT NULL,
  `departments_id` INT NOT NULL,
FOREIGN KEY (`professors_id`) REFERENCES `professors` (`professors_id`),
FOREIGN KEY (`departments_id`) REFERENCES `departments` (`departments_id`)
);


CREATE TABLE `review` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `instance_id` INT NOT NULL,
  `review_content` TEXT NULL,
  `review_rating` INT NULL,
  `submission_date` DATETIME NOT NULL,
  `professor_id` INT NOT NULL,
  PRIMARY KEY (`review_id`),
FOREIGN KEY (`instance_id`) REFERENCES `course_instance` (`instance_id`),
FOREIGN KEY (`professor_id`) REFERENCES `professors` (`professors_id`)
);


CREATE TABLE `votes` (
  `review_id` INT NOT NULL,
  `vote_type` VARCHAR(255) NOT NULL,
FOREIGN KEY (`review_id`) REFERENCES `review`(`review_id`)
);

CREATE TABLE `users` (
  `users_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `privileges` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`users_id`)
);

CREATE TABLE `flags` (
  `review_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `flag_type` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL,
  `modified_at` DATETIME NOT NULL,
FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`),
FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`)
);
