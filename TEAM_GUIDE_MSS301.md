# PHÂN CHIA MÀN HÌNH & CHỨC NĂNG DEMO NHÓM 05 (MSS301)
> **Môn học:** MSS301 - Microservices Architecture  
> **Dự án:** Hệ thống Quản lý Đặt lịch Khám bệnh MediSync Clinic  
> **Nguyên tắc phân chia:** **Mỗi thành viên sở hữu 1 Màn hình giao diện (UI) + 1 Microservice Backend + Database tương ứng** để trực tiếp thao tác demo trước hội đồng chấm thi!

---

## 🖥️ BẢNG PHÂN CHIA 5 MÀN HÌNH DEMO CHO 5 THÀNH VIÊN

| STT | Thành viên | Màn hình Giao diện (UI) Demo | Thao tác Demo cụ thể trước Giảng viên | Microservice Backend & DB phụ trách |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Nguyễn Mạnh Quân** *(Leader)* | **Màn hình 1: Bảng Điều Khiển Tổng Quan (Dashboard) & Điều Phối Lịch Hẹn**<br>*(Tab "Tổng quan" & Tab "Quản lý lịch hẹn")* | 1. Trình diễn chuyển đổi 3 góc nhìn vai trò (**Bệnh nhân ➔ Bác sĩ ➔ Admin**) trên Header.<br>2. Bấm **"Đặt lịch khám mới"** ➔ Tạo lịch ở trạng thái `Chờ duyệt` (Pending).<br>3. Chuyển sang quyền Bác sĩ bấm **"Duyệt"** (Confirmed) ➔ Bấm **"Khám xong"** (Completed).<br>4. Mở Tab **"Kiến trúc Microservices"** thuyết minh cụm Gateway & Eureka. | • `services/appointment-service` (Port 8081)<br>• `infra/api-gateway` (Port 8080)<br>• `infra/eureka-server` (Port 8761)<br>• DB: `appointment_db` (Port 55432) |
| **2** | **Nam** | **Màn hình 2: Đăng Ký, Đăng Nhập & Phân Quyền Bảo Mật**<br>*(Trang riêng toàn màn hình "LoginView" & Hộp thoại "Tài Khoản & Xác Thực")* | 1. Bấm nút **"Trang Đăng Nhập / Đăng Ký"** trên Header hoặc menu Sidebar ➔ Chuyển sang màn hình riêng của Nam.<br>2. Demo tab **"Đăng Ký Tài Khoản"**: Tạo bệnh nhân mới (chọn nhóm máu, dị ứng) hoặc bác sĩ mới (chuyên khoa).<br>3. Demo tab **"Đăng Nhập"**: Trình diễn đăng nhập 1-Click hoặc nhập form, giải thích cơ chế JWT Access Token & Refresh Token, mật khẩu mã hóa BCrypt.<br>4. Bấm **"Quay lại trang chủ"** để trở về chế độ phòng khám. | • `services/user-service` (Port 8085)<br>• `shared/common-security`<br>• DB: `user_db` (Port 55436) |
| **3** | **Long** | **Màn hình 3: Đội Ngũ Bác Sĩ & Lịch Trực Chuyên Khoa**<br>*(Tab "Bác sĩ & Lịch làm")* | 1. Trình diễn danh bạ bác sĩ: BS Nguyễn Văn An (Nội khoa), BS Trần Thị Bích (Tim mạch), BS Lê Hoàng Minh (Nhi khoa), BS Phạm Thu Hương (Da liễu).<br>2. Thuyết minh thông tin phòng khám (Phòng 201), các ngày trực trong tuần, giá khám niêm yết.<br>3. Demo bấm **"Đặt lịch"** trực tiếp với bác sĩ được chọn.<br>4. Khi đổi sang vai trò Bác sĩ: Thẻ của BS Nguyễn Văn An hiển thị huy hiệu phát sáng **`🩺 HỒ SƠ CỦA BẠN (Đang đăng nhập)`**. | • `services/doctor-service` (Port 8082)<br>• DB: `doctor_db` (Port 55433) |
| **4** | **Mười** | **Màn hình 4: Hồ Sơ Sức Khỏe & Bệnh Án Điện Tử**<br>*(Tab "Hồ sơ bệnh nhân")* | 1. Khi ở quyền Bệnh nhân: Thao tác chứng minh tính năng bảo mật **HIPAA**: Bệnh nhân chỉ xem được **Hồ sơ sức khỏe cá nhân của chính mình** (Nguyễn Mạnh Quân - Nhóm máu O+, Dị ứng Penicillin).<br>2. Khi đổi sang quyền Bác sĩ / Admin: Hiển thị danh bạ bệnh nhân điều trị ➔ Bấm nút **"Xem bệnh án"** mở Modal hiển thị chẩn đoán, tiền sử y tế. | • `services/patient-service` (Port 8084)<br>• DB: `patient_db` (Port 55435) |
| **5** | **Vũ** | **Màn hình 5: Thanh Toán Viện Phí (QR VNPAY) & Hộp Thư Thông Báo (RabbitMQ)**<br>*(Tab "Thanh toán viện phí" & Tab "Lịch sử thông báo")* | 1. Mở tab **Thanh toán viện phí**: Chọn một hóa đơn chưa thanh toán ➔ Bấm **"Quét mã QR trả phí"** ➔ Quét mã QR giả lập thanh toán ➔ Trạng thái chuyển thành `Đã hoàn tất` (PAID) và tổng doanh thu tăng lên tức thì.<br>2. Mở tab **Lịch sử thông báo**: Trình diễn các sự kiện Email/SMS được Notification Service tự động bắt từ hàng đợi RabbitMQ khi có lịch hẹn mới. | • `services/payment-service` (Port 8086)<br>• `services/notification-service` (Port 8083)<br>• RabbitMQ Broker (Port 5672/15672)<br>• DB: `payment_db` (`55437`), `notification_db` (`55434`) |

