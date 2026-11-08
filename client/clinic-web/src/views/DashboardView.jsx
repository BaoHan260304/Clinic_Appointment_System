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
  Layers,
  Stethoscope,
  ShieldCheck,
  Heart,
  Star,
  Users
} from 'lucide-react';

export default function DashboardView({ 
  appointments = [], 
  doctors = [], 
  payments = [], 
  currentUser,
  onNewAppointmentClick, 
  onNavigateTab 
}) {
  const role = currentUser?.role || 'PATIENT';

  // Role-specific datasets
  const myAppointments = appointments.filter(a => a.patientName === 'Nguyễn Mạnh Quân' || a.patientId === currentUser?.patientId);
  const myPendingCount = myAppointments.filter(a => a.status === 'PENDING').length;
  const myConfirmedCount = myAppointments.filter(a => a.status === 'CONFIRMED').length;
  const myPaidRevenue = payments
    .filter(p => (p.patientName === 'Nguyễn Mạnh Quân' || p.patientId === currentUser?.patientId) && p.status === 'PAID')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  const doctorAppointments = appointments.filter(a => a.doctorName?.includes('Nguyễn Văn An') || a.doctorId === currentUser?.doctorId);
  const doctorPendingCount = doctorAppointments.filter(a => a.status === 'PENDING').length;
  const doctorCompletedCount = doctorAppointments.filter(a => a.status === 'COMPLETED').length;

  const totalRevenue = payments
    .filter(p => p.status === 'PAID')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;

  // RENDER PATIENT DASHBOARD
  if (role === 'PATIENT') {
    return (
      <div>
        {/* Patient Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 60%, #0284c7 100%)',
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
              <Heart size={14} /> Chăm sóc sức khỏe toàn diện cho bạn
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              Xin chào, {currentUser?.name || 'Nguyễn Mạnh Quân'}! 👋
            </h2>
            <p style={{ opacity: 0.95, fontSize: '14px', maxWidth: '600px' }}>
              Chào mừng bạn quay lại hệ thống khám bệnh MediSync. Tại đây bạn có thể đặt lịch khám nhanh, theo dõi kết quả và đóng viện phí trực tuyến an toàn.
            </p>
          </div>

          <button 
            className="btn" 
            onClick={onNewAppointmentClick}
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#047857', 
              fontWeight: 700, 
              padding: '12px 20px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}
          >
            <PlusCircle size={18} />
            <span>Đặt Lịch Khám Mới</span>
          </button>
        </div>

        {/* Patient Stat Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <CalendarCheck size={24} />
            </div>
            <div>
              <div className="stat-value">{myAppointments.length}</div>
              <div className="stat-label">Lịch khám của tôi</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-value">{myPendingCount}</div>
              <div className="stat-label">Đang chờ bác sĩ duyệt</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <UserCheck size={24} />
            </div>
            <div>
              <div className="stat-value">{myConfirmedCount}</div>
              <div className="stat-label">Đã xác nhận sắp khám</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div className="stat-value">
                {new Intl.NumberFormat('vi-VN').format(myPaidRevenue)} đ
              </div>
              <div className="stat-label">Viện phí đã thanh toán</div>
            </div>
          </div>
        </div>

        {/* Patient Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* My Appointments list */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Lịch Khám Sắp Tới Của Bạn</h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Chỉ hiển thị các lịch hẹn riêng của bệnh nhân Nguyễn Mạnh Quân</p>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigateTab('appointments')}
              >
                <span>Xem tất cả</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  Bạn chưa có lịch khám nào. Hãy bấm "Đặt Lịch Khám Mới"!
                </div>
              ) : (
                myAppointments.map(a => (
                  <div key={a.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                        {a.doctorName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#0d9488', fontWeight: 600 }}>
                        {a.specialty} • {a.appointmentDate} ({a.appointmentTime})
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        Lý do: {a.reason}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={`status-pill ${
                        a.status === 'CONFIRMED' ? 'success' :
                        a.status === 'PENDING' ? 'warning' : 'info'
                      }`}>
                        {a.status === 'CONFIRMED' ? 'Đã xác nhận' :
                         a.status === 'PENDING' ? 'Chờ duyệt' : 'Đã xong'}
                      </span>
                      <div style={{ marginTop: '6px' }}>
                        <span className={`status-pill ${a.paymentStatus === 'PAID' ? 'success' : 'warning'}`} style={{ fontSize: '10px' }}>
                          {a.paymentStatus === 'PAID' ? 'Đã đóng phí' : 'Chưa đóng phí'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Health Profile Card */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">Hồ Sơ Y Tế Cá Nhân</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontWeight: 700, color: '#065f46' }}>Bệnh nhân: Nguyễn Mạnh Quân</div>
                <div style={{ color: '#047857', marginTop: '4px' }}>Mã BN: p2010000-0001</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Nhóm máu:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>O+</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Tiền sử dị ứng:</span>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>Dị ứng Penicillin</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Năm sinh:</span>
                <span style={{ fontWeight: 600 }}>2002 (Nam)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Địa chỉ:</span>
                <span style={{ fontWeight: 600 }}>Hà Nội</span>
              </div>

              <button 
                className="btn btn-secondary btn-sm" 
                style={{ marginTop: '10px' }}
                onClick={() => onNavigateTab('doctors')}
              >
                <span>Xem danh sách bác sĩ</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER DOCTOR DASHBOARD
  if (role === 'DOCTOR') {
    return (
      <div>
        {/* Doctor Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #0284c7 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>
              <Stethoscope size={14} /> Chuyên khoa Nội Tổng Quát • Phòng 201
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              Kính chào BS. CKI Nguyễn Văn An 👨‍⚕️
            </h2>
            <p style={{ opacity: 0.95, fontSize: '14px', maxWidth: '600px' }}>
              Hệ thống đã tự động lọc các ca khám của riêng bác sĩ. Bác sĩ có thể duyệt lịch khám của bệnh nhân, theo dõi ca trực và đánh giá kết quả điều trị.
            </p>
          </div>

          <button 
            className="btn" 
            onClick={() => onNavigateTab('appointments')}
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#1e40af', 
              fontWeight: 700, 
              padding: '12px 20px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}
          >
            <span>Quản Lý Ca Khám ({doctorAppointments.length})</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Doctor Stat Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <CalendarCheck size={24} />
            </div>
            <div>
              <div className="stat-value">{doctorAppointments.length}</div>
              <div className="stat-label">Tổng ca khám phân công</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-value">{doctorPendingCount}</div>
              <div className="stat-label">Ca khám chờ bác sĩ duyệt</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="stat-value">{doctorCompletedCount}</div>
              <div className="stat-label">Ca khám đã hoàn tất</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              <Star size={24} />
            </div>
            <div>
              <div className="stat-value">4.9 / 5.0</div>
              <div className="stat-label">Đánh giá chuyên môn</div>
            </div>
          </div>
        </div>

        {/* Doctor Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Doctor Appointment queue */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Danh Sách Bệnh Nhân Chờ Bác Sĩ Khám</h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Các ca khám được chỉ định cho BS. CKI Nguyễn Văn An</p>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigateTab('appointments')}
              >
                <span>Vào ca khám</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {doctorAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  Hiện tại không có ca khám nào được phân công.
                </div>
              ) : (
                doctorAppointments.map(a => (
                  <div key={a.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                        Bệnh nhân: {a.patientName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                        {a.appointmentDate} • Khung giờ: {a.appointmentTime}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        Triệu chứng / Lý do: {a.reason}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={`status-pill ${
                        a.status === 'CONFIRMED' ? 'success' :
                        a.status === 'PENDING' ? 'warning' : 'info'
                      }`}>
                        {a.status === 'CONFIRMED' ? 'Đã duyệt (Sắp khám)' :
                         a.status === 'PENDING' ? 'Cần duyệt' : 'Đã khám xong'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Doctor Schedule Information */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">Thông Tin Ca Trực</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontWeight: 700, color: '#1e40af' }}>Phòng 201 - Tầng 2</div>
                <div style={{ color: '#2563eb', marginTop: '4px' }}>Thời lượng: 30 phút / lượt khám</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Ngày làm việc:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Thứ 2 đến Thứ 6</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Kinh nghiệm:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>12 năm chuyên khoa</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Giá khám niêm yết:</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>300.000 đ</span>
              </div>

              <button 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: '10px' }}
                onClick={() => onNavigateTab('patients')}
              >
                <span>Xem hồ sơ bệnh nhân điều trị</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER ADMIN DASHBOARD (Default / System-wide)
  return (
    <div>
      {/* Admin Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 60%, #0284c7 100%)',
        color: 'white',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px -5px rgba(109, 40, 217, 0.3)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>
            <ShieldCheck size={14} /> Toàn quyền Quản trị viên Hệ thống MediSync
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            Bảng Điều Khiển Quản Trị Hệ Thống Toàn Viện 🛡️
          </h2>
          <p style={{ opacity: 0.95, fontSize: '14px', maxWidth: '600px' }}>
            Giám sát toàn bộ 6 Microservices nghiệp vụ, điều phối lịch hẹn bác sĩ, hồ sơ bệnh nhân và tổng doanh thu viện phí thời gian thực.
          </p>
        </div>

        <button 
          className="btn" 
          onClick={() => onNavigateTab('appointments')}
          style={{ 
            backgroundColor: '#ffffff', 
            color: '#5b21b6', 
            fontWeight: 700, 
            padding: '12px 20px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}
        >
          <span>Điều Phối Lịch Hẹn ({appointments.length})</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Admin Stat Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div className="stat-value">{appointments.length}</div>
            <div className="stat-label">Tổng lịch hẹn toàn viện</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Chờ duyệt toàn viện</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-value">{doctors.length}</div>
            <div className="stat-label">Bác sĩ đang hoạt động</div>
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
            <div className="stat-label">Doanh thu viện phí đã thu</div>
          </div>
        </div>
      </div>

      {/* Admin Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* All Recent Appointments */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Hoạt Động Lịch Hẹn Toàn Viện</h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Các lịch hẹn mới nhất được tạo trong toàn hệ thống</p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('appointments')}
            >
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appointments.slice(0, 5).map(a => (
              <div key={a.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                    {a.patientName} ➔ {a.doctorName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {a.specialty} • {a.appointmentDate} ({a.appointmentTime})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`status-pill ${
                    a.status === 'CONFIRMED' ? 'success' :
                    a.status === 'PENDING' ? 'warning' : 'info'
                  }`}>
                    {a.status === 'CONFIRMED' ? 'Đã duyệt' :
                     a.status === 'PENDING' ? 'Chờ duyệt' : 'Đã xong'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Architecture Quick Widget */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Cụm Microservices (Port)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Eureka Server:</span>
              <strong style={{ color: '#059669' }}>Port 8761 (UP)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Config Server:</span>
              <strong style={{ color: '#059669' }}>Port 8889 (UP)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>API Gateway:</span>
              <strong style={{ color: '#059669' }}>Port 8080 (UP)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>User Service:</span>
              <strong style={{ color: '#059669' }}>Port 8085 (UP)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Appointment Service:</span>
              <strong style={{ color: '#059669' }}>Port 8081 (UP)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>RabbitMQ Message Broker:</span>
              <strong style={{ color: '#059669' }}>Port 5672 (UP)</strong>
            </div>

            <button 
              className="btn btn-secondary btn-sm" 
              style={{ marginTop: '12px' }}
              onClick={() => onNavigateTab('system')}
            >
              <span>Xem sơ đồ kiến trúc</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
