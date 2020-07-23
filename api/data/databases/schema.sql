CREATE TABLE `department` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `announcement` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET UTF8MB4,
  PRIMARY KEY (`id`)
);

CREATE TABLE `course` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `department_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`department_id`) REFERENCES `department`(`id`)
);

CREATE TABLE `course_instance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `year` YEAR NULL,
  `semester` INT NULL,
  `course_id` INT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY(`course_id`) REFERENCES `course` (`id`)
);

CREATE TABLE `professor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `professor_course` (
  `professor_id` INT NOT NULL,
  `instance_id` INT NOT NULL,
FOREIGN KEY (`instance_id`) REFERENCES `course_instance` (`id`),
FOREIGN KEY (`professor_id`) REFERENCES `professor` (`id`)
);


CREATE TABLE `department_professor`(
  `professor_id` INT NOT NULL,
  `department_id` INT NOT NULL,
FOREIGN KEY (`professor_id`) REFERENCES `professor` (`id`),
FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
);


CREATE TABLE `review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `instance_id` INT NOT NULL,
  `content` TEXT NULL,
  `rating` INT NULL,
  `submission_date` DATETIME NOT NULL,
  `professor_id` INT NOT NULL,
  PRIMARY KEY (`id`),
FOREIGN KEY (`instance_id`) REFERENCES `course_instance` (`id`),
FOREIGN KEY (`professor_id`) REFERENCES `professor` (`id`)
);


CREATE TABLE `vote` (
  `review_id` INT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
FOREIGN KEY (`review_id`) REFERENCES `review`(`id`)
);

CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `privileges` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `flag` (
  `review_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `flag_type` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL,
  `modified_at` DATETIME NOT NULL,
FOREIGN KEY (`review_id`) REFERENCES `review` (`id`),
FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);