---

## 📂 THƯ MỤC SOURCE CODE TƯƠNG ỨNG CỦA TỪNG THÀNH VIÊN
*(Mỗi người chỉ chỉnh sửa trong thư mục của mình để không bao giờ bị conflict)*:

* **Quân:** `client/clinic-web/src/views/DashboardView.jsx`, `client/clinic-web/src/views/AppointmentsView.jsx`, `services/appointment-service`, `infra/api-gateway`, `infra/eureka-server`.
* **Nam:** `client/clinic-web/src/views/LoginView.jsx`, `client/clinic-web/src/components/AuthModal.jsx`, `services/user-service`, `shared/common-security`.
* **Long:** `client/clinic-web/src/views/DoctorsView.jsx`, `services/doctor-service`.
* **Mười:** `client/clinic-web/src/views/PatientsView.jsx`, `services/patient-service`.
* **Vũ:** `client/clinic-web/src/views/PaymentsView.jsx`, `client/clinic-web/src/views/NotificationsView.jsx`, `services/payment-service`, `services/notification-service`.

---

## ⚡ HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG DỄ DÀNG BẰNG FILE SCRIPT (.BAT)

Nhóm đã chuẩn bị sẵn 2 file script tự động hóa 100% tại thư mục gốc:

### Cách 1: Khởi động 1-Click tự động theo đúng thứ tự (Khuyến nghị)
1. **Clone repo về máy:**
   ```bash
   git clone https://github.com/BaoHan260304/Clinic_Appointment_System.git
   cd Clinic_Appointment_System
   ```
2. **Nhấp đúp chuột vào file `START_SERVICES.bat`** tại thư mục gốc:
   - Nhập **`1`** và ấn Enter để khởi động **TOÀN BỘ Hệ Thống** theo đúng chuẩn thứ tự:
     - *Bước 1:* Bật Docker (6 PostgreSQL DBs + RabbitMQ)
     - *Bước 2:* Config Server (Port 8889)
     - *Bước 3:* Eureka Discovery Server (Port 8761)
     - *Bước 4:* 3 Core Services (`user-service:8085`, `doctor-service:8082`, `patient-service:8084`)
     - *Bước 5:* 3 Business & Event Services (`appointment-service:8081`, `payment-service:8086`, `notification-service:8083`)
     - *Bước 6:* API Gateway (Port 8080) và Web Frontend (Port 5173).
