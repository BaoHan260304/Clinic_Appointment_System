# HƯỚNG DẪN XEM & XUẤT SƠ ĐỒ HỆ THỐNG TRÊN DRAW.IO (MSS301)
> **Tên hệ thống chính thức:** **Hệ Thống Phòng Khám Đa Khoa MediSync (MediSync Clinic System)**  
> **Môn học:** MSS301 - Microservices Architecture (Nhóm 09)  
> **File sơ đồ gốc Draw.io:** [`SYSTEM_ARCHITECTURE.drawio`](./SYSTEM_ARCHITECTURE.drawio)

---

## 🎨 1. CÁCH MỞ FILE TRỰC TIẾP TRÊN DRAW.IO (3 BƯỚC)

File **`SYSTEM_ARCHITECTURE.drawio`** ở thư mục gốc của dự án đã được thiết kế sẵn chuẩn định dạng XML đa trang (Multi-page).

1. Truy cập vào trang web: 👉 **[https://app.diagrams.net](https://app.diagrams.net)** (Draw.io Online).
2. Chọn **Open Existing Diagram** (hoặc vào menu `File` ➔ `Open from` ➔ `Device`).
3. Chọn file **`SYSTEM_ARCHITECTURE.drawio`** từ máy tính của bạn.
4. **Kết quả:** Draw.io sẽ mở ra sơ đồ tuyệt đẹp với **3 trang (Tab)** ở thanh dưới cùng:
   * **Trang 1: Kiến Trúc Tổng Quan Hệ Thống** (Toàn bộ 5 tầng: Client ➔ Gateway ➔ Eureka/Config ➔ 6 Microservices ➔ RabbitMQ ➔ 6 Database Postgres).
   * **Trang 2: Luồng SAGA Đặt Lịch & Giao Dịch Bù Trừ** (Mô hình SAGA Distributed Transaction: Đặt lịch ➔ Check OpenFeign ➔ Quét QR thanh toán ➔ Compensating Action khi lỗi).
   * **Trang 3: Luồng Xác Thực JWT & Phân Quyền RBAC** (Luồng Login, sinh token HMAC256, chuyển tiếp header và ma trận quyền hạn Bệnh nhân / Bác sĩ / Admin).

---

## 📊 2. SƠ ĐỒ MERMAID (XEM TRỰC TIẾP TRÊN GITHUB HOẶC COPY VÀO DRAW.IO)

Nếu bạn muốn copy mã nguồn để paste vào Draw.io (Menu `Arrange` ➔ `Insert` ➔ `Advanced` ➔ `Mermaid`):

### Sơ Đồ 1: Kiến Trúc Tổng Quan (High-Level Architecture)
```mermaid
flowchart TD
    subgraph CLIENT["1. TẦNG GIAO DIỆN CLIENT (PORT 5173 - REACT + VITE)"]
        direction LR
        P_UI["Bệnh Nhân Portal"]
        D_UI["Bác Sĩ Portal"]
        A_UI["Admin Portal"]
        EXT_PAY["Cổng VNPay / MoMo"]
    end

    subgraph INFRA["2. TẦNG HẠ TẦNG & CỔNG NGÕ (SPRING CLOUD)"]
        direction LR
        GW["API GATEWAY (Port 8080)<br/>JWT Auth Filter & Routing"]
        EUREKA["EUREKA SERVER (Port 8761)<br/>Service Discovery & Heartbeat"]
        CONFIG["CONFIG SERVER (Port 8889)<br/>clinic-config-repo"]
    end

    subgraph SERVICES["3. TẦNG 6 MICROSERVICES NGHIỆP VỤ (SPRING BOOT 3)"]
        direction TB
        S_USER["user-service (8085)<br/>Auth, BCrypt, JWT, Roles"]
        S_APPT["appointment-service (8081)<br/>Nghiệp vụ lịch hẹn, SAGA"]
        S_DOC["doctor-service (8082)<br/>Bác sĩ, Ca trực, Slots"]
        S_PAT["patient-service (8084)<br/>Bệnh án điện tử, HIPAA"]
        S_PAY["payment-service (8086)<br/>Hóa đơn, QR VNPAY, Feign"]
        S_NOTIF["notification-service (8083)<br/>Gửi Email / SMS tự động"]
    end

    subgraph BROKER["4. TẦNG THÔNG BÁO BẤT ĐỒNG BỘ"]
        RABBIT["RABBITMQ MESSAGE BROKER (Port 5672 / 15672)<br/>Exchange: clinic.exchange ➔ Queue: notification.queue"]
    end

    subgraph DATABASES["5. TẦNG CƠ SỞ DỮ LIỆU ĐỘC LẬP (POSTGRESQL 16 DOCKER)"]
        direction LR
        DB_USER[("user_db<br/>Port 55436")]
        DB_APPT[("appointment_db<br/>Port 55432")]
        DB_DOC[("doctor_db<br/>Port 55433")]
        DB_PAT[("patient_db<br/>Port 55435")]
        DB_PAY[("payment_db<br/>Port 55437")]
        DB_NOTIF[("notification_db<br/>Port 55434")]
    end

    CLIENT --> GW
    GW --> EUREKA
    GW --> SERVICES

    S_APPT -- "OpenFeign (Check Slot)" --> S_DOC
    S_PAY -- "OpenFeign (markPaymentPaid)" --> S_APPT

    S_APPT -- "Publish Event" --> RABBIT
    RABBIT -- "@RabbitListener" --> S_NOTIF

    S_USER --> DB_USER
    S_APPT --> DB_APPT
    S_DOC --> DB_DOC
    S_PAT --> DB_PAT
    S_PAY --> DB_PAY
    S_NOTIF --> DB_NOTIF
```

---

### Sơ Đồ 2: Chi Tiết Luồng SAGA & OpenFeign (Transaction Flow)
```mermaid
sequenceDiagram
    autonumber
    actor Patient as Bệnh Nhân (Nguyễn Mạnh Quân)
    participant Appt as appointment-service (8081)
    participant Doc as doctor-service (8082)
    participant Rabbit as RabbitMQ (5672)
    participant Pay as payment-service (8086)
    participant Notif as notification-service (8083)

    Patient->>Appt: 1. Đặt lịch khám (Bác sĩ, ngày, giờ)
    Appt->>Doc: OpenFeign: Tra cứu slot khám khả dụng
    Doc-->>Appt: Trả về Slot OK
    Appt->>Appt: Tạo lịch PENDING (Awaiting Payment)
    Appt->>Rabbit: Bắn sự kiện AppointmentCreatedEvent
    Rabbit->>Pay: Gửi thông tin sang Payment Service
    Pay->>Pay: Tạo bản ghi Hóa đơn viện phí PENDING

    alt Trường hợp 1: Quét mã QR thanh toán thành công (Happy Path)
        Patient->>Pay: Quét mã QR VNPAY thanh toán viện phí
        Pay->>Pay: Cập nhật hóa đơn sang PAID
        Pay->>Appt: OpenFeign: POST /api/appointments/{id}/payment-paid
        Appt->>Appt: Đổi lịch sang CONFIRMED (Đã duyệt)
        Appt->>Rabbit: Bắn AppointmentConfirmedEvent
        Rabbit->>Notif: Notification Service nhận event
        Notif->>Patient: Tự động gửi Email/SMS xác nhận lịch khám!
    else Trường hợp 2: Hết hạn giữ chỗ / Lỗi thanh toán (Compensating Transaction)
        Pay->>Appt: OpenFeign: POST /api/appointments/{id}/payment-failed
        Appt->>Appt: GIAO DỊCH BÙ TRỪ: Đổi lịch sang CANCELED
        Appt->>Doc: OpenFeign: Giải phóng slot khám cho bệnh nhân khác!
    end
```

---

## 🏷️ 3. TÊN HỆ THỐNG ĐÃ ĐƯỢC CHUẨN HÓA

* **Tên cũ trước đây:** `clinic-appointment-system` (hoặc `group01`, tên tác giả cũ).
* **Tên chính thức mới:** **MediSync Clinic** *(Hệ Thống Phòng Khám Đa Khoa MediSync - MSS301 Nhóm 09)*.
* Tất cả tên package, groupId trong `pom.xml`, logo thương hiệu, giao diện web và tài liệu hướng dẫn đã được đổi đồng bộ 100% sang:
  - **Tên dự án:** `MediSync Clinic System`
  - **Package Java:** `com.group09`
  - **Nhóm thực hiện:** Nhóm 09 môn MSS301
