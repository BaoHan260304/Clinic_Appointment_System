# PHÂN CHIA MÀN HÌNH & CHỨC NĂNG DEMO NHÓM 09 (MSS301)
> **Môn học:** MSS301 - Microservices Architecture  
> **Dự án:** Hệ thống Quản lý Đặt lịch Khám bệnh MediSync Clinic  
> **Nguyên tắc phân chia:** **Mỗi thành viên sở hữu 1 Màn hình giao diện (UI) + 1 Microservice Backend + Database tương ứng** để trực tiếp thao tác demo trước hội đồng chấm thi!

---

## 🖥️ BẢNG PHÂN CHIA 5 MÀN HÌNH DEMO CHO 5 THÀNH VIÊN

| STT | Thành viên | Màn hình Giao diện (UI) Demo | Thao tác Demo cụ thể trước Giảng viên | Microservice Backend & DB phụ trách |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Nguyễn Mạnh Quân** *(Leader)* | **Màn hình 1: Bảng Điều Khiển Tổng Quan (Dashboard) & Điều Phối Lịch Hẹn**<br>*(Tab "Tổng quan" & Tab "Quản lý lịch hẹn")* | 1. Trình diễn chuyển đổi 3 góc nhìn vai trò (**Bệnh nhân ➔ Bác sĩ ➔ Admin**) trên Header.<br>2. Bấm **"Đặt lịch khám mới"** ➔ Tạo lịch ở trạng thái `Chờ duyệt` (Pending).<br>3. Chuyển sang quyền Bác sĩ bấm **"Duyệt"** (Confirmed) ➔ Bấm **"Khám xong"** (Completed).<br>4. Mở Tab **"Kiến trúc Microservices"** thuyết minh cụm Gateway & Eureka. | • `services/appointment-service` (Port 8081)<br>• `infra/api-gateway` (Port 8080)<br>• `infra/eureka-server` (Port 8761)<br>• DB: `appointment_db` (Port 55432) |
| **2** | **Nam** | **Màn hình 2: Đăng Ký, Đăng Nhập & Phân Quyền Bảo Mật**<br>*(Hộp thoại "Tài Khoản & Xác Thực")* | 1. Bấm nút **"Đăng xuất"** ➔ Hệ thống về chế độ Khách an toàn.<br>2. Demo tab **"Đăng Ký Tài Khoản"**: Tạo bệnh nhân mới (chọn nhóm máu, dị ứng) hoặc bác sĩ mới (chuyên khoa).<br>3. Demo tab **"Đăng Nhập"**: Trình diễn đăng nhập 1-Click hoặc nhập form, giải thích cơ chế JWT Access Token & Refresh Token, mật khẩu mã hóa BCrypt. | • `services/user-service` (Port 8085)<br>• `shared/common-security`<br>• DB: `user_db` (Port 55436) |
| **3** | **Long** | **Màn hình 3: Đội Ngũ Bác Sĩ & Lịch Trực Chuyên Khoa**<br>*(Tab "Bác sĩ & Lịch làm")* | 1. Trình diễn danh bạ bác sĩ: BS Nguyễn Văn An (Nội khoa), BS Trần Thị Bích (Tim mạch), BS Lê Hoàng Minh (Nhi khoa), BS Phạm Thu Hương (Da liễu).<br>2. Thuyết minh thông tin phòng khám (Phòng 201), các ngày trực trong tuần, giá khám niêm yết.<br>3. Demo bấm **"Đặt lịch"** trực tiếp với bác sĩ được chọn.<br>4. Khi đổi sang vai trò Bác sĩ: Thẻ của BS Nguyễn Văn An hiển thị huy hiệu phát sáng **`🩺 HỒ SƠ CỦA BẠN (Đang đăng nhập)`**. | • `services/doctor-service` (Port 8082)<br>• DB: `doctor_db` (Port 55433) |
| **4** | **Mười** | **Màn hình 4: Hồ Sơ Sức Khỏe & Bệnh Án Điện Tử**<br>*(Tab "Hồ sơ bệnh nhân")* | 1. Khi ở quyền Bệnh nhân: Thao tác chứng minh tính năng bảo mật **HIPAA**: Bệnh nhân chỉ xem được **Hồ sơ sức khỏe cá nhân của chính mình** (Nguyễn Mạnh Quân - Nhóm máu O+, Dị ứng Penicillin).<br>2. Khi đổi sang quyền Bác sĩ / Admin: Hiển thị danh bạ bệnh nhân điều trị ➔ Bấm nút **"Xem bệnh án"** mở Modal hiển thị chẩn đoán, tiền sử y tế. | • `services/patient-service` (Port 8084)<br>• DB: `patient_db` (Port 55435) |
| **5** | **Vũ** | **Màn hình 5: Thanh Toán Viện Phí (QR VNPAY) & Hộp Thư Thông Báo (RabbitMQ)**<br>*(Tab "Thanh toán viện phí" & Tab "Lịch sử thông báo")* | 1. Mở tab **Thanh toán viện phí**: Chọn một hóa đơn chưa thanh toán ➔ Bấm **"Quét mã QR trả phí"** ➔ Quét mã QR giả lập thanh toán ➔ Trạng thái chuyển thành `Đã hoàn tất` (PAID) và tổng doanh thu tăng lên tức thì.<br>2. Mở tab **Lịch sử thông báo**: Trình diễn các sự kiện Email/SMS được Notification Service tự động bắt từ hàng đợi RabbitMQ khi có lịch hẹn mới. | • `services/payment-service` (Port 8086)<br>• `services/notification-service` (Port 8083)<br>• RabbitMQ Broker (Port 5672/15672)<br>• DB: `payment_db` (`55437`), `notification_db` (`55434`) |