3. **Khi cần dừng toàn bộ:** Nhấp đúp file **`STOP_SERVICES.bat`** hoặc chọn `5` trong menu `START_SERVICES.bat`.

### Cách 2: Khởi động giao diện nhanh (Mock/Test nhanh UI)
- Nhấp đúp file **`START_UI.bat`** để chỉ chạy riêng Frontend Web tại `http://localhost:5173`.

---

## 🗄️ CƠ CHẾ DATABASE PER SERVICE & HƯỚNG DẪN KẾT NỐI (DATAGRIP / DBEAVER)

Hệ thống áp dụng chuẩn kiến trúc **Database per Service**: Mỗi microservice sở hữu một Database PostgreSQL hoàn toàn độc lập, không dùng chung schema, giúp đảm bảo tính đóng gói (Encapsulation) và chống phụ thuộc dữ liệu.

### 1. Bảng Phân Chia Database Cho Từng Người:

| Thành viên | Tên Database | Port kết nối Host | User / Mật khẩu | Các Bảng dữ liệu chính phụ trách |
| :--- | :--- | :---: | :---: | :--- |
| **Nam** | `user_db` | **`55436`** | `postgres` / `123` | `users`, `roles`, `user_roles`, `refresh_tokens` |
| **Quân** | `appointment_db` | **`55432`** | `postgres` / `123` | `appointments`, `appointment_status_history` |
| **Long** | `doctor_db` | **`55433`** | `postgres` / `123` | `doctors`, `slots`, `doctor_schedules`, `doctor_leaves` |
| **Mười** | `patient_db` | **`55435`** | `postgres` / `123` | `patients`, `medical_records`, `prescriptions` |
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

---

## 🎤 HƯỚNG DẪN THUYẾT TRÌNH & DEMO CHI TIẾT CHO THÀNH VIÊN 4: MƯỜI

### 1. Thông Tin Trọng Tâm Phụ Trách:
* **Màn hình Web:** Tab **"Hồ sơ bệnh nhân"** (`client/clinic-web/src/views/PatientsView.jsx`).
* **Microservice Backend:** `services/patient-service` (Spring Boot 3.3, chạy ở cổng **8084**).
* **Database riêng:** `patient_db` (PostgreSQL Host Port **`55435`**, các bảng: `patients`, `medicalrecords`, `prescriptions`).
* **Khái niệm trọng tâm thuyết minh:** **Bảo mật y tế theo chuẩn HIPAA (Health Insurance Portability and Accountability Act)** & **Phân quyền RBAC (Role-Based Access Control)**.

---

### 2. Kịch Bản & Các Bước Thao Tác Demo Trực Tiếp Trước Giảng Viên:

#### 🔹 Bước 1: Trình diễn ở Quyền Bệnh Nhân (Role: PATIENT)
1. **Mở Tab "Hồ sơ bệnh nhân"** trên thanh Menu bên trái (đang ở góc nhìn Bệnh nhân - Nguyễn Mạnh Quân).
2. **Thuyết minh trước Thầy/Cô:**
   > *"Thưa Thầy/Cô, em là Mười, phụ trách Microservice `patient-service` và phân hệ Quản lý Hồ sơ Sức khỏe Cá nhân & Bệnh án Điện tử. Trong y tế số, tiêu chuẩn bảo mật HIPAA quy định nghiêm ngặt rằng dữ liệu sức khỏe là thông tin nhạy cảm cấp cao, bệnh nhân chỉ được phép xem hồ sơ của chính mình."*
3. **Chỉ vào thông tin trên màn hình:**
   * Tên bệnh nhân: **Nguyễn Mạnh Quân** (Mã BN: `p2010000-0000-0000-0000-000000000001`).
   * Nhóm máu: **O+** (Badge xanh dương y tế).
   * Cảnh báo tiền sử dị ứng thuốc nghiêm trọng: **Dị ứng Penicillin** (Hệ thống tự động cảnh báo cấm kê kháng sinh Beta-lactam).
   * Lịch sử khám gần nhất: Viêm họng hạt cấp, đơn thuốc Azithromycin 500mg (thay thế an toàn cho Penicillin).
