# HƯỚNG DẪN DỰ ÁN & PHÂN CHIA CÔNG VIỆC NHÓM 09 (MSS301)
> **Môn học:** MSS301 - Microservices Architecture  
> **Đề tài:** Hệ thống Quản lý Đặt lịch Khám bệnh Đa khoa (MediSync Clinic System)  
> **Repository:** `https://github.com/BaoHan260304/Clinic_Appointment_System.git`  
> **Nhánh làm việc chính:** `main`

---

## 👥 BẢNG PHÂN CHIA MODULE & TRÁCH NHIỆM 5 THÀNH VIÊN

Để tránh xung đột mã nguồn (Merge Conflict) khi làm việc đồng thời trên Git, mỗi thành viên chịu trách nhiệm riêng biệt về một hoặc hai Microservice và Database tương ứng:

| STT | Thành viên | Vai trò | Module & Thư mục phụ trách | Port & Database | Công nghệ & Nghiệp vụ cốt lõi |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Nguyễn Mạnh Quân** *(Leader)* | **Fullstack & Cổng Gateway** | • `infra/api-gateway`<br>• `infra/eureka-server`<br>• `client/clinic-web`<br>• `shared/common-web` | **Port 8080** (Gateway)<br>**Port 8761** (Eureka)<br>**Port 5173** (Web UI) | • Spring Cloud Gateway, JWT Header Routing<br>• Eureka Service Discovery<br>• Giao diện React + Vite, RBAC 3 vai trò (Bệnh nhân, Bác sĩ, Admin) |
| **2** | **Nam** | **Xác thực & Bảo mật (Auth & Security)** | • `services/user-service`<br>• `shared/common-security` | **Port 8085**<br>DB: `user_db` (Port `55436`) | • Clean Architecture / DDD<br>• Cấp phát JWT & Refresh Token, mã hóa BCrypt<br>• Phân quyền Role (PATIENT, DOCTOR, ADMIN) |
| **3** | **Mười** | **Giao dịch & Lịch hẹn (Core Transaction)** | • `services/appointment-service`<br>• `shared/common-events` | **Port 8081**<br>DB: `appointment_db` (Port `55432`) | • Máy trạng thái lịch hẹn (`PENDING` -> `CONFIRMED` -> `COMPLETED`)<br>• Gọi FeignClient sang Doctor/Patient<br>• Bắn Event qua RabbitMQ (`clinic.exchange`) |
| **4** | **Long** | **Dữ liệu Y tế (Master Profiles)** | • `services/doctor-service`<br>• `services/patient-service` | **Port 8082** & **Port 8084**<br>DB: `doctor_db` (`55433`)<br>DB: `patient_db` (`55435`) | • Quản lý hồ sơ bác sĩ, chuyên khoa, phòng khám, slot khám<br>• Quản lý bệnh án điện tử, nhóm máu, tiền sử dị ứng theo chuẩn HIPAA |
| **5** | **Vũ** | **Thanh toán & Sự kiện (Finance & Events)** | • `services/payment-service`<br>• `services/notification-service`<br>• `infra/config-server` | **Port 8086** (Payment)<br>**Port 8083** (Notif)<br>**Port 8889** (Config)<br>DB: `payment_db` (`55437`)<br>DB: `notification_db` (`55434`) | • Hóa đơn viện phí, cổng thanh toán giả lập QR VNPAY<br>• Lắng nghe RabbitMQ Consumer gửi Email/SMS<br>• Quản lý cấu hình tập trung Config Server |

---

## 🛠️ HƯỚNG DẪN CLONE & CÀI ĐẶT MÔI TRƯỜNG DÀNH CHO CẢ NHÓM

### Bước 1: Yêu cầu môi trường máy tính
Mọi thành viên cần cài sẵn:
1. **Git**
2. **JDK 21** (Khuyến nghị Eclipse Temurin hoặc Oracle JDK 21)
3. **Docker Desktop** (Bật sẵn Docker để chạy Database và RabbitMQ)
4. **Node.js 18+ hoặc 20+** (Để chạy giao diện Web)
5. **IntelliJ IDEA** (Bản Community hoặc Ultimate đều được)

### Bước 2: Clone repository về máy
Mở Terminal / PowerShell và gõ:
```bash
git clone https://github.com/BaoHan260304/Clinic_Appointment_System.git
cd Clinic_Appointment_System
```

