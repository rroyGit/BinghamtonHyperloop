#!/bin/bash

loadIP() {
  local IP=$1
  if [[ -n "$IP" ]]; then
    echo $IP > web_server_laptop/IP_Addr.txt
  elif [[ -z "$IP" ]]; then
    IP=$(ip addr | grep 'state UP' -A2 | tail -n1 | awk '{print $2}' | cut -f1  -d'/')
    echo $IP > web_server_laptop/IP_Addr.txt
  fi
  echo $IP
}

ipAddr=""
servicePort=3001
serverPort=3002
mongoPort=27017

echo "Starting..."

read -p "Press enter key to retrieve IP or enter IP now > " IP
echo -e "\tretrieving private IP address"
ipAddr=$(loadIP $IP)

read -p "Press enter key to continue >"
echo -e "\tloading mongo database"
gnome-terminal -- sudo mongod --dbpath ~/data/db

read -p "Press enter key to continue >"
echo -e "\tloading web service"
gnome-terminal -- nodejs ./web_service_laptop/index.js $servicePort mongodb://localhost:$mongoPort/GNCDatabase

read -p "Press enter key to continue >"
echo -e "\tloading web server"
gnome-terminal -- nodejs ./web_server_laptop/index.js $serverPort http://localhost:$servicePort
echo "...done."

echo -e "\tWeb page can be found at [ $ipAddr:$serverPort ]"