4. **Bấm Nút Demo Trực Tiếp:**
   * Bấm nút **"Thử truy cập hồ sơ bệnh nhân khác (Test HIPAA)"**.
   * Hệ thống hiển thị Modal cảnh báo màu đỏ: **`403 FORBIDDEN - TRUY CẬP BỊ TỪ CHỐI`**.
   * Thuyết minh: *"Em bấm nút này để chứng minh `patient-service` đã chặn truy vấn dữ liệu chéo bằng HTTP 403 Forbidden theo chuẩn HIPAA. Bệnh nhân Quân hoàn toàn không thể xem danh bạ hay bệnh án của người khác."*

#### 🔹 Bước 2: Chuyển sang Quyền Bác Sĩ / Admin (Role: DOCTOR / ADMIN)
1. **Lên Header, bấm chuyển vai trò sang "Bác sĩ" hoặc "Quản trị viên"**.
2. **Giao diện tự động chuyển đổi:**
   * Thanh trạng thái hiển thị: `🩺 Chế độ Bác sĩ điều trị / Quản trị viên: Toàn quyền xem danh bạ & bệnh án`.
   * Hiển thị bảng **Danh sách Hồ sơ Bệnh nhân Toàn viện** gồm các bệnh nhân: Nguyễn Mạnh Quân, Hoàng Mai Linh, Vũ Tuấn Kiệt...
3. **Thao tác xem bệnh án điện tử:**
   * Bấm nút **"Xem bệnh án"** tại một bệnh nhân (ví dụ: Hoàng Mai Linh hoặc Nguyễn Mạnh Quân).
   * Modal **"Hồ Sơ Bệnh Án Điện Tử (EHR)"** mở ra, hiển thị đầy đủ:
     - Ngày sinh, giới tính, nhóm máu, cảnh báo dị ứng.
     - Chẩn đoán lâm sàng, huyết áp, nhịp tim, thân nhiệt, SpO2.
     - Đơn thuốc chỉ định có liều lượng, tần suất và thời gian điều trị.
     - Bác sĩ phụ trách ký duyệt.

---

### 3. Bộ Câu Hỏi Vấn Đáp Thường Gặp & Cách Trả Lời:

* **Câu hỏi 1: Làm thế nào `patient-service` bảo vệ dữ liệu theo chuẩn HIPAA ở tầng Backend?**
  * *Trả lời:* Ở Backend `patient-service`, trong `PatientController`, các API nhạy cảm như `GET /api/patients` (lấy danh sách toàn viện) đều được kiểm tra vai trò bằng `requireAnyRole("DOCTOR", "ADMIN")`. Nếu một bệnh nhân gọi vào đây hoặc cố truy cập bệnh án của bệnh nhân khác qua `GET /api/patients/{patientId}/medical-records`, hàm `authorizeRecordRead()` sẽ so khớp ID người dùng trong JWT qua `CurrentUserHolder`. Nếu ID không trùng khớp, service ném `SecurityException` và `GlobalExceptionHandler` trả về HTTP `403 FORBIDDEN`.

* **Câu hỏi 2: Database của em lưu trữ những bảng nào?**
  * *Trả lời:* Database của em là `patient_db` (Port 55435), gồm 3 bảng chính:
    1. `patients`: Lưu thông tin định danh bệnh nhân (Họ tên, ngày sinh, giới tính, thông tin liên lạc, nhóm máu, dị ứng).
    2. `medicalrecords`: Lưu lịch sử khám, chẩn đoán lâm sàng, chỉ số sinh tồn và ghi chú bác sĩ.
    3. `prescriptions`: Lưu đơn thuốc kê toa (tên thuốc, liều dùng, tần suất, thời gian dùng).
    Toàn bộ bảng được tự động khởi tạo bằng công cụ **Flyway Migration**.

---

## 🎤 HƯỚNG DẪN THUYẾT TRÌNH & DEMO CHI TIẾT CHO THÀNH VIÊN 2: NAM

