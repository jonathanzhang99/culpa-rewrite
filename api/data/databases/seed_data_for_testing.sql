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
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`)
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
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`department_id`)
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
  CONSTRAINT `department_professor_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=959 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
INSERT INTO `professor` VALUES (1,'Amir','Ziv','az50'),(2,'Sehwa','Kim','sk4663'),(3,'Urooj','Khan','uk2117'),(4,'Robert','Stoumbos','rcs2188'),(5,'Thomas','Bourveau','tb2797'),(6,'Anne','Heinrichs',NULL),(7,'Shivaram','Rajgopal','sr3269'),(8,'Doron','Nissim','dn75'),(9,'Jonathan','Glover','jg3463'),(10,'Radha','Radhakrishna','rr2889'),(11,'Jessica','Soursourian','js4873'),(12,'Benjamin','Segal','bs2992'),(13,'Igor','Vaysman','iv2137'),(14,'Lina','Xu','lx2143'),(15,'Thomas','Murphy','tm2980'),(16,'Ira','Kastrinsky','ik2379'),(17,'Anne','Katcher','ak4278'),(18,'Yuhong','Xue','yx2482'),(19,'Dariush','Akhtari','da2738'),(20,'Yubo','Wang','yw2999'),(21,'Abraham','Weishaus','asw2145'),(22,'Leland','Wei','lw2887'),(23,'Gary','Venter','gv2112'),(24,'Donald','Mango','dfm2127'),(25,'James','Maher','jm4515'),(26,'Maria','McCormack','mm624'),(27,'John','Vitucci','jv2461'),(28,'Josef','Sorett','js3119'),(29,'Samuel','Roberts','skr2001'),(30,'Kevin','Fellezs','kf2362'),(31,'Charles','Dawson','cd2277'),(32,'Farah','Griffin','fjg8'),(33,'Sudhir','Venkatesh','sv185'),(34,'Steven','Gregory','sg820'),(35,'Obery','Hendricks','oh2151'),(36,'Mabel','Wilson','mow6'),(37,'Yvette','Christianse','ychristi'),(38,'Abosede','George','ageorge'),(39,'Maja','Horn','mhorn'),(40,'Lydia','Chilton','lc3251'),(41,'Brian','Boyd','bb2305'),(42,'Grant','Son','gjs17'),(43,'Benjamin','Orlove','bso5'),(44,'Catherine','Vaughan','cv2195'),(45,'Amos','Gitai','ag4154'),(47,'Abdul','Nanji','agn6'),(48,'Zuleyha','Colak','zc2208'),(49,'Douglas','Almond','da2152'),(50,'Michael','Moore','mm5440'),(51,'Donald','Ferguson','dff9'),(52,'Khachador','Mouradian','km3253'),(53,'Allen','Blustine','amb5'),(54,'Lauren','Horst','leh2164'),(55,'Alexandra','Merceron','am4844'),(56,'Xiaoyang','Zhu','xz2324'),(57,'Charly','Coleman','cc3472'),(58,'Patricia','Dailey','pd2132'),(59,'Lisa','Dwan','ld2804'),(60,'Georgios','Sarrinikolaou','gs363'),(61,'Alexandra','Borer','ab3551'),(62,'Elisheva','Carlebach','ec607'),(63,'Jingchen','Liu','jl3260'),(64,'Gabriela','Badea','gb2369'),(65,'Birol','Emir','be2166'),(66,'Junli','Shen','js5441'),(67,'David','Lurie','dbl11'),(68,'Robert','Tortoriello','rt2652'),(69,'Eric','Wubbels','ekw2101'),(70,'Katherine','Fox-Glassman','kjt2111'),(71,'Yeon-Koo','Che','yc2271'),(72,'Navin','Kartik','nk2339'),(73,'Paul','Grimstad','pg149'),(74,'Elissa','Schappell','es3171'),(75,'Azareen','Van der Vliet Oloomi','av2934'),(76,'Seth','Cluett','sc4340'),(77,'Michael','Zwecher','mz2797'),(78,'Muneko','Oya','mwo3'),(79,'Leslie','Jamison','lsj2116'),(80,'Robert','Cook','rac174'),(81,'Matthew','Connelly','mjc96'),(82,'William','Squires','ws2234'),(83,'Haralambos','Vasiliadis','hv2202'),(84,'Camille','Robcis','car2129'),(85,'Marsha','Hurst','mh812'),(86,'Deborah','Starr','ds3105'),(87,'Lincoln','Michel','lmm2179'),(88,'Maja','Cerar','msc48'),(89,'David','Wallace','dsw2143'),(90,'Line','Lillevik','ll2529'),(91,'Lien-Hang','Nguyen','ln2358'),(92,'Paul','Beatty','pb2449'),(93,'Felice','Beneduce','fb2321'),(94,'Yasmin','Cho','yc3298'),(95,'Ira','Katznelson','iik1'),(96,'Marianne','Giordani','mg2644'),(97,'James','Murphy','jm5066'),(98,'John','Parkinson','jbp2158'),(99,'Alessandra','Casella','ac186'),(100,'Teresa','Sharpe','ts2785'),(101,'Luke','Mayville','lm3149'),(102,'Stephane','Charitos','sc758'),(103,'Kimbra','Pfahler','kp2793'),(104,'Alan','Ziegler','az8'),(105,'Gray','Tuttle','gwt2102'),(106,'Marcel','Nutz','mfn2109'),(107,'Philip','Protter','pep2117'),(108,'Souleymane','Diagne','sd2456'),(109,'Bianca','Santoro','bs3197'),(110,'Yu Yu','Khaing','yk2823'),(111,'Jose','Castellanos-Pazos','jc846'),(112,'Gustavo','Azenha','ga2161'),(113,'Casey','Blake','cb460'),(114,'Assaf','Moghadam','am3141'),(116,'Jon','Kessler','jk342'),(117,'Roni','Henig','rh2575'),(118,'Christine','Correa','cc2959'),(119,'Thai','Jones','tsj2001'),(120,'Michael','Harris','mh2836'),(121,'Thomas','Dodman','td2551'),(122,'Adela','Gondek','ajg2'),(123,'Yang','Feng','fy2158'),(124,'Gabriel','Young','gjy2107'),(125,'Matthew','Weber','mw3115'),(126,'Kevin','Holt','kch2114'),(127,'Zoe','Strother','zss1'),(128,'Mikhail','Smirnov','ms580'),(129,'Ron','Prywes','mrp6'),(130,'Shanga','Parker','sp3556'),(131,'Ioannis','Mylonopoulos','jm3193'),(132,'Wijnie','De Groot','wed23'),(133,'Gabo','Camnitzer','gc2809'),(134,'James','Bone','jb4015'),(135,'Nim','Delafield','nlt7'),(136,'Aleksandra','Chancy','ac2661'),(137,'Martha','Howell','mch4'),(138,'Stephen','Miller','smm2344'),(139,'E. Tory','Higgins','eth1'),(140,'Duncan','Menge','dm2972'),(141,'Rossano','Rossi','rr2419'),(142,'Joseph','Sevely','jls2344'),(143,'Ric','Oslin','ro2282'),(144,'Benjamin','Marcus','bm415'),(145,'Matthew','Palmer','mp2434'),(146,'Ja','Lee','jl5360'),(147,'Lauri','Harrison','lh2557'),(148,'Nataliya','Kun','nk2543'),(149,'A','Wadsworth','aww11'),(150,'Tomi','Suzuki','ts202'),(151,'Ling','Yan','ly2131'),(152,'Ralph','Holloway','rlh2'),(153,'Panos','Mourdoukoutas','pm2902'),(154,'Robert','Friedman','rdf2'),(155,'Jacquelyn','Duran','jnd2103'),(156,'Gideon','Lewis-Kraus','gl2602'),(157,'Kenneth','Jackson','ktj1'),(158,'Susan','Elmes','se5'),(159,'Michael','Parrott','mp3675'),(160,'Ronald','Neath','rcn2112'),(161,'Rym','Bettaieb','rb2555'),(162,'Perry','Beaumont','phb2120'),(163,'Thomas','Passante','tp2579'),(164,'Vesna','Gasperov','vg2231'),(165,'Yannik','Thiem','yt2682'),(166,'Andrew','Plaks','ap3606'),(167,'Barbara','Faedda','bf2187'),(168,'Elsa','Ubeda','eu2130'),(169,'Gregory','Witkowski','gw2367'),(170,'Michael','Como','mc2575'),(171,'Frederique','Baumgartner','fb214'),(172,'Anjana','Bhattacharyya','ab4967'),(173,'Ronald','Guido','rg2492'),(174,'Alisa','Knizel','ak4139'),(175,'Edward','Pasquina','efp5'),(176,'Thomas','Kalin','tk556'),(177,'Maria','Venegas','mv2704'),(178,'Joshua','Burgher','jlb2179'),(179,'Gulnar','Kendirbai','gk2020'),(180,'Jennifer','Blaze','jb4208'),(181,'David','Rios','dar27'),(182,'Hany','Guirguis','hsg2110'),(183,'Norma','Graham','nvg1'),(184,'Deborah','Mowshowitz','dbm2'),(185,'Mary Ann','Price','map2293'),(186,'Michelle','Quay','mq2213'),(187,'Tyler','Richard','tmr2151'),(188,'Ashley','Patterson','amp2237'),(189,'Susan','Suleiman','ss2960'),(190,'Matthew','Buckingham','meb2224'),(191,'Shane','McCrae','sm4432'),(192,'Nora','Jacobson','nj2356'),(193,'Giuseppina','Cambareri','gc2019'),(194,'Inbar','Klang','ik2480'),(195,'Xiaodan','Wang','xw2167'),(196,'Marcus','Folch','mf2664'),(197,'Karen','Allis','kja7'),(198,'Jane','Dodd','jd18'),(199,'Christopher','Washburne','cjw5'),(200,'Guilherme','de Oliveira','gd2271'),(201,'Anne','Bogart','adb18'),(202,'John','Dias','jd2681'),(203,'David','Hwang','dhh2115'),(204,'Yunda','Li','yl3907'),(205,'Rosalind','Morris','rcm24'),(206,'Akeel','Bilgrami','ab41'),(207,'Tyler','Rowland','tr2626'),(208,'Ramin','Bahrani','rb148'),(209,'Mark','Dean','md3405'),(210,'Hai-Long','Wang','hw21'),(211,'Gil','Anidjar','ga152'),(212,'Nikolas','Kakkoufa','nk2776'),(213,'Christakis','Droussiotis','cd3081'),(214,'Jason','Levine','jil2117'),(215,'Ian','Taylor','imt2110'),(216,'Estelle','Bauer','eb3257'),(217,'Padraig','O\'Cearuil','po2122'),(218,'Sunil','Gulati','skg21'),(219,'Said','Sayrafiezadeh','ss4433'),(220,'Galen','DeGraf','gpd2112'),(221,'Rogelio','Martinez','rm165'),(222,'William','McAllister','wm134'),(223,'Julia','Brickell','jlb130'),(224,'Marilyn','Kunstler','mck43'),(225,'Paul','Lucido','pl2451'),(226,'Marianne','Hirsch','mh2349'),(227,'Ramin','Amir Arjomand','ra112'),(228,'James','Kerr','jlk2001'),(229,'Robert','King','rk2704'),(230,'Christopher','Bollen','cmb54'),(231,'Dennis','Vitkup','dv2121'),(232,'Gerard','Parkin','gfp1'),(233,'Heidi','Holst-Knudsen','hh21'),(234,'Nikolaos','Katsimpras','nk2473'),(235,'Andres','Bendesky','ab4463'),(236,'Akash','Sengupta','aks2259'),(237,'Roy','Licklider','rl2412'),(238,'Francois','Scharffe','fs2638'),(239,'Sita','Mani','sm4466'),(240,'Christian','Schindler','cws4'),(241,'Abolfazal','Safikhani','as5012'),(242,'Carol','Rounds','chr2'),(243,'D.S.','Moynihan','dm3345'),(244,'Renzo','Silva','rs333'),(245,'Ostiane','Courau','oc2267'),(246,'Regina','Dolgoarshinnykh','rgd2102'),(247,'Hiilei','Hobart','hjh2120'),(248,'Charles','Freilich','cdf3'),(249,'Lawrence','Chasin','lac2'),(250,'Marko','Jovanovic','mj2794'),(251,'Vishal','Lala','vl2403'),(252,'Nellie','Hermann','ngh2101'),(253,'Zhong','Shi','zs2132'),(254,'Valerie','Jacobs','vsj2105'),(255,'Leonard','Elmore','lje2105'),(256,'George','Lewis','gl2140'),(257,'George','Lewis','ghl2102'),(258,'Judith','Russell','jr323'),(259,'Ole','Mathisen','om2141'),(260,'Phillip','Williams','pbw2109'),(261,'Joseph','Massad','jam25'),(262,'Dara','Mendeloff','dm2366'),(263,'Leon','Bynum','ljb39'),(264,'Erik','Gray','eg2155'),(265,'Ehichung','Chung','ec61'),(266,'Susan','Palma','sp12'),(267,'Michael','Harvkey','mlh2005'),(268,'Oliver','Simons','os2264'),(270,'Jeremy','Dauber','jad213'),(271,'Jose Pascal','Da Rocha','pd2344'),(272,'Lori','Rassas','lr2422'),(273,'Avia','Tadmor','at2992'),(274,'Peter','Rosenblum','pjr29'),(275,'Alexander','Heil','ah3182'),(276,'Corinna','Barsan','ckb2125'),(277,'Rivka','Galchen','rrg2105'),(278,'Umesh','Akki','ua2159'),(279,'Isabelle','Levy','icl2001'),(280,'Victor','Lin','vjl9'),(281,'Adam','Reich','ar3237'),(282,'Claudia','Breger','cb3328'),(283,'Tanya','Zelevinsky','tz2142'),(284,'Stephanie','Chow','ssc2149'),(285,'James','Wilson','jhw2118'),(286,'Joseph','Albernaz','ja3309'),(287,'Gauri','Viswanathan','gv6'),(288,'Gregg','Gundersen','ggg1'),(289,'Ai','Yamamoto','ay46'),(290,'Amy','Sereday','as4488'),(291,'Francois','Gerard','fg2328'),(292,'Konchog','Tseten','kt2590'),(293,'James','Applegate','jha2'),(294,'Ting','Wen','wt2275'),(295,'Sonam','Tsering','st2931'),(296,'Kyoko','Loetscher','kml2168'),(297,'James','Wood','jw2370'),(298,'Ronald','Gregg','rg3121'),(299,'Gloria','Johnson-Cusack','gpj6'),(300,'Miguel','Ibanez Aristondo','mi2283'),(301,'Ellie','Hisama','eh2252'),(302,'Diane','Bodart','db2920'),(303,'Victor','De la Pena','vhd1'),(304,'Sumit','Mukherjee','sm3949'),(305,'Diana','Romero','rd2170'),(306,'Yihang','Zhu','yz3307'),(307,'Jack','Lechner','jl3863'),(308,'Federica','Franze','ff2157'),(309,'Rowland','Moseley','rm3404'),(310,'Tamar','Lando','tal2108'),(311,'B. Christopher','Wood','bw2218'),(312,'Peter','Labier','pjl2128'),(313,'Guadalupe','Ruiz-Fajardo','gr2250'),(314,'Ross','Posnock','rp2045'),(315,'Gregory','Eirich','gme2101'),(316,'Peter','Susser','pms3'),(317,'Fumiko','Nazikian','fn2108'),(318,'Youssef','Nouhi','yn2162'),(319,'Bertha','Ferdman','bf2467'),(320,'Amy','Starecheski','aas39'),(321,'Julianne','Kasinow','jk3928'),(322,'Sue','Kahn','sk1365'),(323,'Hassan','Afrouzi Khosroshahi','ha2475'),(324,'Jennifer','La\'O','jl4196'),(325,'Daniel','Walker','ddw2003'),(326,'Hilton','Als','hla2001'),(327,'David','Yerkes','dmy1'),(328,'Hayet','Sellami','hs3077'),(329,'Pierre','Force','pf3'),(330,'Kathleen','Bolick','kob2106'),(331,'Venkat','Venkatasubramanian','vv2213'),(332,'Reem','Faraj-Kanjawi','rf2273'),(333,'Darcy','Kelley','dbk3'),(334,'Dustin','Rubenstein','dr2497'),(335,'Arunava','Bhattacharyya','ab4804'),(336,'John','Asker','ja3332'),(337,'Guillaume','Remy','gr2606'),(338,'Francisco','Rosales-Varo','fr2209'),(339,'Odell','Mays','om2274'),(340,'Mohammad','Maleki','mm4338'),(341,'Tatiana','Berezin','tb2800'),(342,'Gregory','Muth','gjm2107'),(343,'Marcos','da Silva','mbd2156'),(344,'Georg','Haas','gfh2107'),(345,'Patricio','Contreras','pc2873'),(346,'Francisco','Meizoso','fm2414'),(347,'Abhay','Narayan Pasupathy','apn2108'),(348,'David','Adamcyk','da2472'),(349,'Michael','Leibrock','ml4196'),(350,'Juan','Jimenez','jj2415'),(351,'Barbara','Fields','bjf1'),(352,'Bradley','Meyer','bbm2112'),(353,'Guillaume','Haeringer','gh2477'),(354,'Margo','Jefferson','mlj4'),(355,'Martin','Uribe','mu2166'),(356,'Leslie','Ayvazian','laa2104'),(357,'James','Schlefer','jrs2230'),(358,'Christian','Parker','ecp10'),(359,'David','Johnston','dcj1'),(360,'Nicholas','Salter','nks2139'),(361,'Chris','Kuo','ck2869'),(362,'Rena','Barakat','rb3418'),(363,'Jushan','Bai','jb3064'),(364,'Enyi','Koene','ek2829'),(367,'David','Rosner','dr289'),(368,'Christopher','Baldassano','cab2304'),(369,'Wimbo','Wicaksono','wpw2112'),(370,'Jill','Shapiro','jss19'),(371,'Boshu','Zhang','bz2194'),(372,'Justin','Clarke Doane','jc4345'),(373,'Masayo','Tokue','mit2111'),(374,'Ellen','Marakowitz','em8'),(375,'Gregory','Amenoff','gaa9'),(376,'Saljooq','Asif','sma2205'),(377,'Cindy','Smalletz','cks2120'),(378,'Paula','Darling','pd2523'),(379,'Michael','Sladek','ms6045'),(380,'Michael','Passaro','mjp2209'),(381,'Jack','Rouse','jr3406'),(382,'Audra','Simpson','as3575'),(383,'Ryan','Abernathey','ra2697'),(384,'Yubo','Wang','yw2999'),(385,'Mahmood','Mamdani','mm1124'),(386,'Richard','Rood','rwr2105'),(387,'Phillip','Lopate','pl2139'),(388,'John','Pemberton','jp373'),(389,'Joshua','Fisher','jf2788'),(390,'Joseph','Slaughter','jrs272'),(391,'Kimuli','Kasara','kk2432'),(392,'Monica Feinberg','Cohen','mlf1'),(393,'Monica','Pachon','mp3779'),(394,'Benjamin','Steege','bas39'),(395,'Jon','Cotner','jc4416'),(396,'Camilo','Azcarate','caa2118'),(397,'Samuel','Lipsyte','spl2104'),(398,'Eveline','Washul','esy2103'),(399,'Marina','Cords','mc51'),(400,'Tal','Lazar','tl2910'),(401,'Stephanie','Cosentino','sc2460'),(402,'Gregory','Taylor','gt2396'),(403,'Susan','Bernofsky','sb3270'),(404,'Chris','Boneau','cab46'),(405,'John','Vincler','jv2653'),(406,'Ji-Young','Jung','jj277'),(407,'Karthik','Natarajan','kn2174'),(408,'Illan','Gonen','ig2276'),(409,'Teodolinda','Barolini','tb27'),(410,'Wojciech','Kopczuk','wk2110'),(411,'Thomas','Humensky','tbh2110'),(412,'Craig','Irvine','ci44'),(413,'Aaron','Oforlea','ao2701'),(414,'John','Currie','jc5048'),(415,'Lindsay Carter','Piechnik','lp2149'),(416,'Bradford','Garton','bgg1'),(417,'Gregory','Mann','gm522'),(418,'Joseph','Cacaci','jrc2145'),(419,'Wei','Ho','wh2237'),(420,'Roosevelt','Montas','rm63'),(421,'Yuri','Shevchuk','sy2165'),(422,'Feng','Wang','fw2157'),(423,'Rafael','Yuste','rmy5'),(424,'Keri','Bertino','keb2119'),(425,'Arthur','Kuflik','ak2105'),(426,'Anthony','Donoghue','ad2798'),(427,'Zinga','Fraser','zaf2101'),(428,'Johann','Brambor','tb2729'),(429,'Eliot','Bailen','etb29'),(430,'Lisa','Dale','lad2189'),(431,'Frank','Oswald','fjo2105'),(432,'Susan','Blaustein','smb2153'),(433,'Tomas','Vu-Daniel','tvd4'),(434,'David','Shilane','das2270'),(435,'Aftab','Ahmad','aa3070'),(436,'John','Zinsser','jz2450'),(437,'Norman','Christ','nhc1'),(438,'Rawle','Sawh','rs3062'),(439,'Christopher','Magno','cm3653'),(440,'Tamara','Mann','tbm2105'),(441,'Ranjit','Kumble','rk2721'),(442,'Vanessa','Agard-Jones','vaj2116'),(443,'Ming','Fang','mf3226'),(444,'Mary','Abraham','ma3255'),(445,'Ed','Hoffman','ejh82'),(446,'Caterina','Pizzigoni','cp2313'),(447,'Juan','Cominguez','jpc2201'),(448,'Joyce','Robbins','jtr13'),(449,'Thomas','Groppe','tjg18'),(450,'Robert','Amdur','rla2'),(451,'Arin','Arbus','aa4352'),(452,'Shekhar','Pradhan','sp3719'),(453,'Dimitris','Antoniou','da2500'),(454,'Christopher','Brown','clb2140'),(455,'Mariam','Aly','ma3631'),(456,'Shamus','Khan','sk2905'),(457,'Laura','Sywulak','las2326'),(458,'Charles','Woolley','cew2131'),(459,'Ingmar','Nyman','ion1'),(460,'Stephen','Hurley','sh3498'),(461,'Akram','Alishahi','as5013'),(462,'Silja','Weber','svw2108'),(463,'Leta','Fincher','lh2793'),(464,'Scott','Spencer','sas2375'),(465,'Duong','Phong','dhp2'),(466,'Richard','Billows','rab4'),(467,'Talha','Siddiqui','ts3132'),(468,'Eric','Matheis','etm9'),(469,'Terence','D\'Altroy','tnd1'),(470,'Rakesh','Ranjan','rr2574'),(471,'Tamrat','Gashaw','tg2681'),(472,'Vijaya','Nadendla','vn2268'),(473,'Nico','Baumbach','nb2428'),(474,'Sarah','Adams','sea4'),(475,'Nina','Ernst','ne2261'),(476,'Christopher','Peacocke','cp2161'),(477,'Sarah','Odland','sko2003'),(478,'Zhaohua','Yang','zy2200'),(479,'Lening','Liu','ll172'),(480,'Carla','Varriale','cv2230'),(481,'Andreas','Kakolyris','ak3433'),(482,'Benjamin','Hale','bh2177'),(483,'David','Albert','da5'),(484,'Jesse','Scinto','js3798'),(485,'Christine','Pinnock','cp2024'),(486,'Ian','Olds','iwo2001'),(487,'Jules','Halpern','jph1'),(488,'Jean','Howard','jfh5'),(489,'Chanwoong','Baek','cb2928'),(490,'Evgeni','Dimitrov','esd2138'),(491,'Sara','Kross','smk2258'),(492,'David','Vawdrey','dkv2101'),(493,'Renee','Blinkwolt','rmb2137'),(494,'Sara','Van der Beek','sv2565'),(495,'Victoria','Leavitt','vl2337'),(496,'Anna','Moschovakis','am5210'),(497,'Tey','Meadow','tm2846'),(498,'Magdalena','Stern Baczewska','mb3713'),(499,'Nicholas','Tatonetti','npt2105'),(500,'Rirkrit','Tiravanija','rt169'),(501,'Cheng','Ji','cj2648'),(502,'Maureen','Ryan','mar111'),(503,'Deborah','Paredez','dp2783'),(504,'Albrecht','Hofmann','awh2102'),(505,'Ruben','Savizky','rms2177'),(506,'Sadia','Janjua','sij2106'),(507,'Anais','Duplan','ad3505'),(508,'Nicole','Wallack','nw2108'),(509,'Marco','Avella Medina','ma3874'),(510,'Thibault','Vatter','tv2233'),(511,'Solomon','Mowshowitz','sm2604'),(512,'Seong','Kim','sk4236'),(513,'Jack','Norton','jrn11'),(514,'Alice','Quinn','aq1'),(515,'Jishnu','Shankar','js5400'),(516,'Maksim','Pinkovskiy','mlp2005'),(517,'Vasile','Savin','os2161'),(518,'Inga','Winkler','itw2002'),(519,'Charles','Armstrong','cra10'),(520,'Blair','Singer','bgs2127'),(521,'Amanda','Earl','ake2112'),(522,'Benjamin','Royce','bpr2112'),(523,'Kizzy','Charles-Guzman','kc2688'),(524,'Joseph','Peet','jjp2142'),(525,'Goran','Ekstrom','ge21'),(526,'James','Gaherty','jbg2101'),(527,'Meredith','Nettles','mn2237'),(528,'Spahr','Webb','scw21'),(529,'Allen','Durgin','acd2156'),(530,'Ana Paula','Huback','aph2129'),(531,'Ahmad','Askarian','aa4402'),(532,'Frank','Guridy','fg2368'),(533,'George','Noldeke','gn2298'),(534,'Barbra','Rothschild','br2398'),(535,'Retno Daru','Putri','rdp2132'),(536,'John','Vitucci','jv2461'),(537,'Sally','Yerkovich','sy2597'),(538,'Carter','Mathes','cm3982'),(539,'Edmund','Phelps','esp2'),(540,'Alexandre','Bournery','ab4539'),(541,'Anelise','Chen','ac4132'),(542,'Susan','Elbin','se2170'),(543,'Craig','Zammiello','cz2231'),(544,'Bruce','Barth','bb2685'),(545,'Edward','Morales','em2711'),(546,'Mark','Hildreth','mwh2136'),(547,'Todd','Mayo','tem2156'),(548,'Tunc','Sen','ats2171'),(549,'Claire','Hazen','ceh2'),(550,'Joseph','Schlosser','jrs2307'),(551,'Karen','Phillips','kep12'),(552,'Alessandra','Saggin','as2931'),(553,'Marie-Helene','Koffi-Tessio','mk2012'),(554,'Juan','Hernandez Aguilera','jnh2135'),(555,'Matthew','McKelway','mpm8'),(556,'Rebecca','Kobrin','rk2351'),(557,'Paul','Kreitman','pk2528'),(558,'Meredith','Landman','ml4263'),(559,'Dana','Elmquist','dae2135'),(560,'Ian','Sullivan','is2562'),(561,'Gareth','Williams','gdw5'),(562,'Michael','Shnaidman','ms523'),(563,'Stephanie','Schmitt-Grohe','ss3501'),(564,'Joanna','Stalnaker','jrs2052'),(565,'Alberto','Medina','am3149'),(566,'Elizabeth','Blackmar','eb16'),(567,'Tsveta','Petrova','tp2379'),(568,'Mahir','Cetiz','mc2765'),(569,'Lauren','Grodstein','lpg3'),(570,'George','Chauncey','gc2765'),(571,'John','Cunningham','jpc2181'),(572,'Peter','Orbanz','po2197'),(573,'Bruno','Bosteels','bb438'),(574,'John','Allen','jda2165'),(575,'Matthew','Farrell','mdf2152'),(576,'Claudio','Lomnitz','cl2510'),(577,'Chiara','Superti','cs3546'),(578,'Brian','Kulick','bk2081'),(579,'Jacqueline','Austermann','ja3170'),(580,'Maureen','Raymo','mer2'),(581,'Paul','Anderer','pja1'),(582,'Selina','Makana','sm4425'),(583,'Charles','Bock','cb3144'),(584,'Elaine','Van Dalen','ev2423'),(585,'Sameer','Ladha','shl2159'),(586,'Denise','Milstein','dm531'),(587,'Lynn','Drucker','ldm2108'),(588,'Milton','Pesantez','map2128'),(589,'Vishakha','Desai','vd2278'),(590,'Victoria','Gross','vgg2108'),(591,'Sarah','Lockwood','sjl2149'),(592,'Jennifer','Hoffman','jch7'),(593,'Martha','Zebrowski','mkz1'),(594,'Ssanyu','Nutt-Birigwa','snb2143'),(595,'Wayne','Lee','wtl2109'),(596,'Angela','Finlay','af3153'),(597,'Thomas','DiPrete','tad61'),(598,'Miharu','Nittono','mn70'),(599,'Barbara','Fischer','bf36'),(600,'Jean','Cohen','jlc5'),(601,'Carla','Herrera-Prats','ch3270'),(602,'Alfredo','Spagna','as5559'),(603,'Evan','Eskew','eae2144'),(604,'Anne','Levitsky','aal2140'),(605,'Annette','Insdorf','ai3'),(606,'Jan','Hammerquist','jh4103'),(607,'Hannah','Weaver','hmw2147'),(608,'Matthieu','Gomez','mg3901'),(609,'Yuka','Nakazato','yn2388'),(610,'Michael','McGuire','mem2276'),(611,'Brendan','Ward','bnw1'),(612,'Joseph','Cina','jc4957'),(613,'Eric','Mendelsohn','em2033'),(614,'Timothy','Goodspeed','tg2055'),(615,'Shigeru','Eguchi','se53'),(616,'Anita','Drummond','ad3448'),(617,'Nicholas','Dames','nd122'),(618,'Jack Lewis','Snyder','jls6'),(619,'Elizabeth','De Vita','ed2854'),(620,'Stephen','Zinsser','sz2752'),(621,'Carlos','Vargas-Ramos','cv8'),(622,'Pierre','Chiappori','pc2167'),(623,'Emmanuelle','Saada','es2593'),(624,'Tianqi','Jiang','tj2342'),(625,'Richard','Pena','rap4'),(626,'Helen','Sung','hs2898'),(627,'Biswagit','Mazumdar','btm2116'),(628,'Steven','Safier','sis2127'),(629,'Bruce','Berne','bb8'),(630,'Angelo','Cacciuto','ac2822'),(631,'Robert','Beer','rhb5'),(632,'David','Kittay','drk2004'),(633,'Mitchell','Jackson','mj2700'),(634,'Matteo','Rinaldi','mr3921'),(635,'Itsuki','Hayashi','ih2300'),(636,'Leonard','Schwartz','lws36'),(637,'Vito','Adriaensens','va2329'),(638,'Ying','Liu','yl2587'),(639,'Tian','Zheng','tz33'),(640,'Valerie','Purdie-Greenaway','vjp12'),(641,'Banu','Baydil','bb2717'),(642,'Don','Sickler','ds228'),(643,'Wael','Hallaq','wh2223'),(644,'Muhsin','Al-Musawi','ma2188'),(645,'Daniel','Rabinowitz','dr105'),(646,'Yinon','Cohen','yc2444'),(647,'Sarah','Canetta','ses2119'),(648,'Lars','Nielsen','ln2269'),(649,'Stuart','Rockefeller','sr2772'),(650,'Neal','Masia','nm2724'),(651,'Yuan-Yuan','Meng','ym11'),(652,'Rongning','Wu','rw2556'),(653,'Danielle','Spencer','drs2157'),(654,'Alexandra','Strada','as4718'),(655,'Nathan','Catlin','nc2467'),(656,'Sayantani','Dasgupta','sd2030'),(657,'Liza','Knapp','lk2180'),(658,'Sudip','Chakraborty','sc4374'),(659,'Victoria','Bailey','vb12'),(660,'Suzanne','Goldberg','sg2264'),(661,'Prajit','Dutta','pkd1'),(662,'Rania','Attieh','ra2997'),(663,'Rebecca','Heino','rh2765'),(664,'Oliver','Hobert','or38'),(665,'Clarence','Coo','ckc2115'),(666,'Daphne','Merkin','dmm2155'),(667,'Kathy','Eden','khe1'),(668,'Prasad','Kodali','pk2553'),(669,'Donald','Green','dpg2110'),(670,'Alexander','Motyl','ajm5'),(671,'Linda','Marvel','lm2945'),(672,'Yury','Levin','yl3470'),(673,'Cornelia','Class','cc291'),(674,'Gus','Schrader','gks2127'),(675,'Martin','Chalfie','mc21'),(676,'Carlo','di Florio','cd3001'),(677,'Michael','Naumann','mn2130'),(678,'Alexander','Brietzke','zb2120'),(679,'Maria','Perez-Brown','mp2949'),(680,'William','MacLeod','wbm2103'),(681,'Aracelis','Girmay','ag3972'),(682,'Bernard','Faure','bf2159'),(683,'Ann','Douglas','ad34'),(684,'Paul','Levitz','pel2109'),(685,'Miriam','Chusid','mc4315'),(686,'Kristie','Schlauraff','kas2321'),(687,'Tasha','Space','ts2211'),(688,'Marco','Morales Barba','mam2519'),(689,'Christopher','Caes','cc4038'),(690,'Robert','Klitzman','rlk2'),(691,'Janet','Ikeda','jiy2103'),(692,'Caryn','James','cj2374'),(693,'Daniel','Kressel','dgk2114'),(694,'Marcel','Agueros','maa17'),(695,'Deborah','Steiner','dts8'),(696,'Michael','Woodford','mw2230'),(697,'John','Burns','jab2441'),(698,'Paul','Olsen','peo1'),(699,'Darcy','Krasne','dk3009'),(700,'Katherine','Franke','kmf37'),(701,'Arthur','Palmer III','agp6'),(702,'Jaime','Rubin','jsr9'),(703,'David','Kipping','dmk2184'),(704,'Jose','Scheinkman','js3317'),(705,'Rishi','Goyal','rkg6'),(706,'Dorothea','von Muecke','dev1'),(707,'Kanstantsin','Matetski','km3461'),(708,'Alan','Stewart','ags2105'),(709,'Pema','Bhum','pb2634'),(710,'Lucius','Riccio','ljr14'),(711,'Luis','Campos','lc2730'),(712,'Dmitry','Alexeev','da2695'),(713,'Simon','Brendle','sab2280'),(714,'Malgorzata','Mazurek','mm4293'),(715,'Ronald','Miller','rm170'),(716,'Alejandro','Chavez','ac4304'),(717,'Burton','Budick','bb14'),(718,'John','Rubin','jgr2101'),(719,'Julie','Peters','jsp2'),(720,'Francisca','Aguilo Mora','fa2443'),(721,'Derek','McCracken','dsm2178'),(722,'Bonnie','Panson','bp2365'),(723,'Karla','Hoff','kh2830'),(724,'Joseph','Stiglitz','jes322'),(725,'Rashid','Khalidi','rik2101'),(726,'Ulug','Kuzuoglu','uk2123'),(727,'Mamadou','Diouf','md2573'),(728,'Jacqueline','van Gorkom','jv3'),(729,'Milena','Jelinek','mj4'),(730,'Brian','Metzger','bdm2129'),(731,'Sandra','Smith','ss4657'),(732,'Thomas','Recktenwald','tr2522'),(733,'Takuya','Tsunoda','tt2101'),(734,'Max','Vilenchik','mv2699'),(735,'Mark','Mazower','mm2669'),(736,'Allison','Bridges','alb2303'),(737,'Paraskevi','Martzavou','pm2839'),(738,'Adam','Marchand','am3979'),(739,'So-Rim','Lee','sl2179'),(740,'Suresh','Naidu','sn2430'),(741,'Bernard','Harcourt','beh2139'),(742,'Alexis','Hoag','ajh2233'),(743,'Abdelrazzaq','Ben Tarif','ab4950'),(744,'Peter','Bearman','psb17'),(745,'Sheridan','Kennedy','sk4562'),(746,'Tulle','Hazelrigg','tih1'),(747,'Vince','Cherico','vc2354'),(748,'Raphael','Beuzart','rfb2133'),(749,'Natasa','Rajicic','nr2619'),(750,'Geraldine','Wu','gaw18'),(751,'Benjamin','Leonberg','bcl2126'),(752,'Joris','Magenti','jm4868'),(753,'Russell','Scibetti','rs3940'),(754,'Wayne','Huang','wh2435'),(755,'Susan','Rotholz','sr814'),(756,'Richard','Lauria','rl2764'),(757,'Barami','Waspe','bw2529'),(758,'Heli','Sirvioe','hs3026'),(759,'Ramon','Katz','rjk2131'),(760,'Herbert','Terrace','hst1'),(761,'Matthew','von Unwerth','mfv2105'),(762,'Young Mi','Park','yp2515'),(763,'Alessia','Palanti','ap3105'),(764,'Gregory','Wawro','gjw10'),(765,'June','Han','jyh24'),(766,'William','Menke','whm3'),(767,'Ira','Silverberg','is2473'),(768,'Eric','Schoenberg','ejs2011'),(769,'Skye','Cleary','sc3692'),(770,'Jenny','Fernandez','jmf34'),(771,'Benedict','Okoh','boo2'),(772,'Maria','Gozzi','mlg30'),(773,'Ross','Perlin','rap2179'),(774,'Brad','Schwartz','bs3169'),(775,'Naofumi','Tatsumi','nt2358'),(776,'Meghan','Daum','md113'),(777,'Bruce','Cronin','bc14'),(778,'Keiko','Okamoto','ko47'),(779,'Curtis','Probst','csp2138'),(780,'Sidney','Rosdeitcher','sr2827'),(781,'Lila','Abu-Lughod','la310'),(782,'Ivana','Hughes','ih2194'),(783,'Giuseppe','Gerbino','gg2024'),(784,'Jesus','Velasco','jr2857'),(785,'Laurel','Kendall','lk7'),(786,'Timothy','Donnelly','td28'),(787,'Michael','Sobel','mes105'),(788,'Terry','Plank','tap3'),(789,'Wouter','Vergote','wrv13'),(790,'Diana','Reese','dr57'),(791,'Pamela','Wheeler','pw2472'),(792,'John','Huber','jdh39'),(793,'Yasutomo','Uemura','yu2'),(794,'Shahryar','Shaghaghi','ss5602'),(795,'Xiaosheng','Mu','xm2230'),(796,'Matthew','Danelo','md3791'),(797,'Ron','Papka','rp52'),(798,'Bodhisattva','Sen','bs2528'),(799,'Deborah','Eisenberg','de2268'),(800,'Cynthia','Thompson','cat2138'),(801,'Mary','Blair','meb2127'),(802,'Solange','Charas','sc4557'),(803,'David','Klass','dk2541'),(804,'Violet','Diamant','vd2357'),(805,'Robert','Gooding-Williams','rg2944'),(806,'Sonali','Deraniyagala','sd2535'),(807,'John','Mutter','jcm7'),(808,'Michael','Silas','mas2549'),(809,'Patrizia','Palumbo','pp4'),(810,'John','Hunt','jfh21'),(811,'Michael','Taussig','mt107'),(812,'Laurajean','Holmgren','lh2748'),(813,'Evan','Warner','ew2604'),(814,'John','Van Ness','jdv2116'),(815,'Jamal','Joseph','jj260'),(816,'Peter','Went','pfw2108'),(817,'Gordon','Beeferman','glb2128'),(818,'Charles','Hailey','cjh26'),(819,'Cory','Dean','cd2478'),(820,'Ilya','Kofman','ik2005'),(821,'Dana','DeGuilio','dd2879'),(822,'Benjamin','Metcalf','bsm2101'),(823,'Andrew','Whitehouse','aw3203'),(824,'Aleksandar','Boskovic','ab3865'),(825,'Suzanne','Macey','sm3255'),(826,'Zachary','Kornhauser','zk2124'),(827,'Alexandria','Moore','acm2261'),(828,'Igor','Krichever','imk8'),(829,'Erick','Weinberg','ejw2'),(830,'Naor','Ben-Yehoyada','nhb2115'),(831,'Neni','Panourgia','np255'),(832,'Alan','Gilbert','ag3445'),(833,'Graciela','Chichilnisky','gc9'),(834,'Donald','Davis','drd28'),(835,'Saeed','Honarmand','sh3468'),(836,'Kristine','Billmyer','kb2510'),(837,'Alice','Haviland','ah2635'),(838,'Naama','Harel','nh2508'),(839,'Monica','Calabritto','mc3739'),(840,'Andrew','Gelman','ag389'),(841,'Jeremy','Dodd','jrd4'),(842,'Daniel','Kleinman','dek19'),(843,'May','Ahmar','ma2550'),(844,'Carolyn','Casselman','cjc52'),(845,'John','O\'Connell','jo2289'),(846,'Thomas','Watson','tw141'),(847,'Laia','Andreu Hayles','la2388'),(848,'Katia','de Avila Fernandes','kaf2157'),(849,'Dolores','Barbazan Capeans','db3140'),(850,'Robert','Spillman','rs2973'),(851,'Ruimeng','Hu','rh2937'),(852,'Luis','Francia','lf2107'),(853,'Zeynep','Celik','zc2171'),(854,'Samuel','Sultan','ss5270'),(855,'Elsa','Stephan','es3618'),(856,'James','Schamus','jas9'),(857,'Simona','Vaidean','scv16'),(858,'Robert','Shapiro','rys3'),(859,'Ronald','Van Lieu','rv2390'),(860,'Shaoyan','Qi','sq2106'),(861,'Hilary','Leichter','hg2488'),(862,'Alison','Walling','alw2152'),(863,'Beverly','Tarulli','bt2492'),(864,'Eunice','Chung','eec2136'),(865,'Lisa','de Bessonet','ld2864'),(866,'Michael','Hindus','msh82'),(867,'Hyunkyu','Yi','hy122'),(868,'Richard','Davis','rd2339'),(869,'Shaw-Hwa','Lo','shl5'),(870,'Martha','Sullivan','ms5878'),(871,'Scott','Silver','ss2307'),(872,'Charles','Mee','clm2161'),(873,'Angelina','Craig-Florez','ac68'),(874,'Alexei','Chekhlov','ac3085'),(875,'Matthew','Jones','mj340'),(876,'Marwa','Elshakry','me2335'),(877,'Mae','Ngai','mn53'),(878,'Andrew','Nathan','ajn1'),(879,'Nathan','Dowlin','npd2115'),(880,'Jose','Zuniga','jz2687'),(881,'David','Hoffman','dnh2101'),(882,'Hey','Hong','hh2254'),(883,'Glenn','Magpantay','gdm2131'),(884,'James','Adams','jea2139'),(885,'Madeleine','Disner','med2216'),(886,'Lena','Edlund','le93'),(887,'Brendan','O\'Flaherty','bo2'),(888,'Nicole','Alexander','na2762'),(889,'Nicole','Krauss','nak2153'),(890,'Siddhartha','Dalal','sd2803'),(891,'Brian','Greene','bg111'),(892,'Leah','Heister Burton','leh2143'),(893,'Michael','Stanislawski','mfs3'),(894,'Jennifer','Lee','jl5084'),(895,'Tahira','Khan','tk2710'),(896,'Robert','Erikson','rse14'),(897,'Sanjay','Sharma','ss6021'),(898,'Svetlana','Rosis','sr3055'),(899,'Etienne','Balibar','eb2333'),(900,'Fay','Ng','fwn2'),(901,'Barry','Sommer','bs2671'),(902,'Raymundo','Pantoja','rp2657'),(903,'Rhiannon','Dowling','rd2886'),(904,'Diahanna','Post','dp2854'),(905,'Dennis','Hilton-Reid','dh2954'),(906,'Mikael','Sodersten','ms4887'),(907,'Beth','Hirschhorn','bh2670'),(908,'Serena','Ng','sn2294'),(909,'Rosalind','Krauss','rek8'),(910,'Brigitte','Nacos','bn1'),(911,'Cesar','Colon-Montijo','cac2221'),(912,'Michele','Moody-Adams','mm3735'),(913,'Susanne','Desroches','sed2125'),(914,'Marc','Hannaford','meh2230'),(915,'Roi','Ben Yehuda','rb2836'),(916,'Wenlian','Zhang','wz2377'),(917,'Katherine','Loewald','kl3037'),(918,'Chiu-Chu','Liu','ccl2121'),(919,'R. Scott','Forston','rsf2133'),(920,'Reka','Juhasz','rj2446'),(921,'Henri','Roesch','hpr2110'),(922,'Ruvani','Freeman','rsf2128'),(923,'Van','Tran','vct2105'),(924,'Carmela','Franklin','cvf2'),(925,'Christopher','Harwood','cwh4'),(926,'Sandy','Becker','sb2707'),(927,'Christopher','Lencheski','cl3458'),(928,'Lisa','Poyer','lmp2192'),(929,'Lincoln','Mitchell','lam13'),(930,'Owen','Westberg','ow2147'),(931,'Nancy','Cline','nec2133'),(932,'Sara','Hobbs Kohrt','ssh2160'),(933,'Chung','Nguyen','cn2496'),(934,'Lorenzo','Polvani','lmp3'),(935,'Ming','Yuan','my2550'),(936,'Aubrey','Gabel','aag2188'),(937,'Alberto','Spektorowski','as3607'),(938,'Walter','Frisch','wf8'),(939,'Brent','Edwards','bhe2'),(940,'Lee','Siegel','ls59'),(941,'June','Stein','js45'),(942,'Harvey','Stein','hs2837'),(943,'Matthew','DiCarlo','md3785'),(944,'Laura','Milewczik','lm3030'),(945,'Elaine','Sisman','es53'),(946,'Andrew','Blum','ab4430'),(947,'Elizabeth','Bond','eyb2'),(948,'Daniella','Uribe','deu2101'),(949,'Rachel','Aviv','rsa2001'),(950,'Marc','Blatter','mb3483'),(951,'Frederik','Paerels','fbp4'),(952,'David','Sable','dbs2154'),(953,'Michel','Leonard','ml3318'),(954,'Michael','Skelly','ms51'),(955,'Lis','Harris','ph104'),(956,'Larisa','Heiphetz','lah2201'),(957,'Syed','Zaidi','saz2111'),(958,'Courtni','Jeffers','cj2489');
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
  `ip` varchar(15) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `type` enum('agree','disagree','funny') DEFAULT NULL,
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

-- Dump completed on 2020-08-12  2:06:43
