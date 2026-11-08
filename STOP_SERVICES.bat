@echo off
chcp 65001 >nul
title MediSync Clinic - Stop All Services
color 0C

set "ROOT_DIR=%~dp0"

echo ================================================================================
echo             DUNG TOAN BO TIEN TRINH HE THONG MEDISYNC CLINIC
echo ================================================================================
echo.
echo [1/3] Dang giai phong cac cong mang (8889, 8761, 8080, 8085, 8082, 8084, 8081, 8086, 8083, 5173)...

powershell -NoProfile -Command ^
  "Get-NetTCPConnection -LocalPort 8889,8761,8080,8085,8082,8084,8081,8086,8083,5173 -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 } | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { taskkill /F /PID $_ }" >nul 2>&1

echo [2/3] Dang dong cac cua so terminal MediSync...
powershell -NoProfile -Command ^
  "Get-Process cmd, java, node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like 'MediSync*' } | ForEach-Object { taskkill /F /PID $_.Id }" >nul 2>&1

echo [3/3] Dung Docker Containers (6 DBs + RabbitMQ)...
cd /d "%ROOT_DIR%"
docker compose stop appointment-db doctor-db notification-db patient-db user-db payment-db rabbitmq 2>nul

echo.
echo ================================================================================
echo        [HOAN TAT] TAT CA CAC TIEN TRINH DA DUOC DUNG VA GIAI PHONG PORT!
echo ================================================================================
echo.
pause