### 1. Thông Tin Trọng Tâm Phụ Trách:
* **Màn hình Web:** Hộp thoại **"Tài Khoản & Xác Thực"** (`client/clinic-web/src/components/AuthModal.jsx`).
* **Microservice Backend:** `services/user-service` (Spring Boot 3.3, chạy ở cổng **8085**) & thư viện dùng chung `shared/common-security`.
* **Cửa ngõ Gateway phối hợp:** `infra/api-gateway` (Spring Cloud Gateway, cổng **8080**).
* **Database riêng:** `user_db` (PostgreSQL Host Port **`55436`**, các bảng: `users`, `roles`, `user_roles`, `refresh_tokens`).
* **Khái niệm trọng tâm thuyết minh:**
  1. **Gateway Offloading & Context Propagation:** Xác thực chữ ký số JWT tập trung tại API Gateway, giải mã và gắn thông tin người dùng vào Request Headers (`X-User-Id`, `X-User-Roles`, `X-User-Email`) chuyển tiếp cho các service nội bộ.
  2. **Cơ chế Token Kép (Dual-Token Architecture):** Access Token ngắn hạn (15 phút) Stateless + Refresh Token dài hạn (7 ngày) Stateful lưu trong CSDL.
  3. **Thu hồi Token (Token Revocation):** Vô hiệu hóa phiên đăng nhập tức thì khi người dùng Đăng xuất bằng cách đánh dấu thu hồi Refresh Token.
  4. **Bảo mật Mật khẩu (Password Hashing):** Sử dụng thuật toán **BCrypt** với Salt ngẫu nhiên 10 rounds (`$2a$10$...`), kháng hoàn toàn Rainbow Table và Brute-force.

---

### 2. Kịch Bản & 3 Thao Tác Demo Trực Tiếp Trước Giảng Viên:

#### 🔹 Thao Tác 1: Bấm Nút "Đăng Xuất" ➔ Màn Hình Về Chế Độ Khách An Toàn
1. **Thao tác trên màn hình:**
   * Khi đang ở trạng thái đăng nhập, di chuột lên góc phải Header và bấm nút **"Đăng xuất"** (hoặc chọn "Đăng xuất" trong dropdown vai trò).
   * Hệ thống hiển thị thông báo toast: *`Bạn đã đăng xuất khỏi hệ thống.`*
   * Giao diện ngay lập tức chuyển về **Chế độ Khách (Guest Mode) / Trang Chủ Tổng Quan Phòng Khám**.
   * Header hiển thị trạng thái `Khách (Chưa đăng nhập)` và nút bấm nổi bật: **"Đăng nhập / Đăng ký"**.
2. **Thuyết minh trước Thầy/Cô:**
   > *"Thưa Thầy/Cô, em là Nam, phụ trách phân hệ Xác thực, Bảo mật và User Service (Port 8085). Thao tác đầu tiên em thực hiện là bấm Đăng xuất. Lúc này, Access Token trong trình duyệt bị xóa, đồng thời hệ thống gửi yêu cầu thu hồi Refresh Token tại `user_db`. Màn hình lập tức đưa về Chế độ Khách an toàn, ẩn toàn bộ thông tin nhạy cảm của bệnh nhân hay bác sĩ, chỉ hiển thị thông tin giới thiệu công khai của phòng khám."*

#### 🔹 Thao Tác 2: Mở Tab "Đăng Ký Tài Khoản" ➔ Đăng Ký Bệnh Nhân Mới Hoặc Bác Sĩ Mới
1. **Thao tác trên màn hình:**
   * Bấm nút **"Đăng nhập / Đăng ký"** trên góc phải Header.
   * Chuyển sang tab **"Đăng Ký Tài Khoản"**.
   * **Trình diễn đăng ký Bệnh nhân mới:**
     - Bấm nút **`⚡ Mẫu Bệnh nhân (Nhóm máu A+)`** (hoặc nhập tay Họ tên: *Trần Bảo Nam*, Email: *nam.patient@example.com*, Mật khẩu: *secret123*).
     - Chỉ vào trường chuyên biệt của Bệnh nhân: **Nhóm máu A+**, **Tiền sử dị ứng: Dị ứng Penicillin & Phấn hoa**.
   * **(Hoặc) Trình diễn đăng ký Bác sĩ mới:**
     - Bấm chọn vai trò **"Bác Sĩ Khám"** hoặc bấm nút **`⚡ Mẫu Bác sĩ (Tim Mạch)`**.
     - Nhập thông tin bác sĩ và chọn chuyên khoa phụ trách: **Tim Mạch**.
   * Bấm nút **"Tạo Tài Khoản & Đăng Nhập"**.
   * Hệ thống thông báo thành công và tự động đăng nhập vào tài khoản vừa tạo.
