# TÀI LIỆU ÔN TẬP BẢO VỆ DỰ ÁN & KỊCH BẢN THUYẾT TRÌNH (DÀNH CHO TRƯỞNG NHÓM)
> **Họ và tên:** Nguyễn Mạnh Quân (Leader)  
> **Môn học:** MSS301 - Microservices Architecture (Học kỳ 8)  
> **Dự án:** Hệ thống Quản lý Đặt lịch Khám bệnh MediSync Clinic (MediSync Clinic System)  
> **Nhóm:** 09 (Quân, Nam, Long, Mười, Vũ)  
> **Repository:** `https://github.com/BaoHan260304/Clinic_Appointment_System.git`

---

## 🎙️ PHẦN 1: BỐI CẢNH & KỊCH BẢN MỞ ĐẦU THUYẾT TRÌNH (2 PHÚT)

### 1.1 Lời chào & Giới thiệu đề tài
> *"Kính chào thầy/cô trong Hội đồng phản biện môn MSS301. Em tên là **Nguyễn Mạnh Quân**, trưởng nhóm 05. Hôm nay, nhóm chúng em xin phép được báo cáo và bảo vệ đồ án tốt nghiệp môn học: **Hệ Thống Đặt Lịch Khám Bệnh Đa Khoa MediSync Clinic** theo kiến trúc Microservices."*

### 1.2 Bối cảnh bài toán & Lý do chuyển đổi sang Microservices
> *"Trong thực tế y tế số, các hệ thống phòng khám truyền thống theo mô hình **Monolith** thường xuyên gặp phải tình trạng 'nghẽn cổ chai':*
> 1. *Lượng truy cập đặt lịch tăng vọt vào các khung giờ sáng sớm khiến toàn bộ cơ sở dữ liệu bị lock bảng.*
> 2. *Tác vụ gửi SMS/Email xác nhận hoặc thanh toán trực tuyến bị xử lý đồng bộ (Blocking I/O), làm treo toàn bộ ứng dụng nếu bên thứ ba (VNPay/SMS Gateway) phản hồi chậm.*
> 3. *Hồ sơ bệnh án điện tử cần mức độ bảo mật HIPAA cao hơn các thông tin đăng tin tức thông thường.*
>
> *Chính vì vậy, nhóm 05 đã thiết kế hệ thống **MediSync Clinic** dịch chuyển 100% sang kiến trúc **Microservices** phân tán với 5 tầng rõ rệt: Tầng Client (React + Vite), Tầng Cổng ngõ (Spring Cloud Gateway, Eureka, Config Server), Tầng Nghiệp vụ (6 Microservices độc lập), Tầng Hàng đợi tin nhắn (RabbitMQ), và Tầng Dữ liệu biệt lập (Database per Service trên Docker PostgreSQL).*

### 1.3 Giới thiệu 5 thành viên và thứ tự Demo
> *"Dự án được nhóm phân chia rõ ràng theo nguyên tắc **Full-vertical Slice**: Mỗi thành viên làm chủ **1 Màn hình Giao diện + 1 Microservice Backend + 1 Database tương ứng**:*
> * **1. Em (Quân - Leader):** Điều phối chung hệ thống, phụ trách Gateway (8080), Eureka (8761) và `appointment-service` (8081, DB `appointment_db`). Em sẽ demo luồng **Đặt lịch & Điều phối ca khám** cùng mô hình **SAGA & Giao dịch bù trừ**.*
> * **2. Bạn Nam:** Phụ trách `user-service` (8085, DB `user_db`) - Demo luồng Đăng ký, Đăng nhập, mã hóa BCrypt và cấp phát JWT.*
> * **3. Bạn Long:** Phụ trách `doctor-service` (8082, DB `doctor_db`) - Demo danh mục Bác sĩ, chuyên khoa và quản lý lịch trực / slot khám.*
> * **4. Bạn Mười:** Phụ trách `patient-service` (8084, DB `patient_db`) - Demo Hồ sơ sức khỏe cá nhân và Bệnh án điện tử bảo mật chuẩn HIPAA.*
> * **5. Bạn Vũ:** Phụ trách `payment-service` (8086, DB `payment_db`) & `notification-service` (8083, DB `notification_db`) - Demo Quét mã QR thanh toán viện phí và bắt sự kiện qua RabbitMQ.*
>
> *Sau đây, em xin phép bắt đầu phần demo kịch bản nghiệp vụ của mình."*

---

## 🖥️ PHẦN 2: KỊCH BẢN THAO TÁC DEMO THỰC CHIẾN CỦA QUÂN

