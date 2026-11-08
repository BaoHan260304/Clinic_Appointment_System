@echo off
title MediSync Clinic - Web Frontend (MSS301)
echo ========================================================
echo   KHOI DONG GIAO DIEN PHONG KHAM MEDISYNC (MSS301)
echo   Tac gia: Do Minh Quan
echo   Frontend URL: http://localhost:5173
echo   API Gateway : http://localhost:8080
echo ========================================================
cd /d "%~dp0client\clinic-web"
npm run dev
pause