2. **Thuyết minh trước Thầy/Cô:**
   > *"Tại tab Đăng ký, hệ thống hỗ trợ 2 luồng nghiệp vụ riêng biệt: Bệnh nhân đăng ký kèm nhóm máu và tiền sử dị ứng; Bác sĩ đăng ký kèm chuyên khoa lâm sàng. Khi bấm tạo tài khoản, `user-service` sẽ băm mật khẩu bằng BCrypt, lưu vào bảng `users` trong `user_db` (Port 55436), đồng thời sử dụng `ProfileProvisioningRestClient` đồng bộ tự động sang `patient-service` hoặc `doctor-service` theo kiến trúc Microservices."*

#### 🔹 Thao Tác 3: Mở Tab "Đăng Nhập" ➔ Demo 1-Click / Form & Thuyết Minh JWT, Refresh Token & BCrypt
1. **Thao tác trên màn hình:**
   * Bấm mở hộp thoại **"Tài Khoản & Xác Thực"**, ở tab **"Đăng Nhập"**.
   * Demo đăng nhập nhanh 1-Click: Chọn tài khoản Bệnh nhân (*quan.patient@example.com*), Bác sĩ (*bs.an@clinic.local*), hoặc Admin.
   * Bấm mở khối **"Cơ Chế Bảo Mật: JWT Token & BCrypt (Nam thuyết minh)"** ngay bên dưới form.
2. **Thuyết minh trước Thầy/Cô:**
   > *"Về mặt kiến trúc bảo mật tầng sâu, phân hệ của em đảm bảo 3 nguyên tắc sống còn:
   > 1. **Mật khẩu người dùng:** Không bao giờ lưu văn bản thuần (plain text). Em dùng `BCryptPasswordEncoder` với hệ số Salt 10 rounds sinh chuỗi hash `$2a$10$...`. Mỗi lần hash đều có salt ngẫu nhiên nên hoàn toàn vô hiệu hóa kỹ thuật Rainbow Table.
   > 2. **JWT Access Token:** Có thời hạn ngắn 15 phút, chứa định danh `userId` và danh sách quyền `roles`, được ký số HMAC-SHA256. Để giảm tải cho hệ thống, nhóm áp dụng kỹ thuật **Gateway Offloading**: API Gateway xác thực token một lần duy nhất tại cửa ngõ, sau đó bóc tách thành headers `X-User-Id`, `X-User-Roles` gửi cho các microservices bên trong.
   > 3. **Refresh Token & Thu hồi:** Có thời hạn 7 ngày, lưu trữ trong bảng `refresh_tokens` tại PostgreSQL `user_db` (Port 55436). Khi người dùng bấm Đăng xuất, token này bị thu hồi (Revoke) ngay lập tức, ngăn ngừa hoàn toàn nguy cơ Replay Attack."*

---

### 3. Bộ Câu Hỏi Vấn Đáp Thường Gặp Cho Nam & Cách Trả Lời Điểm Tối Đa:

* **Câu hỏi 1: Tại sao nhóm lại dùng mô hình 2 Token (Access Token 15 phút và Refresh Token 7 ngày) thay vì dùng 1 token dài hạn?**
  * *Trả lời:* Access Token là **Stateless**, mỗi request gửi lên Gateway được kiểm tra bằng chữ ký số trong bộ nhớ RAM mà không cần truy vấn Database, giúp hệ thống đạt hiệu năng cao và độ trễ cực thấp. Tuy nhiên, vì Stateless nên ta không thể thu hồi (revoke) nó trước khi nó tự hết hạn. Do đó, nhóm giới hạn Access Token chỉ sống **15 phút** để giảm thiểu thiệt hại nếu bị lộ. Ngược lại, Refresh Token sống **7 ngày** nhưng là **Stateful** (được lưu trong CSDL `user_db`). Khi Access Token hết hạn, client gửi Refresh Token về `POST /auth/refresh` để xin cấp cặp token mới. Nếu tài khoản bị xâm nhập hoặc người dùng bấm Đăng xuất, ta chỉ cần cập nhật cột `revoked_at` của Refresh Token trong Database là vô hiệu hóa phiên ngay lập tức.

