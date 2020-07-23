CREATE TABLE `department` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`department_id`)
);

CREATE TABLE `announcement` (
  `announcement_id` INT NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET UTF8MB4,
  PRIMARY KEY (`announcement_id`)
);

CREATE TABLE `course` (
  `course_id` INT NOT NULL AUTO_INCREMENT,
  `course_name` VARCHAR(255) NOT NULL,
  `department_id` INT NOT NULL,
  PRIMARY KEY (`course_id`),
  FOREIGN KEY (`department_id`) REFERENCES `department`(`department_id`)
);

CREATE TABLE `course_instance` (
  `instance_id` INT NOT NULL AUTO_INCREMENT,
  `year` YEAR NULL,
  `semester` INT NULL,
  `course_id` INT NULL,
  PRIMARY KEY (`instance_id`),
  FOREIGN KEY(`course_id`) REFERENCES `course` (`course_id`)
);

CREATE TABLE `professor` (
  `professor_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  PRIMARY KEY (`professor_id`)
);

CREATE TABLE `professor_course` (
  `professor_id` INT NOT NULL,
  `instance_id` INT NOT NULL,
FOREIGN KEY (`instance_id`) REFERENCES `course_instance` (`instance_id`),
FOREIGN KEY (`professor_id`) REFERENCES `professor` (`professor_id`)
);


CREATE TABLE `department_professor`(
  `professor_id` INT NOT NULL,
  `department_id` INT NOT NULL,
FOREIGN KEY (`professor_id`) REFERENCES `professor` (`professor_id`),
FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`)
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
FOREIGN KEY (`professor_id`) REFERENCES `professor` (`professor_id`)
);


CREATE TABLE `vote` (
  `review_id` INT NOT NULL,
  `vote_type` VARCHAR(255) NOT NULL,
FOREIGN KEY (`review_id`) REFERENCES `review`(`review_id`)
);

CREATE TABLE `user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `privileges` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `flag` (
  `review_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `flag_type` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL,
  `modified_at` DATETIME NOT NULL,
FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`),
FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);
