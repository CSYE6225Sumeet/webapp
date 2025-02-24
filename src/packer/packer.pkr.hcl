packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8, <2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
    googlecompute = {
      version = ">= 1.0.0, <1.2.0"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

# AWS Variables (now read from environment)
variable "aws_region" {
  default = env("AWS_REGION")
}

variable "aws_instance_type" {
  default = env("AWS_INSTANCE_TYPE")
}

variable "aws_access_key" {
  default = env("AWS_ACCESS_KEY")
}

variable "aws_secret_key" {
  default = env("AWS_SECRET_ACCESS_KEY")
}

# Define the source AMI directly (also via env)
variable "source_ami" {
  default = env("SOURCE_AMI")
}

# Common Variables
variable "ami_name_prefix" {
  default = env("AMI_NAME_PREFIX")
}

variable "ubuntu_ami_owner" {
  default = env("UBUNTU_AMI_OWNER")
}

variable "db_name" {
  default = env("DB_NAME")
}

variable "db_user" {
  default = env("DB_USER")
}

variable "db_password" {
  default = env("DB_PASSWORD")
}

variable "db_host" {
  default = env("DB_HOST")
}

# AWS Builder for DEV AWS Account using source_ami
source "amazon-ebs" "ubuntu" {
  ami_name      = "${var.ami_name_prefix}-{{timestamp}}"
  instance_type = var.aws_instance_type
  region        = var.aws_region

  # Use credentials from variables
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key

  source_ami = var.source_ami

  ssh_username = "ubuntu"

  tags = {
    Name        = "Custom Ubuntu Image"
    Environment = "DEV"
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 20
    volume_type           = "gp2"
  }

  # Ensure the image is private
  ami_groups = []
}

# Provisioners to Install and Validate MySQL
build {
  sources = ["source.amazon-ebs.ubuntu"]

  provisioner "shell" {
    environment_vars = [
      "DB_NAME=${var.db_name}",
      # "DB_USER=${var.db_user}",
      "DB_PASSWORD=${var.db_password}",
      # "DB_HOST=${var.db_host}"
    ]
    script = "./scripts/install-script.sh"
  }

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "./webapp.service"
    destination = "/tmp/"
  }

  provisioner "shell" {
    environment_vars = [
      "DB_NAME=${var.db_name}",
      "DB_USER=${var.db_user}",
      "DB_PASSWORD=${var.db_password}",
      "DB_HOST=${var.db_host}"
    ]

    script = "./scripts/system-script.sh"
  }
}
