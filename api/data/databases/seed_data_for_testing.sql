-- MySQL dump 10.13  Distrib 8.0.17, for macos10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: culpa_rewrite
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `badge`
--

DROP TABLE IF EXISTS `badge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badge` (
  `badge_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`badge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badge`
--

LOCK TABLES `badge` WRITE;
/*!40000 ALTER TABLE `badge` DISABLE KEYS */;
/*!40000 ALTER TABLE `badge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `badge_professor`
--

DROP TABLE IF EXISTS `badge_professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badge_professor` (
  `professor_id` int(11) NOT NULL,
  `badge_id` int(11) NOT NULL,
  KEY `fk_department_professor__professor` (`professor_id`),
  KEY `fk_badge_professor__badge` (`badge_id`),
  CONSTRAINT `fk_badge_professor__badge` FOREIGN KEY (`badge_id`) REFERENCES `badge` (`badge_id`),
  CONSTRAINT `fk_department_professor__professor` FOREIGN KEY (`professor_id`) REFERENCES `professor` (`professor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badge_professor`
--

LOCK TABLES `badge_professor` WRITE;
/*!40000 ALTER TABLE `badge_professor` DISABLE KEYS */;
/*!40000 ALTER TABLE `badge_professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `department_id` int(11) NOT NULL,
  `call_number` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Accounting I: Financial Accoun',1,'ACCT 5001'),(2,'Financial Statement Analysis',1,'ACCT 7009'),(3,'Corporate Transactions and Fin',1,'ACCT 8019'),(4,'Sovereign Risk Assessments',1,'ACCT 8024'),(5,'Applied Fundamental Analysis with Altern',1,'ACCT 8026'),(6,'(PhD) Valuation and Financial',1,'ACCT 9010'),(7,'(PhD) Accounting & Information',1,'ACCT 9014'),(8,'Private Equity and Venture Cap',1,'ACCT 5902'),(9,'Financial Analysis of Mergers',1,'ACCT 5917'),(10,'Managerial Accounting & Decision Making',1,'ACCT 5983'),(11,'Financial Planning & Analysis',1,'ACCT 8009'),(12,'INTRO TO LIFE INSURANCE',2,'ACTU 5030'),(13,'FINANCIAL MARKETS AND MANAGEMENT FOR INS',2,'ACTU 5580'),(14,'INVESTMENT & ALM FOR ACTUARIES',2,'ACTU 5621'),(15,'ACTUARIAL METHODS I',2,'ACTU 5821'),(16,'ACTUARIAL METHODS II',2,'ACTU 5822'),(17,'MODELS FOR FINANCE & ECONOMICS',2,'ACTU 5830'),(18,'PREDICTIVE MODELING IN FINANCE & INSURAN',2,'ACTU 5840'),(19,'DATA SCIENCE IN FINANCE AND INSURANCE',2,'ACTU 5841'),(20,'GLOBAL CAPITAL MARKET & INVESTMENT',2,'ACTU 5843'),(21,'QUANTITATIVE RISK MANAGEMENT',2,'ACTU 5846'),(22,'RISK MANAGEMENT IN P&C INSURANCE',2,'ACTU 5848'),(23,'ORAL COMMUNICATIONS FOR ACTUARIAL PROFES',2,'ACTU 5850'),(24,'RETIREMENT INCOME SOLUTION',2,'ACTU 5851'),(25,'PROSEMINAR IN ACTUARIAL SCIENCE',2,'ACTU 5900'),(26,'INTERNSHIP IN ACTUARIAL SCIENCE',2,'ACTU 5995'),(27,'INTEG PROJ IN ACTU SCI',2,'ACTU 6100'),(28,'INTRO TO AFRICAN-AMER STUDIES',3,'AFAS 1001'),(29,'HEALTH INEQUALITY: MODERN US',3,'HIST 2523'),(30,'AFRICAN-AMERICAN MUSIC',3,'AFAS 3030'),(31,'AFRICAN SPIRITUAL-AMERICAS',3,'AFAS 3930-1'),(32,'BLACK WOMEN WRITERS',3,'AFAS 3930-2'),(33,'Senior Pro Seminar',3,'AFAS 3943'),(34,'The News: The Profession of Journalism',3,'SOCI 3966'),(35,'RACE AND THE UNMAKING OF AMER',3,'AFAS 4080-1'),(36,'SPIRIT QUEST-AUGUST WILSON',3,'AFAS 4080-2'),(37,'AF-AM: PRO SEMINAR',3,'AFAS 6100'),(38,'User Interface Design',29,'COMS W4170');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_professor`
--

DROP TABLE IF EXISTS `course_professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_professor` (
  `course_professor_id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`course_professor_id`),
  KEY `fk_course_professor__professor` (`professor_id`),
  KEY `fk_course_professor__course` (`course_id`),
  CONSTRAINT `fk_course_professor__course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `fk_course_professor__professor` FOREIGN KEY (`professor_id`) REFERENCES `professor` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_professor`
--

LOCK TABLES `course_professor` WRITE;
/*!40000 ALTER TABLE `course_professor` DISABLE KEYS */;
INSERT INTO `course_professor` VALUES (1,1,1),(2,2,1),(3,3,1),(4,4,2),(5,5,2),(6,6,3),(7,7,4),(8,8,6),(9,9,7),(10,10,1),(11,11,8),(12,12,2),(13,5,11),(14,14,26),(15,15,27),(16,14,27),(17,16,27),(18,17,12),(19,14,12),(20,40,38);
/*!40000 ALTER TABLE `course_professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Accounting'),(2,'Actuarial Science'),(3,'African American and African Diaspora'),(4,'Africana Studies'),(7,'American Studies'),(8,'Anesthesiology'),(9,'Anthropology'),(10,'Applied Analytics'),(11,'Applied Physics and Applied Mathematics'),(12,'Architecture'),(13,'Art History'),(14,'Art History and Archaeology'),(15,'Asian and Middle Eastern Cultures'),(16,'Astronomy'),(17,'Biochemistry and Molecular Physics'),(18,'Bioethics'),(19,'Biological Sciences'),(20,'Biomedical Engineering'),(21,'Biomedical Informatics'),(22,'Biostatistics'),(23,'Cellular, Molecular, and Biophysical Studies'),(24,'Chemical Engineering'),(25,'Chemistry'),(26,'Civil Engineering and Engineering Mechanics'),(27,'Classics'),(28,'Comparative Literature'),(29,'Computer Science'),(30,'Dance'),(31,'Dental and Oral Surgery'),(32,'Dermatology'),(33,'Earth and Environmental Engineering'),(34,'Earth and Environmental Sciences'),(35,'East Asian Languages and Cultures'),(36,'Ecology, Evolution, and Environmental Biology'),(37,'Economics'),(38,'Electrical Engineering'),(39,'English'),(40,'English and Comparative Literature'),(41,'Environmental Sciences'),(42,'Epidemiology'),(43,'Film'),(44,'French'),(45,'Genetics and Development'),(46,'German'),(47,'Germanic Languages'),(48,'Health Policy and Management'),(49,'History'),(50,'Human Capital Management'),(51,'Industrial Engineering and Operations Research'),(52,'Italian'),(53,'Latin American and Iberian Cultures'),(54,'Mathematics'),(55,'Mechanical Engineering'),(56,'Medicine'),(57,'Microbiology & Immunology'),(58,'Middle Eastern, South Asian and African Studies'),(59,'Music'),(60,'Neurological Surgery'),(61,'Neurology'),(62,'Neuroscience'),(63,'Neuroscience and Behavior'),(64,'Nursing'),(65,'Obstetrics & Gynecology'),(66,'Ophthalmology'),(67,'Orthopedic Surgery'),(68,'Otolaryngology'),(69,'Pathology and Cell Biology'),(70,'Pediatrics'),(71,'Pharmocology'),(72,'Philosophy'),(73,'Physical Education'),(74,'Physics'),(75,'Physiology and Cellular Biophysics'),(76,'Political Science'),(77,'Psychiatry'),(78,'Psychology'),(79,'Radiation Oncology'),(80,'Radiology'),(81,'Rehabilitation and Regenerative Medicine'),(82,'Religion'),(83,'Slavic Languages'),(84,'Sociology'),(85,'Sociomedical Sciences'),(86,'Spanish and Portugese'),(87,'Statistics'),(88,'Theatre'),(89,'Urban Studies'),(90,'Urology'),(91,'Visual Arts'),(92,'Women\'s and Gender Studies'),(93,'Writing');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department_professor`
--

DROP TABLE IF EXISTS `department_professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department_professor` (
  `professor_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  KEY `professor_id` (`professor_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `department_professor_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department_professor`
--

LOCK TABLES `department_professor` WRITE;
/*!40000 ALTER TABLE `department_professor` DISABLE KEYS */;
INSERT INTO `department_professor` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(22,2),(23,2),(24,2),(25,2),(26,2),(27,2);
/*!40000 ALTER TABLE `department_professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flag`
--

DROP TABLE IF EXISTS `flag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flag` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `flag_type` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `modified_at` datetime NOT NULL,
  KEY `fk_flag__review` (`review_id`),
  KEY `fk_flag__user` (`user_id`),
  CONSTRAINT `fk_flag__review` FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`),
  CONSTRAINT `fk_flag__user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flag`
--

LOCK TABLES `flag` WRITE;
/*!40000 ALTER TABLE `flag` DISABLE KEYS */;
/*!40000 ALTER TABLE `flag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor` (
  `professor_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `uni` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
INSERT INTO `professor` VALUES (1,'Amir','Ziv','az50'),(2,'Sehwa','Kim','sk4663'),(3,'Urooj','Khan','uk2117'),(4,'Robert','Stoumbos','rcs2188'),(5,'Thomas','Bourveau','tb2797'),(6,'Anne','Heinrichs',NULL),(7,'Shivaram','Rajgopal','sr3269'),(8,'Doron','Nissim','dn75'),(9,'Jonathan','Glover','jg3463'),(10,'Radha','Radhakrishna','rr2889'),(11,'Jessica','Soursourian','js4873'),(12,'Benjamin','Segal','bs2992'),(13,'Igor','Vaysman','iv2137'),(14,'Lina','Xu',NULL),(15,'Thomas','Murphy','tm2980'),(16,'Ira','Kastrinsky','ik2379'),(17,'Anne','Katcher','ak4278'),(18,'Yuhong','Xue','yx2482'),(19,'Dariush','Akhtari','da2738'),(20,'Yubo','Wang','yw2999'),(21,'Abraham','Weishaus','asw2145'),(22,'Leland','Wei','lw2887'),(23,'Gary','Venter','gv2112'),(24,'Donald','Mango','dfm2127'),(25,'James','Maher','jm4515'),(26,'Maria','McCormack','mm624'),(27,'John','Vitucci','jv2461'),(28,'Josef','Sorett','js3119'),(29,'Samuel','Roberts','skr2001'),(30,'Kevin','Fellezs','kf2362'),(31,'Charles','Dawson','cd2277'),(32,'Farah','Griffin','fjg8'),(33,'Sudhir','Venkatesh','sv185'),(34,'Steven','Gregory','sg820'),(35,'Obery','Hendricks','oh2151'),(36,'Mabel','Wilson','mow6'),(37,'Yvette','Christianse','ychristi'),(38,'Abosede','George','ageorge'),(39,'Maja','Horn','mhorn'),(40,'Lydia','Chilton','lc3251');
/*!40000 ALTER TABLE `professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_professor_id` int(11) NOT NULL,
  `content` text,
  `ip` varchar(15) DEFAULT NULL,
  `workload` text,
  `rating` int(11) DEFAULT NULL,
  `submission_date` datetime DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `fk_review__course_professor` (`course_professor_id`),
  CONSTRAINT `fk_review__course_professor` FOREIGN KEY (`course_professor_id`) REFERENCES `course_professor` (`course_professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,3,'First day of class: \'You are taking this class to learn, not to get an A. 30% of you will get a C or lower.\' I freak out. I consider dropping. I stick it out. He is a fantastic lecturer. Extremely clear. PP are very helpful. He tells you that you need to have done the reading and prepare for class because he\'s gonna cold call you, but realistically, it\'s a class of 50 students so you\'ll be fine.\nWeekly psets: They will take 3-4 hours, you can do them w a buddy, and they are graded for completion.\nMidterm: Very similar to practice test he gives (and reviews in class). If you know your stuff an A is attainable\nFinal: Harder. But if you study, it is manageable (and he gives you an option to give more weight to the test that you did better on).\nAll in all: If you want to learn Financial Accounting, there is no better teacher.',NULL,'Weekly Psets, Midterm, Final',4,'2020-06-21 04:55:38'),(2,20,'Lydia is honestly such an amazing person. Her personality really shows through her lectures--you\'ll learn about all her favorite things: Star Trek, The Office, DDR, The Knicks, what the world\'s best boarding pass looks like. Her lectures are not heavy and very easy to pay attention to since she\'s so great at talking and is just so excited! She also does a good job of guiding people through the design process, focusing your attention on the little details and potential areas of frustration. Her slides have everything you need for the material, and I often find that it\'s enough to just pay attention. She also ends class early frequently and gives a nice summary after every lecture.\n\nFrom someone with no webdev background, it would\'ve been nice if she taught some basic technical stuff i.e. JS, HTML, CSS. To be fair, webdev is hard to learn without trying it yourself, and the functions you need are often specific to what you want to implement. Our first programming hw was a static replica of the Gmail interface, which killed me as a newbie. Her written HWs are a bit subjective since she seems to have an answer in her head that she\'s looking for, and it\'s not always clear as to how much of an explanation is enough. The final project for this class is spread across 6 weeks, and she provides \'milestones\' along the way to keep you on track. She also emphasizes the importance of early feedback in the design process and allots class time for feedback exchange between peers. Overall, if you have some kind of front end experience, this class should be chill.\n\nThere is a \'participation\' component of the grade that is annoying for many, because your name has to be recorded by a TA hidden in the back of the room. Lydia likes to engage the class with short answer questions, and will call on people to speak. Your participation grade is almost entirely dependent on how well she can remember your name, and how hard the TAs try to figure out who spoke. Apparently the TAs came up with a scheme to remember where each of the three asian Kevins sat. It\'s often unfortunate for me to be one of the many shoulder length haired asian girls in the class, and it\'s a small victory on my part on those rare occasions when she gets my name. She definitely needs a better system to track participation, but if she doesn\'t establish one, I\'d advise you to dye your hair purple before taking her class.',NULL,'2 Written HWs (10%), 2 Programming HWs (20%), Participation (15%), Website Project (35%), Final (20%)',3,'2018-04-15 02:43:37'),(3,20,'The second half of the course should be called Functional User Interfaces.','204.194.187.15','Weekly assignments. Not astoundingly difficult, but the assignments become very tedious and time consuming if you haven\'t used JavaScript before.',3,'2020-02-18 05:28:39'),(4,20,'One of the most interesting professors to teach. She\'s very enthusiastic and hyper. From previous comments here, I see she\'s changed her attendance policy a bit. We submitted a google form with what we said in class or if we did not speak by a certain time after class. For the first time, participation wasn\'t as difficult as I thought it would be. She purposefully asks a range of questions from super easy ones like, \'What do you click on amazon\'s webpage to buy a book?\' while the picture is on screen to more technical questions. She does this so people will be more engaged. I\'d say that classes are fun, but I agree, technical stuff isn\'t really taught in class. I\'m glad I decided to learn html, css, and a bit of javascript the winter break before, but as the projects became more complicated with flask and python, I struggled quite a bit.','71.56.229.36','Easy at first, harder later. Weekly homework and one mandatory participation per class.',3,'2020-05-01 05:05:11');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `privileges` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vote` (
  `review_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '2020-07-01 00:00:00',
  `is_agreed` tinyint(1) DEFAULT NULL,
  `is_funny` tinyint(1) DEFAULT NULL,
  KEY `fk_vote__review` (`review_id`),
  CONSTRAINT `fk_vote__review` FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote`
--

LOCK TABLES `vote` WRITE;
/*!40000 ALTER TABLE `vote` DISABLE KEYS */;
/*!40000 ALTER TABLE `vote` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-01 22:46:31
