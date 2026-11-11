@echo off
chcp 65001 >nul
title MediSync Clinic - Microservices Starter (MSS301 - Nhom 05)
color 0B

set "ROOT_DIR=%~dp0"
if not defined JAVA_HOME set "JAVA_HOME=D:\JDK21"
set "PATH=%PATH%;C:\Program Files\maven-mvnd-1.0.2-windows-amd64\mvn\bin;C:\Users\Ta Muoi\AppData\Local\Programs\DockerDesktop\resources\bin"

:menu
cls
echo ================================================================================
echo         HE THONG DAT LICH KHAM BENH MEDISYNC CLINIC (MSS301 - NHOM 05)
echo   Truong nhom: Nguyen Manh Quan (Leader) ^| Thanh vien: Nam, Muoi, Long, Vu
echo ================================================================================
echo.
echo   [1] Khoi dong TOAN BO he thong (Docker -^> Config -^> Eureka -^> 6 Services -^> Gateway -^> UI)
echo   [2] Khoi dong Ha tang (Docker DBs + Config Server + Eureka + API Gateway)
echo   [3] Khoi dong 6 Microservices Nghiep vu (User, Doctor, Patient, Appt, Pay, Notif)
echo   [4] Khoi dong Rieng Web Frontend (Vite React - Port 5173)
echo   [5] DUNG TOAN BO He Thong (Tat toan bo tien trinh Java, Node va Docker)
echo   [6] Build lai thu vien dung chung (mvn clean install -DskipTests)
echo   [0] Thoat
echo.
echo ================================================================================
set "choice="
if not "%1"=="" (
    set "choice=%1"
) else (
    set /p choice="Nhap lua chon cua ban [0-6] va an Enter: "
)

if "%choice%"=="1" goto :start_all
if "%choice%"=="2" goto :start_infra
if "%choice%"=="3" goto :start_services
if "%choice%"=="4" goto :start_ui
if "%choice%"=="5" goto :stop_all
if "%choice%"=="6" goto :build_shared
if "%choice%"=="0" goto :exit
goto :menu

REM ================================================================================
REM 1. KHOI DONG TOAN BO HE THONG THEO THU TU CHUAN
REM ================================================================================
:start_all
cls
echo ================================================================================
echo          TIEN TRINH KHOI DONG TOAN BO HE THONG MEDISYNC CLINIC
echo ================================================================================
echo.

REM Kiem tra thu vien dung chung
call :check_shared_libs

REM Buoc 1: Docker Containers
echo [BUOC 1/6] Khoi dong Co so du lieu PostgreSQL va RabbitMQ (Docker)...
docker info >nul 2>&1
if errorlevel 1 (
    echo [CANH BAO] Docker Desktop chua bat hoac chua chay!
    echo Vui long mo Docker Desktop truoc neu cac service bao loi ket noi CSDL.
) else (
    docker compose up -d appointment-db doctor-db notification-db patient-db user-db payment-db rabbitmq 2>nul
    echo [OK] 6 Container PostgreSQL va RabbitMQ da san sang!
)
ping 127.0.0.1 -n 4 >nul

REM Buoc 2: Config Server
echo.
echo [BUOC 2/6] Khoi dong Config Server tren port 8889...
start "MediSync - 1. Config Server [8889]" /D "%ROOT_DIR%infra\config-server" cmd /k "mvn spring-boot:run"
echo Dang cho Config Server khoi tao cau hinh (12 giay)...
ping 127.0.0.1 -n 13 >nul

REM Buoc 3: Eureka Server
echo.
echo [BUOC 3/6] Khoi dong Eureka Discovery Server tren port 8761...
start "MediSync - 2. Eureka Server [8761]" /D "%ROOT_DIR%infra\eureka-server" cmd /k "mvn spring-boot:run"
echo Dang cho Eureka Server san sang (10 giay)...
ping 127.0.0.1 -n 11 >nul

REM Buoc 4: Core Domain Services
echo.
echo [BUOC 4/6] Khoi dong Core Microservices (User, Doctor, Patient)...
start "MediSync - 3. User Service [8085]" /D "%ROOT_DIR%services\user-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul
start "MediSync - 4. Doctor Service [8082]" /D "%ROOT_DIR%services\doctor-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul
start "MediSync - 5. Patient Service [8084]" /D "%ROOT_DIR%services\patient-service" cmd /k "mvn spring-boot:run"
echo Cho Core Services dang ky vao Eureka (6 giay)...
ping 127.0.0.1 -n 7 >nul