### Bước 3: Khởi động Hạ tầng Docker (Databases & RabbitMQ)
Tại thư mục gốc của dự án, chạy lệnh:
```bash
docker compose up -d appointment-db doctor-db patient-db user-db payment-db notification-db rabbitmq
```
*Ghi chú:*
* 6 database Postgres sẽ chạy trên các cổng: `55432` đến `55437` với mật khẩu chung là **`123`**, user **`postgres`**.
* RabbitMQ chạy cổng **`5672`** (AMQP) và **`15672`** (Web Dashboard tại `http://localhost:15672`, đăng nhập: `guest` / `guest`).

### Bước 4: Mở dự án trong IntelliJ IDEA
1. Mở IntelliJ -> Chọn **Open** -> Trỏ đến thư mục dự án vừa clone.
2. IntelliJ sẽ tự động nhận diện file `pom.xml` gốc và load 13 modules mang group `com.group09`.
3. Chạy lệnh build kiểm tra:
   ```bash
   mvn clean compile -DskipTests
   ```
   *(Kết quả báo `BUILD SUCCESS` là mã nguồn hoàn toàn chuẩn xác).*

### Bước 5: Chạy Giao Diện Web (Frontend)
Chỉ cần nhấp đúp file **`START_UI.bat`** tại thư mục gốc, hoặc mở terminal gõ:
```bash
cd client/clinic-web
npm install
npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:5173`.

---

## 🚀 THỨ TỰ KHỞI ĐỘNG CÁC SERVICE KHI TEST VÀ DEMO

Khi chạy trên máy tính cá nhân, hãy bật các class `Application` theo thứ tự sau:

1. **`ConfigServerApplication`** (`infra/config-server` - Port 8889)
2. **`EurekaServerApplication`** (`infra/eureka-server` - Port 8761) -> Kiểm tra dashboard tại `http://localhost:8761`.
3. **`UserServiceApplication`** (`services/user-service` - Port 8085)
4. **`DoctorServiceApplication`** (`services/doctor-service` - Port 8082) & **`PatientServiceApplication`** (`services/patient-service` - Port 8084)
5. **`AppointmentServiceApplication`** (`services/appointment-service` - Port 8081)
6. **`PaymentServiceApplication`** (`services/payment-service` - Port 8086) & **`NotificationServiceApplication`** (`services/notification-service` - Port 8083)
7. **`ApiGatewayApplication`** (`infra/api-gateway` - Port 8080)
8. **Frontend Web** (`START_UI.bat` - Port 5173)

---

## 🎯 CẨM NANG ÔN TẬP VẤN ĐÁP BẢO VỆ ĐỒ ÁN (TỪNG THÀNH VIÊN)

### 1. Dành cho BẠN QUÂN (Leader - Gateway, Eureka & Frontend):
* **Câu hỏi 1:** *Cơ chế hoạt động của API Gateway trong dự án là gì?*
  - **Trả lời:** API Gateway là điểm tiếp nhận duy nhất từ Client (Port 8080). Gateway dùng Spring Cloud Gateway kết hợp với Eureka để tự động định tuyến (Routing) request sang các microservice nội bộ theo cú pháp `lb://<TEN-SERVICE>`, đồng thời xác thực giải mã JWT Token trước khi cho request đi vào các service phía sau.
* **Câu hỏi 2:** *Frontend có tính năng gì nổi bật?*
  - **Trả lời:** Frontend xây dựng bằng React + Vite, có hỗ trợ **Chế độ Gateway Live** và **Chế độ Demo Tự động**, đặc biệt triển khai đầy đủ cơ chế phân quyền **RBAC** (Role-Based Access Control) tự thích ứng giao diện theo 3 vai trò: Bệnh nhân, Bác sĩ, Quản trị viên.

### 2. Dành cho BẠN NAM (User Service & Common Security):
* **Câu hỏi 1:** *Mô hình kiến trúc của User Service được tổ chức như thế nào?*
  - **Trả lời:** User Service tuân theo kiến trúc Clean Architecture / DDD, chia làm 3 tầng: `Domain` (chứa Thực thể User, Role, VO Email, Password), `Application` (chứa các Use Case như Login, Register, AssignRole), và `Infrastructure` (Adapter, JPA Entity, BCrypt Encoder).
* **Câu hỏi 2:** *Cơ chế xác thực và bảo vệ token trong hệ thống ra sao?*
  - **Trả lời:** Dùng thuật toán HMAC256 ký JWT Access Token (hạn ngắn) và Refresh Token lưu trong Database để cấp mới khi Access Token hết hạn. Mật khẩu lưu trữ luôn được mã hóa một chiều bằng BCrypt.

