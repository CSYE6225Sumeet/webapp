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

variable "demo_account_id" {
  default = env("DEMO_ACCOUNT_ID")
}

variable "ssh_username" {
  default = env("SSH_USERNAME")
}

variable "machine_type" {
  default = env("MACHINE_TYPE")
}

variable "source_image_family" {
  default = env("SOURCE_IMAGE_FAMILY")
}

#---
variable "delete_on_termination" {
  default = env("DELETE_ON_TERMINATION")
}

variable "device_name" {
  default = env("DEVICE_NAME")
}

variable "volume_size" {
  default = env("VOLUME_SIZE")
}

variable "volume_type" {
  default = env("VOLUME_TYPE")
}

variable "gcp_project_id" {
  default = env("GCP_PROJECT_ID")
}

variable "gcp_zone" {
  default = env("GCP_ZONE")
}

variable "disk_size" {
  default = env("DISK_SIZE")
}

variable "disk_type" {
  default = env("DISK_TYPE")
}

variable "gcp_credentials_file" {
  default = env("GCP_CREDENTIALS_FILE")
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

  ssh_username = var.ssh_username

  tags = {
    Name        = "Custom Ubuntu Image"
    Environment = "DEV"
  }

  launch_block_device_mappings {
    delete_on_termination = var.delete_on_termination
    device_name           = var.device_name
    volume_size           = var.volume_size
    volume_type           = var.volume_type
  }

  ami_users = [var.demo_account_id]

  # Ensure the image is private
  ami_groups = []
}

# GCP Builder
source "googlecompute" "ubuntu" {
  project_id          = var.gcp_project_id
  image_name          = "${var.ami_name_prefix}-{{timestamp}}"
  zone                = var.gcp_zone
  ssh_username        = var.ssh_username
  machine_type        = var.machine_type
  source_image_family = var.source_image_family
  disk_size           = var.disk_size
  disk_type           = var.disk_type
  # credentials_file    = var.gcp_credentials_file

  # service_account_email = "github-actions@dev-gcp-451802.iam.gserviceaccount.com"

  # Make the image private
  image_licenses = []
}


# Provisioners to Install and Validate MySQL
build {
  sources = ["source.amazon-ebs.ubuntu", "source.googlecompute.ubuntu", ]

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
