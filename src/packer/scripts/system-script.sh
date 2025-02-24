#!/bin/bash

sudo groupadd csye6225
sudo useradd csye6225 --shell /usr/sbin/nologin -g csye6225
sudo cp /tmp/webapp.service /etc/systemd/system/
sudo cp /tmp/webapp.zip /opt/
sudo unzip /opt/webapp.zip -d /opt/webapp
cd /opt/webapp/src

env_values=$(cat <<END
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST

END
)

echo "$env_values" | sudo tee .env >/dev/null

sudo chown -R csye6225:csye6225 /opt/webapp
sudo chown csye6225:csye6225 .env
sudo npm install
sudo chown csye6225:csye6225 node_modules

sudo systemctl daemon-reload
sudo systemctl enable webapp.service