### 3. Dành cho BẠN MƯỜI (Appointment Service & Common Events):
* **Câu hỏi 1:** *Vòng đời (State Machine) của một lịch hẹn diễn ra như thế nào?*
  - **Trả lời:** Khi bệnh nhân đặt lịch, lịch hẹn ở trạng thái `PENDING` (Chờ duyệt). Bác sĩ hoặc Admin bấm duyệt sẽ chuyển thành `CONFIRMED`. Khi bệnh nhân đến khám xong, bác sĩ bấm khám xong chuyển thành `COMPLETED`. Nếu có việc đột xuất, có thể chuyển sang `CANCELED`.
* **Câu hỏi 2:** *Hai microservice giao tiếp với nhau bằng những cách nào trong module này?*
  - **Trả lời:** 
    1. **Đồng bộ (Synchronous):** Dùng `OpenFeignClient` gọi trực tiếp sang `doctor-service` để kiểm tra khung giờ và thông tin bác sĩ.
    2. **Bất đồng bộ (Asynchronous):** Bắn `AppointmentCreatedEvent` lên RabbitMQ Exchange (`clinic.exchange`) để gửi sang Notification Service mà không làm nghẽn luồng xử lý chính.

### 4. Dành cho BẠN LONG (Doctor Service & Patient Service):
* **Câu hỏi 1:** *Tại sao lại tách riêng Doctor Service và Patient Service thành 2 database khác nhau?*
  - **Trả lời:** Đây là nguyên tắc **Database-per-Service** cốt lõi của Microservices. Bác sĩ và Bệnh nhân có tần suất truy vấn, tính chất dữ liệu và yêu cầu mở rộng (scalability) khác nhau. Việc tách rời giúp tránh tình trạng khóa bảng (table locking) và đảm bảo tính độc lập (Loose Coupling).
* **Câu hỏi 2:** *Dữ liệu hồ sơ bệnh nhân được bảo mật như thế nào?*
  - **Trả lời:** Theo chuẩn HIPAA, bệnh nhân chỉ được tra cứu thông tin y tế cá nhân của mình (nhóm máu, dị ứng thuốc). Bác sĩ phụ trách điều trị mới được mở toàn văn bệnh án điện tử.

### 5. Dành cho BẠN VŨ (Payment Service, Notification Service & Config Server):
* **Câu hỏi 1:** *Notification Service nhận sự kiện từ RabbitMQ như thế nào?*
  - **Trả lời:** Service cấu hình `@RabbitListener` lắng nghe queue `notification.appointment.created`. Khi Appointment Service bắn message vào exchange, RabbitMQ tự động đẩy message vào queue để Notification Service nhận, phân tích và thực hiện gửi Email/SMS tự động.
* **Câu hỏi 2:** *Vai trò của Spring Cloud Config Server là gì?*
  - **Trả lời:** Config Server (Port 8889) đóng vai trò kho lưu trữ cấu hình tập trung (tại thư mục `clinic-config-repo`). Khi cần thay đổi URL database, secret key hay thông số kết nối, ta chỉ cần sửa trên Config Server mà không cần build hay sửa code của từng microservice.

---

## ⚠️ NGUYÊN TẮC LÀM VIỆC TRÊN GIT (TRÁNH XUNG ĐỘT)

1. **Trước khi bắt đầu code:** Luôn gõ `git pull origin main` để cập nhật code mới nhất từ nhóm.
2. **Chỉ chỉnh sửa đúng thư mục được phân công:**
   - Nam chỉ code trong `services/user-service` và `shared/common-security`.
   - Mười chỉ code trong `services/appointment-service` và `shared/common-events`.
   - Long chỉ code trong `services/doctor-service` và `services/patient-service`.
   - Vũ chỉ code trong `services/payment-service`, `services/notification-service` và `infra/config-server`.
   - Quân quản lý `infra/api-gateway`, `infra/eureka-server` và `client/clinic-web`.
3. **Khi commit:** Ghi message rõ ràng, ví dụ:
   - `git commit -m "feat(user): update login validation"` (Nam)
   - `git commit -m "feat(appointment): add booking reminder event"` (Mười)
4. Nếu gặp lỗi conflict, liên hệ Quân (Leader) để hỗ trợ merge an toàn!
