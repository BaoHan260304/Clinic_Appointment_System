import React from 'react';
import { 
  CalendarCheck, 
  Clock, 
  UserCheck, 
  CreditCard, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Layers
} from 'lucide-react';

export default function DashboardView({ 
  appointments, 
  doctors, 
  payments, 
  onNewAppointmentClick, 
  onNavigateTab 
}) {
  const confirmedCount = appointments.filter(a => a.status === 'CONFIRMED').length;
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const totalRevenue = payments
    .filter(p => p.status === 'PAID')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  return (
    <div>
      {/* Top Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #0284c7 100%)',
        color: 'white',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.3)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>
            <Activity size={14} /> Hệ thống Microservices đang hoạt động ổn định
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            Chào mừng bạn đến với MediSync Clinic
          </h2>
          <p style={{ opacity: 0.9, fontSize: '14px', maxWidth: '600px' }}>
            Hệ thống đặt lịch khám bệnh trực tuyến được thiết kế theo chuẩn Java Spring Boot Microservices, kết nối qua API Gateway và thông báo qua RabbitMQ.
          </p>
        </div>

        <button 
          className="btn" 
          onClick={onNewAppointmentClick}
          style={{ 
            backgroundColor: '#ffffff', 
            color: '#0f766e', 
            fontWeight: 700, 
            padding: '12px 20px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}
        >
          <PlusCircle size={18} />
          <span>Đặt Lịch Khám Mới</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div className="stat-value">{appointments.length}</div>
            <div className="stat-label">Tổng số lịch hẹn</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Chờ xác nhận</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-value">{doctors.length}</div>
            <div className="stat-label">Bác sĩ chuyên khoa</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div className="stat-value">
              {new Intl.NumberFormat('vi-VN').format(totalRevenue)} đ
            </div>
            <div className="stat-label">Viện phí đã thanh toán</div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Appointments */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Lịch Hẹn Gần Đây</h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Các lịch hẹn mới nhất được tạo trong hệ thống</p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('appointments')}
            >
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bệnh nhân</th>
                  <th>Bác sĩ & Chuyên khoa</th>
                  <th>Ngày & Giờ</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.patientName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.reason}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.doctorName}</div>
                      <div style={{ fontSize: '11px', color: '#0d9488' }}>{item.specialty}</div>
                    </td>
                    <td>
                      <div>{item.appointmentDate}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.appointmentTime}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${
                        item.status === 'CONFIRMED' ? 'success' :
                        item.status === 'PENDING' ? 'warning' :
                        item.status === 'COMPLETED' ? 'info' : 'danger'
                      }`}>
                        {item.status === 'CONFIRMED' ? 'Đã xác nhận' :
                         item.status === 'PENDING' ? 'Chờ duyệt' :
                         item.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${
                        item.paymentStatus === 'PAID' ? 'success' : 'warning'
                      }`}>
                        {item.paymentStatus === 'PAID' ? 'Đã trả phí' : 'Chưa thanh toán'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Info Box: Microservices Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#0d9488" />
                <span>Trạng Thái Services</span>
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'API Gateway', port: '8080', status: 'Running', color: '#10b981' },
                { name: 'Eureka Registry', port: '8761', status: 'Healthy', color: '#10b981' },
                { name: 'Config Server', port: '8888', status: 'Online', color: '#10b981' },
                { name: 'Appointment Service', port: '8081', status: 'Active', color: '#10b981' },
                { name: 'Doctor Service', port: '8082', status: 'Active', color: '#10b981' },
                { name: 'Patient Service', port: '8084', status: 'Active', color: '#10b981' },
                { name: 'User Service (Auth)', port: '8085', status: 'Active', color: '#10b981' },
                { name: 'Payment Service', port: '8086', status: 'Active', color: '#10b981' },
                { name: 'RabbitMQ Broker', port: '5672', status: 'Ready', color: '#10b981' }
              ].map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{s.name}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>(Port {s.port})</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: s.color, fontWeight: 600 }}>
                    <CheckCircle2 size={13} /> {s.status}
                  </span>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => onNavigateTab('system')}
            >
              <span>Xem sơ đồ kiến trúc</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
