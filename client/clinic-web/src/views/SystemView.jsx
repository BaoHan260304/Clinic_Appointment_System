import React from 'react';
import { Server, Database, Radio, Shield, Network, ArrowDown, Layers, CheckCircle2 } from 'lucide-react';

export default function SystemView() {
  const services = [
    { name: 'user-service', port: '8085', db: 'user_db (55436)', desc: 'Xác thực tài khoản, mã hóa mật khẩu BCrypt, cấp phát token JWT & Refresh Token.' },
    { name: 'doctor-service', port: '8082', db: 'doctor_db (55433)', desc: 'Quản lý thông tin bác sĩ, khoa khám, ca trực và các khung giờ slot có sẵn.' },
    { name: 'patient-service', port: '8084', db: 'patient_db (55435)', desc: 'Quản lý hồ sơ bệnh nhân, tiền sử bệnh, nhóm máu, dị ứng và bệnh án điện tử.' },
    { name: 'appointment-service', port: '8081', db: 'appointment_db (55432)', desc: 'Nghiệp vụ cốt lõi: Đặt lịch, hủy lịch, xác nhận lịch, điều phối luồng khám.' },
    { name: 'payment-service', port: '8086', db: 'payment_db (55437)', desc: 'Hóa đơn viện phí, tích hợp cổng thanh toán VNPay/MoMo, cập nhật trạng thái thanh toán.' },
    { name: 'notification-service', port: '8083', db: 'notification_db (55434)', desc: 'Lắng nghe RabbitMQ Event để gửi Email / SMS xác nhận tự động.' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Sơ Đồ Kiến Trúc Hệ Thống (Microservices Architecture)</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Thiết kế chuẩn Clean Architecture, Database Per Service & Event-Driven</p>
        </div>
      </div>

      {/* Layer 1: Client & Gateway */}
      <div className="card" style={{ background: '#f8fafc', border: '2px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Network size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Frontend Web Client (React + Vite)</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Cổng giao tiếp người dùng: Port 5173</div>
            </div>
          </div>

          <div style={{ fontSize: '20px', color: '#94a3b8' }}>➔</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Spring Cloud API Gateway (Port 8080)</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Chặn và giải mã JWT, truyền headers X-User-Id, định tuyến URL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 2: Infra Discovery & Config */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0, padding: '20px', backgroundColor: '#faf5ff', borderColor: '#f3e8ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Server size={18} color="#9333ea" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#6b21a8' }}>Eureka Server (Service Discovery)</h4>
          </div>
          <p style={{ fontSize: '12px', color: '#7e22ce' }}>
            Port 8761: Tất cả các microservices tự động đăng ký (register) và khám phá (discover) địa chỉ IP/Port của nhau.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '20px', backgroundColor: '#fff7ed', borderColor: '#ffedd5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Server size={18} color="#ea580c" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#c2410c' }}>Spring Cloud Config Server</h4>
          </div>
          <p style={{ fontSize: '12px', color: '#9a3412' }}>
            Port 8888/8889: Quản lý cấu hình tập trung cho toàn bộ 6 service con qua native repo YAML.
          </p>
        </div>
      </div>

      {/* Layer 3: 6 Business Microservices Grid */}
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={18} color="#0d9488" />
        <span>6 Business Services (Độc lập Cơ Sở Dữ Liệu - Database Per Service)</span>
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {services.map(s => (
          <div key={s.name} className="card" style={{ marginBottom: 0, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f766e' }}>{s.name}</span>
              <span style={{ fontSize: '11px', background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, color: '#0d9488' }}>
                Port {s.port}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', marginBottom: '12px', minHeight: '36px' }}>
              {s.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <Database size={13} color="#0284c7" />
              <span>Isolated DB: <strong>{s.db}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Layer 4: Event-Driven RabbitMQ */}
      <div className="card" style={{ background: '#fdf4ff', border: '1px solid #fae8ff', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <Radio size={22} color="#c026d3" />
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#86198f' }}>
            RabbitMQ Message Broker (Giao Tiếp Bất Đồng Bộ - Event Driven)
          </h4>
        </div>
        <p style={{ fontSize: '13px', color: '#701a75', lineHeight: 1.6 }}>
          Khi lịch hẹn được tạo, hủy hoặc xác nhận thanh toán, <strong>Appointment Service</strong> hoặc <strong>Payment Service</strong> publish các sự kiện (Domain Events) lên <code>clinic.appointment.exchange</code>. <strong>Notification Service</strong> đăng ký lắng nghe và tự động gửi email/SMS đến bệnh nhân mà không làm nghẽn luồng xử lý chính.
        </p>
      </div>

      {/* Clean Architecture Diagram Card */}
      <div className="card">
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
          Nguyên Tắc Thiết Kế Clean Architecture Trong Mỗi Service
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#f1f5f9', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>1. API Layer</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Controller, DTO, Request/Response, Exception</div>
          </div>
          <div style={{ backgroundColor: '#f0fdfa', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#0f766e', fontSize: '13px' }}>2. Application</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>UseCases, Commands, Ports, Kết quả</div>
          </div>
          <div style={{ backgroundColor: '#eff6ff', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '13px' }}>3. Domain Core</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Aggregates, Entities, Value Objects, Events</div>
          </div>
          <div style={{ backgroundColor: '#fef2f2', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '13px' }}>4. Infrastructure</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>JPA Entities, Repositories, Feign, RabbitMQ</div>
          </div>
        </div>
      </div>
    </div>
  );
}
