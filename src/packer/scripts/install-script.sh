#!/bin/bash

echo set debconf to Noninteractive
echo 'debconf debconf/frontend select Noninteractive' | sudo debconf-set-selections
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y unzip
sudo apt-get install -y jq

# Install AWS CLI 
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

#----------
# sudo apt-get install -y mysql-server
# sudo systemctl enable --now mysql

# echo "Check if DB_PASSWORD and DB_NAME are set"
# if [[ -z "$DB_PASSWORD" || -z "$DB_NAME" ]]; then
#     echo "Error: DB_PASSWORD or DB_NAME is not set."
# fi


# echo "Configuring Mysql..."
# sudo mysql --user=root <<EOF
# ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';
# FLUSH PRIVILEGES;
# EOF

# sleep 3

# sudo systemctl restart mysql

# sleep 3

# echo "Setting up MySQL database and user..."
# sudo mysql -uroot -p"${DB_PASSWORD}" <<EOF
# CREATE DATABASE IF NOT EXISTS $DB_NAME;
# FLUSH PRIVILEGES;
# EOF

#------------------------------------

# #sudo mysql -e "CREATE DATABASE $DB_NAME;"

sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo node -v
sudo npm -v

wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

echo 'Installed NodeJS & CloudWatch Agent Successfully!!'