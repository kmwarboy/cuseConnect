#!/bin/bash
cd ~/Desktop
rm cuseconnect.tar.gz

tar --exclude="./node_modules" --exclude="./.git" -czvf cuseconnect.tar.gz cuseConnect/

scp -i ~/.ssh/cic-demo-2.pem cuseConnect.tar.gz ubuntu@cuseconnect.me:/home/ubuntu/cuseconnect.tar.gz

ssh -i ~/.ssh/cic-demo-2.pem ubuntu@cuseconnect.me tar -xvf /home/ubuntu/cuseconnect.tar.gz
ssh -i ~/.ssh/cic-demo-2.pem ubuntu@cuseconnect.me 'cd cuseConnect && npm install'
ssh -i ~/.ssh/cic-demo-2.pem ubuntu@cuseconnect.me sudo systemctl restart cuseconnect.service

rm cuseconnect.tar.gz

echo to view logs run journalctl -f -u cuseconnect
