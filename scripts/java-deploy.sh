#!/usr/bin/env bash
echo "Starting deployment..."

remote_host="195.133.49.102"
remote_user="root"
ssh_port="22"

echo "connect to server..."

ssh -i ssh_key "$remote_user"@"$remote_host" << EOF
cd booking-backend-java
git pull
pgrep java | xargs kill -9
chmod +x mvnw
./mvnw clean package

java -jar target/bookingSite-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &
if [ $? -eq 0 ]; then
    echo "Application is now running on port 8080"
    ps -ef | grep java
fi
EOF