*Trước khi demo, đảm bảo hệ thống đã bật qua `START_SERVICES.bat` và mở trình duyệt tại `http://localhost:5173`.*

### Bước 1: Trình diễn Bảng Điều Khiển (Dashboard) & Chuyển đổi 3 vai trò (RBAC)
1. **Góc nhìn Bệnh nhân (`Nguyễn Mạnh Quân`):**
   - Chỉ vào góc phải Header: Đang hiển thị tài khoản **`Nguyễn Mạnh Quân (Bệnh nhân)`**.
   - Tại màn hình **Tổng quan (Dashboard)**: Thuyết minh các chỉ số chỉ mang tính cá nhân: *Lịch hẹn của tôi, Lịch chờ khám, Tổng chi phí đã thanh toán*.
2. **Góc nhìn Bác sĩ & Admin:**
   - Bấm vào Avatar/Switch Role trên Header chuyển sang **Bác sĩ (BS. Nguyễn Văn An)**: Dashboard lập tức chuyển sang góc nhìn ca trực khám, số bệnh nhân chờ khám trong ngày.
   - Chuyển sang **Quản trị viên (Admin)**: Dashboard hiển thị toàn bộ doanh thu phòng khám, tổng số ca khám toàn viện.

### Bước 2: Tạo Lịch Khám Mới (Create Appointment Flow)
1. Chuyển lại vai trò **Bệnh nhân (Nguyễn Mạnh Quân)**.
2. Bấm vào nút màu xanh dương **`+ Đặt lịch khám mới`** (ở Dashboard hoặc tab Quản lý lịch hẹn).
3. Hộp thoại (Modal) hiện lên:
   - Tên bệnh nhân tự động điền: **`Nguyễn Mạnh Quân`**.
   - Chọn chuyên khoa: Ví dụ *Nội khoa* hoặc *Tim mạch*.
   - Chọn ngày khám & khung giờ khám (Slot): *08:00 - 09:00*.
   - Nhập lý do khám: *"Tái khám định kỳ, đau đầu nhẹ"*.
4. Bấm **"Xác nhận đặt lịch"**:
   - Thao tác này gọi API `POST /api/appointments` qua API Gateway (8080) vào `appointment-service` (8081).
   - Hệ thống thông báo thành công. Trên danh sách, lịch hẹn mới xuất hiện ngay với trạng thái màu vàng: **`Chờ duyệt (PENDING)`**.

### Bước 3: Bác Sĩ Duyệt Lịch & Hoàn Tất Buổi Khám
1. Đổi vai trò trên Header sang **Bác sĩ** (hoặc Admin).
2. Vào tab **"Quản lý lịch hẹn"**:
   - Tìm lịch hẹn của bệnh nhân `Nguyễn Mạnh Quân` vừa tạo.
   - Bấm nút **"Duyệt" (Biểu tượng dấu tích xanh)** ➔ Trạng thái chuyển sang màu xanh lá: **`Đã xác nhận (CONFIRMED)`**.
   - *Thuyết minh:* Lúc này, một sự kiện `AppointmentConfirmedEvent` đã được bắn ngầm vào RabbitMQ để gửi thông báo SMS/Email cho bệnh nhân!
3. Giả lập bệnh nhân đã đến phòng khám và khám xong:
   - Bấm nút **"Khám xong" (Biểu tượng ống nghe màu tím)** ➔ Lịch hẹn chuyển sang trạng thái: **`Đã hoàn tất (COMPLETED)`**.

### Bước 4: Thuyết minh Tab "Kiến trúc Microservices"
- Bấm vào tab **"Kiến trúc Microservices"** trên menu trái:
  - Trình chiếu cho giảng viên xem sơ đồ kiến trúc động: Eureka Discovery Server (Port 8761) đang quản lý các instances, API Gateway (Port 8080) làm cổng reverse proxy duy nhất cho client, kết nối tới 6 microservices và message broker RabbitMQ.

---

## 🛠️ PHẦN 3: BẢO VỆ MÃ NGUỒN BACKEND PHỤ TRÁCH (DEEP DIVE CODE DEFENSE)

### 3.1 Dịch vụ cốt lõi: `appointment-service` (Port 8081 - DB: 55432)
*Áp dụng chuẩn kiến trúc **Hexagonal Architecture (Ports & Adapters) + Domain-Driven Design (DDD)**:*

