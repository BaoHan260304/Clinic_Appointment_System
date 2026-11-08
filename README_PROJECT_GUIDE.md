# HƯỚNG DẪN DỰ ÁN HỆ THỐNG PHÒNG KHÁM MEDISYNC (MSS301)
> **Môn học:** MSS301 - Microservices Architecture  
> **Sinh viên thực hiện:** Đỗ Minh Quân  
> **Kiến trúc:** Spring Boot Microservices + Clean Architecture + Event-Driven (RabbitMQ) + React Frontend (Vite)

---

## 1. TỔNG QUAN HỆ THỐNG
Dự án được xây dựng theo chuẩn kiến trúc doanh nghiệp:
* **Hạ tầng (Infra):**
  * `api-gateway`: Cổng kết nối duy nhất (Port 8080), giải mã JWT, điều phối request và bảo vệ endpoint nội bộ.
  * `eureka-server`: Service Discovery (Port 8761) giúp các service tìm nhau.
  * `config-server`: Quản lý cấu hình tập trung (Port 8888/8889).
  * `rabbitmq`: Message Broker (Port 5672 / 15672) xử lý thông báo bất đồng bộ.
* **Các Service Nghiệp vụ (Services):**
  * `user-service` (Port 8085): Quản lý tài khoản, mã hóa mật khẩu BCrypt, cấp phát JWT & Refresh token.
  * `appointment-service` (Port 8081): Nghiệp vụ đặt lịch khám, hủy lịch, xác nhận lịch, quản lý trạng thái.
  * `doctor-service` (Port 8082): Quản lý hồ sơ bác sĩ, ca trực và các khung giờ (slot) khám.
  * `patient-service` (Port 8084): Quản lý thông tin bệnh nhân, tiền sử dị ứng, nhóm máu, bệnh án điện tử.
  * `payment-service` (Port 8086): Quản lý hóa đơn viện phí, cổng thanh toán VNPay/MoMo.
  * `notification-service` (Port 8083): Nhận event từ RabbitMQ và tự động gửi Email/SMS.
* **Giao diện Web (Client):**
  * `client/clinic-web`: Giao diện React + Vite (Port 5173), thiết kế theo phong cách y tế hiện đại, có chế độ Gateway Live và Chế độ Demo nhanh.

---

## 2. CÁCH KHỞI ĐỘNG HỆ THỐNG

### Cách 1: Chạy Hạ Tầng (Databases + RabbitMQ) bằng Docker
Mở PowerShell tại thư mục gốc của dự án và chạy:
```bash
docker compose up -d appointment-db doctor-db patient-db user-db payment-db notification-db rabbitmq
```

### Cách 2: Chạy Toàn Bộ Hệ Thống bằng Docker Compose
```bash
docker compose up --build -d
```

### Cách 3: Chạy Giao Diện Web (Frontend)
1. Double click file `START_UI.bat` ở thư mục gốc.
2. Hoặc mở terminal gõ:
   ```bash
   cd client/clinic-web
   npm run dev
   ```
3. Truy cập trình duyệt: `http://localhost:5173`

---

## 3. CÁC TÍNH NĂNG NỔI BẬT ĐỂ DEMO VỚI GIẢNG VIÊN

1. **Chế độ Linh hoạt (Gateway Live / Demo Mode):**
   * Ngay trên thanh Header có nút chuyển đổi giữa **Gateway Live (Port 8080)** và **Chế độ Demo Tự động**. Nếu đang demo mà backend chưa bật hoặc bị lỗi mạng, bạn chỉ cần bấm nút này là toàn bộ dữ liệu mẫu sẽ hiển thị mượt mà, không bao giờ bị đứng bài!
2. **Chuyển đổi vai trò người dùng (Role Switcher):**
   * Chuyển đổi nhanh giữa: **Bệnh nhân (Patient)**, **Bác sĩ (Doctor)** và **Quản trị viên (Admin)** để test các góc nhìn khác nhau.
3. **Luồng Đặt Lịch & Thanh Toán Hoàn Chỉnh:**
   * Vào tab **"Quản lý lịch hẹn"** -> Bấm **"Đặt Lịch Khám Mới"**.
   * Chọn Bác sĩ, ngày khám, khung giờ và lý do khám.
   * Lịch hẹn được tạo ở trạng thái `PENDING`.
   * Bấm nút **"Duyệt"** để xác nhận lịch hẹn (`CONFIRMED`).
   * Bấm nút **"Đóng phí"** -> Quét mã QR mô phỏng thanh toán viện phí -> Trạng thái thanh toán đổi sang `PAID`.
4. **Sơ Đồ Kiến Trúc Trực Quan (Tab "Kiến trúc Microservices"):**
   * Hiển thị đầy đủ sơ đồ từ Client -> Gateway -> Eureka -> 6 Services -> RabbitMQ -> Database riêng biệt để trả lời câu hỏi vấn đáp của thầy cô.
