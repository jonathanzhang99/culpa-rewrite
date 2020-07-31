CREATE TABLE `department` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`department_id`)
);

CREATE TABLE `course` (
  `course_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `department_id` INT NOT NULL,
  `call_number` VARCHAR(15) NULL,
  PRIMARY KEY (`course_id`),
  CONSTRAINT `fk_course__department` FOREIGN KEY (`department_id`)
    REFERENCES `department` (`department_id`)
);

CREATE TABLE `professor` (
  `professor_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `uni` VARCHAR(15) NULL,
  PRIMARY KEY (`professor_id`)
);

CREATE TABLE `department_professor`(
  `professor_id` INT NOT NULL,
  `department_id` INT NOT NULL,
  CONSTRAINT `fk_department_professor__professor` FOREIGN KEY (`professor_id`)
    REFERENCES `professor` (`professor_id`),
  CONSTRAINT `fk_department_professor__department` FOREIGN KEY (`department_id`)
    REFERENCES `department` (`department_id`)
);

CREATE TABLE `course_professor` (
  `course_professor_id` INT NOT NULL AUTO_INCREMENT,
  `professor_id` INT NULL,
  `course_id` INT NULL,
  `year` YEAR NULL,
  `semester` INT NULL,
  PRIMARY KEY (`course_professor_id`),
  CONSTRAINT `fk_course_professor__professor` FOREIGN KEY(`professor_id`)
    REFERENCES `professor` (`professor_id`),
  CONSTRAINT `fk_course_professor__course` FOREIGN KEY (`course_id`)
    REFERENCES `course` (`course_id`)
);

CREATE TABLE `review` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `course_professor_id` INT NOT NULL,
  `content` TEXT NULL,
  `workload` TEXT NULL,
  `rating` INT NULL,
  `submission_date` DATETIME NOT NULL,
  PRIMARY KEY (`review_id`),
  CONSTRAINT `fk_review__professor` FOREIGN KEY (`professor_id`)
    REFERENCES `professor` (`professor_id`),
  CONSTRAINT `fk_review__course_professor` FOREIGN KEY (`course_professor_id`)
    REFERENCES `course_professor` (`course_professor_id`)
);

CREATE TABLE `vote` (
  `review_id` INT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `ip` VARCHAR(15) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '2020-07-01 00:00:00',
  `is_agreed` BOOLEAN DEFAULT NULL,
  `is_funny` BOOLEAN DEFAULT NULL,
  CONSTRAINT `fk_vote__review` FOREIGN KEY (`review_id`)
    REFERENCES `review`(`review_id`)
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
  CONSTRAINT `fk_flag__review` FOREIGN KEY (`review_id`)
    REFERENCES `review` (`review_id`),
  CONSTRAINT `fk_flag__user` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
);

CREATE TABLE `badge` (
  `badge_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`badge_id`)
);

CREATE TABLE `badge_professor` (
  `professor_id` INT NOT NULL,
  `badge_id` INT NOT NULL,
  CONSTRAINT `fk_department_professor__professor` FOREIGN KEY (`professor_id`)
    REFERENCES `professor` (`professor_id`),
  CONSTRAINT `fk_badge_professor__badge` FOREIGN KEY (`badge_id`)
    REFERENCES `badge` (`badge_id`)
);