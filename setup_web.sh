#!/bin/bash

# Load environment variables from .env file
ENV_FILE="$HOME/config.env"
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
else
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
fi

# Redirect output to log file
#exec > >(tee -a "$LOG_FILE") 2>&1

# dpkg configure -a
echo "< ------------------- DPKG Configure -a ------------------->"
sudo dpkg --configure -a

# Update and upgrade system
echo "Updating system packages..."
sudo apt update -y && sudo apt upgrade -y

# Install MySQL Server
echo "Installing MySQL Server..."
sudo apt install -y mysql-server

# Enable and start MySQL service
sudo systemctl enable --now mysql

# Secure MySQL Installation (Unattended)
echo "Securing MySQL..."
sudo mysql --user=root <<_EOF_
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_ROOT_PASS';
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
_EOF_

# Set up MySQL database and user
echo "Setting up MySQL database and user..."
sudo mysql -uroot -p$DB_ROOT_PASS <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
FLUSH PRIVILEGES;
EOF

# Install Node.js and npm
echo "Installing Node.js and npm..."
sudo apt install -y nodejs npm unzip

# Create a new Linux group
echo "Creating group: $GROUP_NAME..."
sudo groupadd -f $GROUP_NAME

# Create a new user
echo "Creating user: $USER_NAME..."
sudo useradd -m -g $GROUP_NAME -s /bin/bash $USER_NAME

# Ensure the destination directory exists
echo "Creating application directory at $APP_DIR..."
sudo mkdir -p $APP_DIR

# Unzip the application to /opt/csye6225
echo "Extracting $ZIP_FILE to $APP_DIR..."
sudo unzip -o "$ZIP_FILE" -d "$APP_DIR"

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd $APP_DIR/Sumeet_Rane_002304942_02/webapp/src
sudo npm install

# Update permissions
echo "Updating permissions for $APP_DIR..."
sudo chown -R $USER_NAME:$GROUP_NAME $APP_DIR
sudo chmod -R 750 $APP_DIR

echo "Application setup completed successfully!"
