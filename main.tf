terraform {
  required_version = ">= 0.12"

  backend "remote" {
    organization = "culpa"

    workspaces {
      name = "culpa-prod-us-east"
    }
  }
}

# Use Amazon Web Services in us-east-2 region (Ohio)
provider "aws" {
  version = "3.5.0"
  region  = "us-east-2"
}

# Retrieve the ami id associated with latest Ubuntu 18.04 LTS
data "aws_ami" "ubuntu_ami" {
  # use the most recent version, assuming that no breaking changes
  # will be introduced with Amazon Linux2
  most_recent = true

  owners = ["amazon"]

  filter {
    name = "name"

    # Name of the image as discoverable through the aws describe-images
    # CLI command
    values = [
      "*ubuntu-1804-lts-hvm*",
    ]
  }

  filter {
    name = "architecture"

    values = [
      "x86_64"
    ]
  }
}

# Create a custom VPC with two public subnets and two private (database)
# subnets across two availability zones in the region. The public
# subnets are necessary for the web server while the private subnets
# hold the internal db server.
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.48.0"

  name = "culpa-vpc"
  cidr = "10.0.0.0/16"

  azs              = ["us-east-2a", "us-east-2b"]
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24"]
  database_subnets = ["10.0.11.0/24", "10.0.12.0/24"]

  # database subnet group created in rds module block
  create_database_subnet_group = false
  enable_dns_hostnames         = true
  enable_dns_support           = true

  # create an internet gateway to give access to the internet
  create_igw = true

  tags = {
    Owner       = "culpa"
    Environment = "prod"
  }

  vpc_tags = {
    Name = "culpa-vpc"
  }
}

# Gives ingress access to all http ports and also allows ssh access
# for deployment and in rare emergency situations.
module "web_sg" {
  source  = "terraform-aws-modules/security-group/aws//modules/web"
  version = "3.0"

  name        = "EC2 Web Security Group"
  description = "Gives web access to the EC2 instance"
  vpc_id      = module.vpc.vpc_id

  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules       = ["ssh-tcp"]
}

# Only allows access from within the VPC to Mysql port.
module "db_sg" {
  source  = "terraform-aws-modules/security-group/aws//modules/mysql"
  version = "3.0"

  name        = "Mysql Security Group"
  description = "db can only be accessed with the VPC"
  vpc_id      = module.vpc.vpc_id

  ingress_cidr_blocks = [module.vpc.vpc_cidr_block]
}

resource "aws_key_pair" "github_ssh_key" {
  key_name   = "github-ssh-key"
  public_key = var.github_ssh_key
}

module "ec2" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "2.0"

  name           = "CULPA Production Server"
  instance_count = 1
  ami            = data.aws_ami.ubuntu_ami.id
  instance_type  = "t2.micro"

  vpc_security_group_ids      = [module.web_sg.this_security_group_id]
  subnet_id                   = module.vpc.public_subnets[0]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.github_ssh_key.key_name

  user_data = file("${path.module}/.deploy/provision.yml")

  tags = {
    Terraform   = "true"
    Environment = "prod"
  }
}

resource "aws_eip" "server_eip" {
  instance = module.ec2.id[0]
  vpc      = true
}

module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "culpa-db"

  # All available versions: http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html#MySQL.Concepts.VersionMgmt
  engine            = "mysql"
  engine_version    = "8.0.17"
  instance_class    = "db.t2.micro"
  allocated_storage = 10
  storage_encrypted = false

  name     = "culpa_prod_db"
  username = "culpa"
  password = var.database_password
  port     = "3306"

  vpc_security_group_ids = [module.db_sg.this_security_group_id]

  maintenance_window = "Mon:02:00-Mon:04:00"
  backup_window      = "04:00-06:00"

  # disable backups to create DB faster
  backup_retention_period = 0

  tags = {
    Owner       = "culpa"
    Environment = "prod"
  }

  # DB subnet group
  subnet_ids = module.vpc.database_subnets

  # DB parameter group
  family = "mysql8.0"

  # DB option group
  major_engine_version = "8.0"

  # Snapshot name upon DB deletion
  final_snapshot_identifier = "culpadb"

  # Database Deletion Protection
  deletion_protection = false

  parameters = [
    {
      name  = "character_set_client"
      value = "utf8"
    },
    {
      name  = "character_set_server"
      value = "utf8"
    }
  ]
}

resource "aws_route53_zone" "private_dns" {
  name    = "culpa.info"
  comment = "Internal route53 DNS"

  vpc {
    vpc_id = module.vpc.vpc_id
  }

  tags = {
    Environment = "prod"
  }
}

resource "aws_route53_record" "db" {
  zone_id = aws_route53_zone.private_dns.zone_id
  name    = "db.culpa.info"
  type    = "CNAME"
  ttl     = 300
  records = [module.db.this_db_instance_address]
}

output "public_ip" {
  value = aws_eip.server_eip.public_ip
}