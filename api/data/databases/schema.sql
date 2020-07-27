CREATE TABLE `department` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`department_id`)
);

CREATE TABLE `announcement` (
  `annoucement_id` INT NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET UTF8MB4,
  PRIMARY KEY (`annoucement_id`)
);

CREATE TABLE `course` (
  `course_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `department_id` INT NOT NULL,
  PRIMARY KEY (`course_id`),
  CONSTRAINT `fk_course_department` FOREIGN KEY (`department_id`)
    REFERENCES `department` (`department_id`)
);

CREATE TABLE `professor` (
  `professor_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  PRIMARY KEY (`professor_id`)
);

CREATE TABLE `department_professor`(
  `professor_id` INT NOT NULL,
  `department_id` INT NOT NULL,
  CONSTRAINT `fk_department_professor_professor` FOREIGN KEY (`professor_id`)
  REFERENCES `professor` (`professor_id`),
  CONSTRAINT `fk_department_professor_department` FOREIGN KEY (`department_id`)
  REFERENCES `department` (`department_id`)
);

CREATE TABLE `course_instance` (
  `course_instance_id` INT NOT NULL AUTO_INCREMENT,
  `professor_id` INT NULL,
  `course_id` INT NULL,
  `year` YEAR NULL,
  `semester` INT NULL,
  PRIMARY KEY (`course_instance_id`),
  CONSTRAINT `fk_course_instance_professor` FOREIGN KEY(`professor_id`)
  REFERENCES `professor` (`professor_id`),
  CONSTRAINT `fk_course_instance_course` FOREIGN KEY (`course_id`)
  REFERENCES `course` (`course_id`)
);

CREATE TABLE `review` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `professor_id` INT NOT NULL,
  `course_instance_id` INT NOT NULL,
  `content` TEXT NULL,
  `rating` INT NULL,
  `submission_date` DATETIME NOT NULL,
  PRIMARY KEY (`review_id`),
  CONSTRAINT `fk_review_professor` FOREIGN KEY (`professor_id`)
  REFERENCES `professor` (`professor_id`),
  CONSTRAINT `fk_review_course_instance` FOREIGN KEY (`course_instance_id`)
  REFERENCES `course_instance` (`course_instance_id`)
);

CREATE TABLE `vote` (
  `review_id` INT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  CONSTRAINT `fk_vote_review` FOREIGN KEY (`review_id`)
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
  CONSTRAINT `fk_flag_review` FOREIGN KEY (`review_id`)
  REFERENCES `review` (`review_id`),
  CONSTRAINT `fk_flag_user` FOREIGN KEY (`user_id`)
  REFERENCES `user` (`user_id`)
);
