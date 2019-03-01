#!/usr/bin/env bash
sleep 5
openrc boot
chmod +x code.sh
mkdir /var/www
mkdir /var/www/live
cd /var/www/live
git init
git pull https://$token@$git
./code.sh
sleep 50000