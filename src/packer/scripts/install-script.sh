#!/bin/bash

echo set debconf to Noninteractive
echo 'debconf debconf/frontend select Noninteractive' | sudo debconf-set-selections
sudo apt-get update -y && sudo apt-get upgrade -y
# sudo apt-get update -y
sudo apt-get install -y unzip
sudo apt-get install -y mysql-server
sudo systemctl enable --now mysql
sudo mysql -e "CREATE DATABASE $DB_NAME;"
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo node -v
sudo npm -v
echo 'MySQL installed, server enabled, and database created successfully!'