#!/bin/bash

echo set debconf to Noninteractive
echo 'debconf debconf/frontend select Noninteractive' | sudo debconf-set-selections
sudo apt-get update -y && sudo apt-get upgrade -y
# sudo apt-get update -y
sudo apt-get install -y unzip
sudo apt-get install -y mysql-server
sudo systemctl enable --now mysql

echo "Configuring Mysql..."
sudo mysql --user=root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';
FLUSH PRIVILEGES;
EOF

echo "Setting up MySQL database and user..."
sudo mysql -uroot -p"${DB_PASSWORD}" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
FLUSH PRIVILEGES;
EOF

# sudo mysql -e "CREATE DATABASE $DB_NAME;"

sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo node -v
sudo npm -v
echo 'MySQL installed, server enabled, and database created successfully!'