#!/usr/bin/env bash

remote_host="195.133.49.102"
remote_user="root"
ssh_port="22"

ssh -i ssh_key "$remote_user"@"$remote_host" << EOF
echo "Starting deployment..."
cd booking-front-vuejs
git pull

echo "Starting build..."
npm run build
echo "App was built"

sudo cp -r /root/booking-front-vuejs/dist/* /var/www/booking/
EOF