* **Câu hỏi 2: API Gateway và các Microservices nội bộ phối hợp xác thực như thế nào (Gateway Offloading)?**
  * *Trả lời:* Khi client gửi request kèm `Authorization: Bearer <JWT>`, bộ lọc `JwtUserHeaderGatewayFilter` tại API Gateway (Port 8080) sẽ kiểm tra chữ ký số HMAC-SHA256. Nếu hợp lệ, Gateway trích xuất `userId`, `email`, `roles` từ payload JWT rồi gắn vào Request Headers nội bộ (`X-User-Id`, `X-User-Roles`, `X-User-Email`) trước khi định tuyến tới service đích (ví dụ `appointment-service`). Các service bên trong chỉ cần tích hợp thư viện `shared/common-security`, lớp `CurrentUserHeaderFilter` sẽ tự động đọc các Header này và nạp vào ThreadLocal thông qua `CurrentUserHolder`. Nhờ đó, các service nội bộ không phải giải mã JWT lặp đi lặp lại, tiết kiệm tài nguyên CPU đáng kể.

* **Câu hỏi 3: Tại sao lại chọn BCrypt để mã hóa mật khẩu thay vì SHA-256 hay MD5?**
  * *Trả lời:* Các hàm băm như MD5 hay SHA-256 được thiết kế để tính toán rất nhanh (cho việc kiểm tra toàn vẹn file), nên máy tính hiện đại có thể thử hàng tỷ hash mỗi giây (bị bẻ khóa bằng GPU hoặc Rainbow Table). Ngược lại, **BCrypt** là thuật toán băm chậm thích ứng (Adaptive Slow-Hashing Algorithm), tự động sinh một chuỗi **Salt 128-bit** ngẫu nhiên gắn kèm vào hash và cho phép cấu hình Work Factor (nhóm em dùng cost 10, tức $2^{10} = 1024$ vòng lặp băm). Điều này làm cho việc dò mật khẩu bằng Brute-Force hoặc Rainbow Table trở nên bất khả thi về mặt thời gian và kinh tế.

* **Câu hỏi 4: Database `user_db` của em gồm những bảng nào và quan hệ giữa chúng ra sao?**
  * *Trả lời:* Database `user_db` (PostgreSQL Port **55436**) gồm 4 bảng được thiết kế chuẩn hóa 3NF và tự động quản lý bởi Flyway:
    1. `users`: Khóa chính `id (UUID)`, lưu `email`, `full_name`, `phone_number`, `password_hash`, `status`.
    2. `roles`: Khóa chính `id (UUID)`, lưu tên vai trò định danh (`ADMIN`, `DOCTOR`, `PATIENT`).
    3. `user_roles`: Bảng liên kết trung gian biểu diễn quan hệ nhiều - nhiều (N:N) giữa `users` và `roles`.
    4. `refresh_tokens`: Khóa chính `id (UUID)`, khóa ngoại liên kết tới `users(id)`, lưu `token_hash`, thời hạn `expires_at`, và mốc thu hồi `revoked_at`.

* **Câu hỏi 5: Khi một người dùng mới đăng ký trên màn hình của em, làm sao các service khác như Doctor hay Patient biết được thông tin đó?**
  * *Trả lời:* Trong `user-service`, sau khi `RegisterUseCase` tạo thành công bản ghi User và băm mật khẩu trong `user_db`, hệ thống sử dụng `ProfileProvisioningRestClient` (giao tiếp HTTP đồng bộ nội bộ) để gọi sang `patient-service` (`POST /api/patients`) nếu role là `PATIENT` (kèm nhóm máu, dị ứng), hoặc gọi sang `doctor-service` (`POST /api/doctors`) nếu role là `DOCTOR` (kèm chuyên khoa). Việc tách rời này đảm bảo nguyên lý **Database per Service** - mỗi service chỉ sở hữu và toàn quyền quản lý dữ liệu nghiệp vụ của riêng mình.
