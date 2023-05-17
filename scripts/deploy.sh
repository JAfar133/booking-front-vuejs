#!/usr/bin/env bash

remote_host="195.133.49.102"
remote_user="root"
ssh_port="22"
ssh_path="C:/Users/golov/.ssh/ssh_key"

ssh -i $ssh_path "$remote_user"@"$remote_host" << EOF
echo "Starting deployment..."
cd booking-front-vuejs
git pull
sudo apt-get update
echo "Starting build..."
npm i
npm run build
echo "App was built"

sudo cp -r /root/booking-front-vuejs/dist/* /var/www/booking/
EOF


