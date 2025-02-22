# Define the required Packer plugins
packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8, <2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
    googlecompute = {
      version = ">= 1.2.8, <2.0.0"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

# Define user variables that reference environment variables
variable "aws_region" {
  default = env("AWS_REGION")
}

variable "aws_instance_type" {
  default = env("AWS_INSTANCE_TYPE")
}

variable "gcp_project_id" {
  default = env("GCP_PROJECT_ID")
}

variable "gcp_zone" {
  default = env("GCP_ZONE")
}

variable "ami_name_prefix" {
  default = env("AMI_NAME_PREFIX")
}

variable "gcp_image_family" {
  default = env("GCP_IMAGE_FAMILY")
}

variable "ubuntu_ami_owner" {
  default = env("UBUNTU_AMI_OWNER")
}

# AWS Builder
source "amazon-ebs" "ubuntu" {
  ami_name      = "${var.ami_name_prefix}-{{timestamp}}"
  instance_type = var.aws_instance_type
  region        = var.aws_region

  source_ami_filter {
    filters = {
      name                = "ubuntu/images/hvm-ssd/ubuntu-jammy-24.04-amd64-server-*"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = [var.ubuntu_ami_owner]
  }

  ssh_username = "ubuntu"

  tags = {
    Name        = "Custom Ubuntu Image"
    Environment = "DEV"
  }

  launch_block_device_mappings {
    device_name = "/dev/sda1"
    volume_size = 20
  }

  # Ensure the image is private
  ami_groups = []
}

# GCP Builder
source "googlecompute" "ubuntu" {
  project_id    = var.gcp_project_id
  machine_type  = "e2-micro"
  source_image  = "ubuntu-2404-lts"
  zone          = var.gcp_zone
  image_name    = "${var.ami_name_prefix}-{{timestamp}}"
  image_family  = var.gcp_image_family
  image_project = "ubuntu-os-cloud"

  # Make the image private
  image_licenses = []
}

# Provisioner to Install MySQL
build {
  sources = ["source.amazon-ebs.ubuntu", "source.googlecompute.ubuntu"]

  provisioner "shell" {
    inline = [
      "sudo apt update",
      "sudo apt install -y mysql-server",
      "sudo systemctl enable mysql",
      "sudo systemctl start mysql",
      "sudo mysql_secure_installation",
      "echo 'MySQL installed successfully!'"
    ]
  }

  # Validate MySQL Installation
  provisioner "shell" {
    inline = [
      "mysql --version"
    ]
  }
}