---

## 📂 THƯ MỤC SOURCE CODE TƯƠNG ỨNG CỦA TỪNG THÀNH VIÊN
*(Mỗi người chỉ chỉnh sửa trong thư mục của mình để không bao giờ bị conflict)*:

* **Quân:** `client/clinic-web/src/views/DashboardView.jsx`, `client/clinic-web/src/views/AppointmentsView.jsx`, `services/appointment-service`, `infra/api-gateway`, `infra/eureka-server`.
* **Nam:** `client/clinic-web/src/components/AuthModal.jsx`, `services/user-service`, `shared/common-security`.
* **Long:** `client/clinic-web/src/views/DoctorsView.jsx`, `services/doctor-service`.
* **Mười:** `client/clinic-web/src/views/PatientsView.jsx`, `services/patient-service`.
* **Vũ:** `client/clinic-web/src/views/PaymentsView.jsx`, `client/clinic-web/src/views/NotificationsView.jsx`, `services/payment-service`, `services/notification-service`.

---

## ⚡ HƯỚNG DẪN 3 BƯỚC ĐỂ TỪNG THÀNH VIÊN TỰ CHẠY MÁY MÌNH

1. **Clone repo:**
   ```bash
   git clone https://github.com/BaoHan260304/Clinic_Appointment_System.git
   cd Clinic_Appointment_System
   ```
2. **Bật Database & RabbitMQ:**
   ```bash
   docker compose up -d appointment-db doctor-db patient-db user-db payment-db notification-db rabbitmq
   ```
3. **Chạy Web UI:**
   Nhấp đúp file **`START_UI.bat`** tại thư mục gốc để mở `http://localhost:5173`.
   *(Mỗi người chỉ việc chọn màn hình của mình trên Sidebar và thực hiện các bước demo như bảng trên!)*

---

## 🗄️ CƠ CHẾ DATABASE PER SERVICE & HƯỚNG DẪN KẾT NỐI (DATAGRIP / DBEAVER)

Hệ thống áp dụng chuẩn kiến trúc **Database per Service**: Mỗi microservice sở hữu một Database PostgreSQL hoàn toàn độc lập, không dùng chung schema, giúp đảm bảo tính đóng gói (Encapsulation) và chống phụ thuộc dữ liệu.

### 1. Bảng Phân Chia Database Cho Từng Người:

| Thành viên | Tên Database | Port kết nối Host | User / Mật khẩu | Các Bảng dữ liệu chính phụ trách |
| :--- | :--- | :---: | :---: | :--- |
| **Nam** | `user_db` | **`55436`** | `postgres` / `123` | `users`, `roles`, `user_roles`, `refresh_tokens` |
| **Quân** | `appointment_db` | **`55432`** | `postgres` / `123` | `appointments`, `appointment_status_history` |
| **Long** | `doctor_db`<br>`patient_db` | **`55433`**<br>**`55435`** | `postgres` / `123`<br>`postgres` / `123` | `doctors`, `slots`, `doctor_schedules`, `doctor_leaves`<br>`patients`, `medical_records` |
| **Vũ** | `payment_db`<br>`notification_db` | **`55437`**<br>**`55434`** | `postgres` / `123`<br>`postgres` / `123` | `payments`, `invoices`, `transactions`<br>`notifications`, `notification_logs` |
| **Tất cả** | **RabbitMQ Broker** | **`15672`** (Web)<br>**`5672`** (AMQP) | `guest` / `guest` | Exchange: `clinic.exchange`, Queues: `notification.*` |

---

### 2. Thành viên có cần tự tạo bảng hay import file SQL không?
👉 **HOÀN TOÀN KHÔNG CẦN! Hệ thống đã tích hợp sẵn Flyway Migration tự động 100%:**
* Khi các bạn chạy lệnh `docker compose up -d`, Docker sẽ tự động dựng 6 Database PostgreSQL rỗng.
* Khi từng bạn bấm **Run** service của mình trên IntelliJ, thư viện **Flyway Migration** (nằm trong thư mục `src/main/resources/db/migration/`) sẽ tự động kết nối, tự động tạo toàn bộ bảng, khóa chính, khóa ngoại và nạp sẵn dữ liệu mẫu ban đầu (bác sĩ, phòng khám, bệnh nhân).
* Bạn không cần phải mở terminal gõ SQL hay lo lắng việc thiếu dữ liệu!

---

### 3. Cách Kết Nối DataGrip / DBeaver / pgAdmin Để Xem Bảng & Trả Lời Vấn Đáp:
Khi thầy cô yêu cầu: *"Mở Database cho tôi xem bảng dữ liệu của em"*, các bạn mở **DataGrip** hoặc **DBeaver** và tạo kết nối PostgreSQL như sau:

* **Host:** `localhost`
* **Port:** Điền đúng Port của mình ở bảng trên (Ví dụ Nam điền `55436`, Long điền `55433`, ...).
* **Database:** Điền đúng tên DB của mình (Ví dụ: `user_db`, `doctor_db`, ...).
* **User:** `postgres`
* **Password:** `123`
* Bấm **Test Connection** ➔ Báo `Succeeded` ➔ Bấm **OK** để duyệt bảng dữ liệu.