REM Buoc 5: Transaction & Event Services
echo.
echo [BUOC 5/6] Khoi dong Transaction ^& Event Services (Appointment, Payment, Notification)...
start "MediSync - 6. Appointment Service [8081]" /D "%ROOT_DIR%services\appointment-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul
start "MediSync - 7. Payment Service [8086]" /D "%ROOT_DIR%services\payment-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul
start "MediSync - 8. Notification Service [8083]" /D "%ROOT_DIR%services\notification-service" cmd /k "mvn spring-boot:run"
echo Cho Business Services khoi tao xong (6 giay)...
ping 127.0.0.1 -n 7 >nul

REM Buoc 6: API Gateway & Frontend
echo.
echo [BUOC 6/6] Khoi dong API Gateway (Port 8080) va Web Frontend (Port 5173)...
start "MediSync - 9. API Gateway [8080]" /D "%ROOT_DIR%infra\api-gateway" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 5 >nul

call :launch_ui

call :show_success_panel
goto :menu

REM ================================================================================
REM 2. CHI KHOI DONG HA TANG (Docker + Config + Eureka + Gateway)
REM ================================================================================
:start_infra
cls
echo ================================================================================
echo           KHOI DONG HA TANG (INFRASTRUCTURE SERVICES)
echo ================================================================================
call :check_shared_libs

echo [1/4] Khoi dong Docker DBs ^& RabbitMQ...
docker compose up -d appointment-db doctor-db notification-db patient-db user-db payment-db rabbitmq 2>nul
ping 127.0.0.1 -n 3 >nul

echo [2/4] Khoi dong Config Server (8889)...
start "MediSync - 1. Config Server [8889]" /D "%ROOT_DIR%infra\config-server" cmd /k "mvn spring-boot:run"
echo Doi Config Server (10 giay)...
ping 127.0.0.1 -n 11 >nul

echo [3/4] Khoi dong Eureka Server (8761)...
start "MediSync - 2. Eureka Server [8761]" /D "%ROOT_DIR%infra\eureka-server" cmd /k "mvn spring-boot:run"
echo Doi Eureka Server (8 giay)...
ping 127.0.0.1 -n 9 >nul

echo [4/4] Khoi dong API Gateway (8080)...
start "MediSync - 9. API Gateway [8080]" /D "%ROOT_DIR%infra\api-gateway" cmd /k "mvn spring-boot:run"

echo.
echo [OK] Ha tang da khoi dong thanh cong!
pause
goto :menu

REM ================================================================================
REM 3. KHOI DONG 6 MICROSERVICES NGHIEP VU
REM ================================================================================
:start_services
cls
echo ================================================================================
echo             KHOI DONG 6 MICROSERVICES NGHIEP VU
echo ================================================================================
call :check_shared_libs

echo Khoi dong User Service [8085]...
start "MediSync - 3. User Service [8085]" /D "%ROOT_DIR%services\user-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul

echo Khoi dong Doctor Service [8082]...
start "MediSync - 4. Doctor Service [8082]" /D "%ROOT_DIR%services\doctor-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul

echo Khoi dong Patient Service [8084]...
start "MediSync - 5. Patient Service [8084]" /D "%ROOT_DIR%services\patient-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul

echo Khoi dong Appointment Service [8081]...
start "MediSync - 6. Appointment Service [8081]" /D "%ROOT_DIR%services\appointment-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul

echo Khoi dong Payment Service [8086]...
start "MediSync - 7. Payment Service [8086]" /D "%ROOT_DIR%services\payment-service" cmd /k "mvn spring-boot:run"
ping 127.0.0.1 -n 3 >nul

echo Khoi dong Notification Service [8083]...
start "MediSync - 8. Notification Service [8083]" /D "%ROOT_DIR%services\notification-service" cmd /k "mvn spring-boot:run"

echo.
echo [OK] Tat ca 6 microservices da duoc kich hoat!
pause
goto :menu

REM ================================================================================
REM 4. KHOI DONG CHI GIAO DIEN WEB FRONTEND
REM ================================================================================
:start_ui
cls
call :launch_ui
echo.
echo Frontend da khoi dong tai http://localhost:5173
pause
goto :menu

REM ================================================================================
REM 5. DUNG TOAN BO HE THONG
REM ================================================================================
:stop_all
cls
echo ================================================================================
echo                DUNG TOAN BO TIEN TRINH MEDISYNC CLINIC
echo ================================================================================
echo.
echo Dang giai phong cac cong (8889, 8761, 8080, 8085, 8082, 8084, 8081, 8086, 8083, 5173)...

powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8889,8761,8080,8085,8082,8084,8081,8086,8083,5173 -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 } | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { taskkill /F /PID $_ }" >nul 2>&1

echo Dang dong cac cua so terminal MediSync...
powershell -NoProfile -Command "Get-Process cmd, java, node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like 'MediSync*' } | ForEach-Object { taskkill /F /PID $_.Id }" >nul 2>&1

echo.
set "stop_doc="
set /p stop_doc="Ban co muon dung ca Docker Containers (Postgres, RabbitMQ) khong? (y/n): "
if /i "%stop_doc%"=="y" (
    docker compose stop appointment-db doctor-db notification-db patient-db user-db payment-db rabbitmq 2>nul
    echo [OK] Docker containers da dung.
)

echo.
echo [HOAN TAT] Tat ca cac tien trinh cua he thong da duoc dung sach se!
pause
goto :menu

REM ================================================================================
REM 6. BUILD THU VIEN DUNG CHUNG
REM ================================================================================
:build_shared
cls
echo ================================================================================
echo           BUILD CAC MODULE DUNG CHUNG (SHARED LIBRARIES) VAO .M2
echo ================================================================================
echo.
cd /d "%ROOT_DIR%"
echo Dang chay: mvn clean install -DskipTests ...
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [LOI] Qua trinh build that bai! Vui long kiem tra JDK 21 va Maven.
) else (
    echo.
    echo [OK] Build thanh cong tat ca cac module shared va cai dat vao .m2!
)
pause
goto :menu

REM ================================================================================
REM HELPER FUNCTIONS
REM ================================================================================
:check_shared_libs
if not exist "%USERPROFILE%\.m2\repository\com\group05\common-security\1.0-SNAPSHOT" (
    echo [THONG BAO] Phat hien chua build thu vien shared: common-security, common-events, common-web
    echo Dang tu dong chay 'mvn install -DskipTests' lan dau de cai vao .m2...
    cd /d "%ROOT_DIR%"
    call mvn install -DskipTests -q
    echo [OK] Da cai dat xong cac thu vien shared vao .m2!
    echo.
)
exit /b 0

:launch_ui
if not exist "%ROOT_DIR%client\clinic-web\node_modules" (
    echo [THONG BAO] Chua phat hien node_modules trong client/clinic-web.
    echo Dang tu dong cai dat npm packages...
    cd /d "%ROOT_DIR%client\clinic-web"
    call npm install
)
start "MediSync - 10. Web Frontend [5173]" /D "%ROOT_DIR%client\clinic-web" cmd /k "npm run dev"
exit /b 0

:show_success_panel
cls
echo ================================================================================
echo       HE THONG PHONG KHAM MEDISYNC CLINIC DA KHOI DONG THANH CONG!
echo ================================================================================
echo.
echo   * GIAO DIEN NGUOI DUNG (WEB): http://localhost:5173
echo   * API GATEWAY ENTRYPOINT    : http://localhost:8080
echo   * EUREKA REGISTRY DASHBOARD : http://localhost:8761
echo   * CONFIG SERVER             : http://localhost:8889
echo   * RABBITMQ MANAGEMENT       : http://localhost:15672 (admin / admin)
echo.
echo   DANH SACH MICROSERVICES DANG CHAY:
echo   ----------------------------------------------------------------------------
echo   1. User ^& Auth Service      : http://localhost:8085  (DB: 55436)
echo   2. Doctor Service           : http://localhost:8082  (DB: 55433)
echo   3. Patient Service          : http://localhost:8084  (DB: 55435)
echo   4. Appointment Service      : http://localhost:8081  (DB: 55432)
echo   5. Payment Service          : http://localhost:8086  (DB: 55437)
echo   6. Notification Service     : http://localhost:8083  (DB: 55434)
echo.
echo   TAI KHOAN DEMO (RBAC TEST):
echo   * Benh nhan: quan.patient@example.com / 123456 (Nguyen Manh Quan)
echo   * Bac si   : nam.doctor@example.com   / 123456 (BS. Tran Van Nam)
echo   * Quan tri : admin@clinic.com         / admin123
echo ================================================================================
echo.
set "open_web="
set /p open_web="Ban co muon tu dong mo Trinh duyet den trang chu khong? (y/n): "
if /i "%open_web%"=="y" (
    start http://localhost:5173
)
exit /b 0

:exit
exit /b 0
