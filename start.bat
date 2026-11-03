@echo off
cd /d %~dp0
if not exist node_modules call npm install
if not exist data\peacequest.db call npm run seed
call npm run build
start "" http://localhost:4180
npm start

