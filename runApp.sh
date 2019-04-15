#!/bin/bash
sudo mongod --dbpath ~/data/db &
nodejs ./web_service_laptop/index.js 3001 mongodb://localhost:27017/GNCDatabase &
nodejs ./web_server_laptop/index.js 3002 http://localhost:3001 &