#### A. Mô hình SAGA Pattern & Giao dịch bù trừ (Compensating Transaction)
- **Vị trí code đắt giá:** [`CreateAppointmentUseCase.java`](file:///C:/Users/Quan/Documents/Chuyen%20nganh%20ki%208/MSS301/Code/clinic-appointment-system-main/services/appointment-service/src/main/java/com/group05/appointment/application/usecase/CreateAppointmentUseCase.java#L46-L59)
- **Cơ chế hoạt động:**
  ```java
  // Bước 1: Gọi FeignClient sang doctor-service để giữ chỗ (Book Slot)
  AssignedDoctorSlot assignedSlot = doctorClientPort.assignSlot(
          command.specialization().trim(),
          command.startTime(),
          command.endTime()
  );

  try {
      // Bước 2: Lưu lịch hẹn vào CSDL cục bộ của appointment-service
      return createAppointment(command, assignedSlot, patientId);
  } catch (RuntimeException exception) {
      // BƯỚC BÙ TRỪ (COMPENSATING TRANSACTION):
      // Nếu việc lưu vào DB thất bại (hoặc timeout/lỗi hệ thống),
      // lập tức phát lệnh gọi ngược lại doctor-service để GIẢI PHÓNG SLOT!
      cancelSlotBooking(assignedSlot);
      throw exception;
  }
  ```
- **Giá trị học thuật:** Đảm bảo tính nhất quán cuối cùng (**Eventual Consistency**) giữa 2 database độc lập (`appointment_db` và `doctor_db`) mà không cần đến khóa 2-pha (2PC / Two-Phase Commit - vốn gây nghẽn hiệu năng).

#### B. Giao tiếp liên dịch vụ (Inter-service Communication)
1. **Giao tiếp đồng bộ (Synchronous via OpenFeign):**
   - File: [`DoctorServiceClient.java`](file:///C:/Users/Quan/Documents/Chuyen%20nganh%20ki%208/MSS301/Code/clinic-appointment-system-main/services/appointment-service/src/main/java/com/group05/appointment/infrastructure/client/DoctorServiceClient.java#L15)
   - Sử dụng `@FeignClient(name = "doctor-service-client")` để truy vấn slot, bác sĩ và hủy slot.
   - Tương tự có `PatientServiceClient` và `UserServiceClient`.
2. **Giao tiếp bất đồng bộ (Asynchronous via RabbitMQ):**
   - File: [`AppointmentEventPublisherAdapter.java`](file:///C:/Users/Quan/Documents/Chuyen%20nganh%20ki%208/MSS301/Code/clinic-appointment-system-main/services/appointment-service/src/main/java/com/group05/appointment/infrastructure/messaging/AppointmentEventPublisherAdapter.java#L26-L50)
   - Khi lịch hẹn được tạo, xác nhận hoặc hủy, adapter sử dụng `RabbitTemplate.convertAndSend` đẩy message lên `clinic.exchange` với các routing key:
     - `appointment.created`
     - `appointment.confirmed`
     - `appointment.canceled`
   - `notification-service` ở đầu bên kia lắng nghe và xử lý gửi mail mà không bắt `appointment-service` phải chờ đợi.

---

### 3.2 Tầng Cổng ngõ: `api-gateway` (Port 8080)
*Xây dựng trên nền tảng **Spring Cloud Gateway (Spring WebFlux Non-blocking Reactive)***:

#### A. Bộ lọc bảo mật & Chống giả mạo Header: [`JwtUserHeaderGatewayFilter.java`](file:///C:/Users/Quan/Documents/Chuyen%20nganh%20ki%208/MSS301/Code/clinic-appointment-system-main/infra/api-gateway/src/main/java/com/group05/apigateway/security/JwtUserHeaderGatewayFilter.java#L39-L52)
- **Nhiệm vụ:**
  1. Đóng vai trò là **Security Gateway**: Kiểm tra chữ ký JWT tập trung.
  2. **Chống tấn công Header Spoofing:** Xóa sạch mọi header `X-User-Id`, `X-User-Roles` do client bên ngoài tự gửi lên:
     ```java
     headers.remove(SecurityHeaders.USER_ID);
     headers.remove(SecurityHeaders.USER_EMAIL);
     headers.remove(SecurityHeaders.USER_ROLES);
     ```
  3. Trích xuất thông tin định danh từ JWT Token hợp lệ và đính kèm vào Header chuẩn để chuyển tiếp xuống các microservice nghiệp vụ:
     - `X-User-Id: <UUID>`
     - `X-User-Roles: ROLE_PATIENT,ROLE_DOCTOR...`
     - `X-User-Email: ...`
- **Lợi ích:** Các microservice phía sau hoàn toàn tin cậy vào Header này, không phải tốn tài nguyên giải mã lại JWT hay truy vấn lại DB xác thực.

#### B. Bộ lọc Distributed Tracing: [`CorrelationIdFilter.java`](file:///C:/Users/Quan/Documents/Chuyen%20nganh%20ki%208/MSS301/Code/clinic-appointment-system-main/infra/api-gateway/src/main/java/com/group05/apigateway/filter/CorrelationIdFilter.java#L19-L30)
- Thiết lập độ ưu tiên cao nhất (`Ordered: -200`).
- Tự động sinh `X-Correlation-Id` (UUID) cho mỗi request và chuyển tiếp xuyên suốt chuỗi gọi qua các Microservice.
- Giúp dev/ops dễ dàng truy vết một luồng request khi gặp sự cố trên hệ thống phân tán.

---

### 3.3 Tầng Đăng ký & Khám phá dịch vụ: `eureka-server` (Port 8761)
- Sử dụng **Netflix Eureka Server**.
- Quản lý trạng thái sống còn của tất cả các instances thông qua cơ chế **Heartbeat (mặc định 30 giây gửi 1 lần)**.
- Tích hợp với Spring Cloud LoadBalancer giúp Gateway tự động cân bằng tải đến các instance đang khỏe mạnh.

---

## ❓ PHẦN 4: BỘ CÂU HỎI PHẢN BIỆN "GẮT" DÀNH CHO TRƯỞNG NHÓM (LEADER DEFENSE Q&A)

### Câu 1: Tại sao hệ thống này bắt buộc phải dùng Microservices thay vì Monolith?
* **Trả lời:**
  > *"Dạ thưa thầy/cô, hệ thống phòng khám có các đặc tính tải và nghiệp vụ rất bất đối xứng:*
  > 1. *Tác vụ **Đặt lịch (Appointment)** và **Xem thông tin bác sĩ (Doctor)** có tần suất đọc/ghi cực lớn vào đầu giờ sáng, cần khả năng mở rộng (Scale Out) độc lập.*
  > 2. *Tác vụ **Bệnh án (Patient)** đòi hỏi tuân thủ nghiêm ngặt chuẩn an toàn thông tin y tế (HIPAA), tách biệt cơ sở dữ liệu giúp cô lập rủi ro nếu các service khác bị xâm nhập.*
  > 3. *Tác vụ **Gửi thông báo (Notification)** và **Thanh toán (Payment)** tích hợp với dịch vụ bên thứ ba (SMS/VNPay) có độ trễ không ổn định. Tách thành Microservice bất đồng bộ qua RabbitMQ giúp việc nghẽn mạng bên thứ ba không bao giờ làm sập luồng đặt lịch cốt lõi của phòng khám."*

### Câu 2: Mô hình SAGA trong dự án hoạt động theo Orchestration hay Choreography?
* **Trả lời:**
  > *"Dạ thưa thầy/cô, hệ thống của nhóm kết hợp linh hoạt cả hai:*
  > * **SAGA Orchestration:** Áp dụng tại luồng **Đặt lịch khám** trong `CreateAppointmentUseCase`. Ở đây, `appointment-service` đóng vai trò là **Orchestrator** điều phối trực tiếp lệnh đặt slot sang `doctor-service` qua OpenFeign. Nếu bước sau lỗi, chính nó chủ động phát lệnh bù trừ `cancelSlotBooking` để rollback dữ liệu.*
  > * **SAGA Choreography (Event-driven):** Áp dụng tại luồng **Gửi thông báo & Cập nhật thanh toán**. `appointment-service` chỉ việc phát sinh sự kiện `AppointmentConfirmedEvent` lên RabbitMQ Exchange, `notification-service` tự động consume để xử lý mà không cần Orchestrator can thiệp."*

### Câu 3: Nếu `doctor-service` bị sập đột ngột khi bệnh nhân đang ấn đặt lịch thì sao?
* **Trả lời:**
  > *"Dạ, khi `doctor-service` không phản hồi, OpenFeign client trong `DoctorClientAdapter` sẽ bắn ra ngoại lệ `DoctorServiceUnavailableException` (thuộc tầng Application Exception). Khối `@Transactional` trong `CreateAppointmentUseCase` sẽ không commit dữ liệu vào `appointment_db`, và API Gateway sẽ trả về mã lỗi HTTP 503 hoặc 400 có cấu trúc rõ ràng cho Frontend. Nhờ đó, dữ liệu trong `appointment_db` hoàn toàn không bị rác (Dirty read/write)."*

### Câu 4: Tại sao Gateway đã xử lý JWT rồi mà các Microservices bên trong không query lại Database? Liệu có rủi ro bảo mật không?
* **Trả lời:**
  > *"Dạ thưa thầy/cô, đây là mô hình chuẩn **Edge Authentication & Internal Token Relay**:*
  > * **Tại biên (API Gateway):** Gateway chịu trách nhiệm xác thực chữ ký số RSA/HMAC và thời hạn của JWT Token. Đồng thời, Gateway có bộ lọc `JwtUserHeaderGatewayFilter` chủ động xóa sạch các header giả mạo từ Internet (`headers.remove(USER_ID)`).*
  > * **Tại mạng nội bộ (Internal Network):** Các Microservices được đặt trong mạng Private/VPC hoặc Docker Network an toàn, không mở port trực tiếp ra Internet. Các service này sử dụng `AppointmentServiceFilter` để lấy danh tính từ `SecurityHeaders` đã được Gateway chuẩn hóa. Việc này giúp giảm tải hàng ngàn query thừa thãi vào Database Auth, tăng tốc độ xử lý của từng service lên gấp nhiều lần."*

### Câu 5: Áp dụng Database per Service thì làm thế nào để làm Báo cáo thống kê (Reporting / Analytics) liên bảng?
* **Trả lời:**
  > *"Dạ, trong kiến trúc Microservices, việc thực hiện lệnh `JOIN` qua nhiều CSDL khác nhau là phản mẫu (Anti-pattern). Nhóm em giải quyết theo 2 hướng:*
  > 1. *Đối với hiển thị thời gian thực (Real-time View): Dùng tầng Gateway hoặc Frontend tổng hợp (API Composition) dữ liệu từ các API độc lập.*
  > 2. *Đối với nghiệp vụ Báo cáo lớn: Áp dụng mô hình **CQRS (Command Query Responsibility Segregation)**: Các service phát sự kiện (Events) qua RabbitMQ khi có dữ liệu mới, một Reporting Service chuyên biệt sẽ lắng nghe và đồng bộ dữ liệu về một Read-Database tổng hợp (hoặc Data Warehouse) phục vụ truy vấn tối ưu mà không ảnh hưởng tới CSDL nghiệp vụ OLTP."*

### Câu 6: Eureka Server phát hiện một Microservice bị chết (Crash) bằng cách nào?
* **Trả lời:**
  > *"Dạ, Eureka Client định kỳ gửi tín hiệu sống còn (**Heartbeat**) về Eureka Server (mặc định 30 giây/lần). Nếu sau 90 giây (Lease Expiration Duration) mà Eureka Server không nhận được Heartbeat từ một instance, nó sẽ coi instance đó là down và gỡ bỏ khỏi bảng Registry. API Gateway sẽ được đồng bộ lại danh sách và không điều hướng request vào instance chết đó nữa."*

---

## 🎯 CHECKLIST TRƯỚC GIỜ G DÀNH CHO QUÂN (LEADER)

1. [ ] Mở máy, mở Docker Desktop trước 5 phút.
2. [ ] Nhấp đúp file **`START_SERVICES.bat`** ➔ Gõ `1` ➔ Chờ thông báo thành công.
3. [ ] Mở trình duyệt tại: `http://localhost:5173`.
4. [ ] Mở sẵn file sơ đồ kiến trúc [`SYSTEM_ARCHITECTURE.drawio`](./SYSTEM_ARCHITECTURE.drawio) trên tab trình duyệt hoặc bộ ảnh [`SYSTEM_ARCHITECTURE-1. Kiến Trúc Tổng Quan Hệ Thống.drawio.png`](./SYSTEM_ARCHITECTURE-1.%20Kiến%20Trúc%20Tổng%20Quan%20Hệ%20Thống.drawio.png).
5. [ ] Mở sẵn IntelliJ/VS Code tại 2 file đinh:
   - [`CreateAppointmentUseCase.java`](file:///C:/Users/Quan/Documents/Chuyen%20nganh%20ki%208/MSS301/Code/clinic-appointment-system-main/services/appointment-service/src/main/java/com/group05/appointment/application/usecase/CreateAppointmentUseCase.java) (Để show SAGA compensation).
   - [`JwtUserHeaderGatewayFilter.java`](file:///C:/Users/Quan/Documents/Chuyen%20nganh%20ki%208/MSS301/Code/clinic-appointment-system-main/infra/api-gateway/src/main/java/com/group05/apigateway/security/JwtUserHeaderGatewayFilter.java) (Để show Gateway security).
6. [ ] Phong thái tự tin, dõng dạc, dẫn dắt đồng đội mượt mà!
