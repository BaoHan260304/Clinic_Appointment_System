import React from 'react';
import { isDemoPatient, matchesPatient } from '../api/client';
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
  Users,
  User,
  LogIn
} from 'lucide-react';

export default function DashboardView({ 
  appointments = [], 
  doctors = [], 
  payments = [], 
  currentUser,
  onNewAppointmentClick, 
  onNavigateTab,
  onOpenLoginModal,
  onQuickLogin
}) {
  const role = currentUser?.role || 'PATIENT';

  const isDemo = isDemoPatient(currentUser);
  const patientDisplayName = isDemo ? 'Nguyễn Mạnh Quân' : (currentUser?.name || currentUser?.fullName || 'Bệnh nhân');

  // Role-specific datasets (Strictly scoped by patient identity, zero data leakage)
  const myAppointments = appointments.filter(a => matchesPatient(a, currentUser));
  const myPendingCount = myAppointments.filter(a => a.status === 'PENDING').length;
  const myConfirmedCount = myAppointments.filter(a => a.status === 'CONFIRMED').length;
  const myPaidRevenue = payments
    .filter(p => matchesPatient(p, currentUser) && p.status === 'PAID')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  const doctorAppointments = appointments.filter(a => a.doctorName?.includes('Nguyễn Văn An') || a.doctorId === currentUser?.doctorId);
  const doctorPendingCount = doctorAppointments.filter(a => a.status === 'PENDING').length;
  const doctorCompletedCount = doctorAppointments.filter(a => a.status === 'COMPLETED').length;

  const totalRevenue = payments
    .filter(p => p.status === 'PAID')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;

  // RENDER GUEST / PUBLIC CLINIC DASHBOARD (When not logged in)
  if (!currentUser) {
    return (
      <div>
        {/* Guest Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '36px 36px',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(255,255,255,0.2)', 
              padding: '6px 14px', 
              borderRadius: '999px', 
              fontSize: '12px', 
              fontWeight: 700, 
              marginBottom: '14px' 
            }}>
              <Heart size={15} /> Phòng Khám Đa Khoa Quốc Tế MediSync Clinic
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px', lineHeight: 1.3 }}>
              Đặt Lịch Khám Bệnh Thông Minh & Quản Lý Hồ Sơ Điện Tử 🏥
            </h1>
            <p style={{ opacity: 0.95, fontSize: '15px', lineHeight: 1.6, marginBottom: '22px' }}>
              Giải pháp y tế số hoá hiện đại dựa trên kiến trúc Microservices 5 tầng. Đặt lịch khám nhanh chóng chỉ trong 45 giây, chủ động lựa chọn bác sĩ chuyên khoa & khung giờ, thông báo tự động và thanh toán viện phí trực tuyến không tiền mặt.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                className="btn" 
                onClick={onNewAppointmentClick}
                style={{ 
                  backgroundColor: '#ffffff', 
                  color: '#0f766e', 
                  fontWeight: 800, 
                  padding: '12px 22px', 
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PlusCircle size={18} />
                <span>Đặt Lịch Khám Ngay</span>
              </button>
              <button 
                className="btn" 
                onClick={() => onNavigateTab('doctors')}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)', 
                  color: '#ffffff', 
                  border: '1px solid rgba(255,255,255,0.4)',
                  fontWeight: 700, 
                  padding: '12px 20px', 
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Xem Đội Ngũ Bác Sĩ</span>
                <ArrowRight size={16} />
              </button>
              {onOpenLoginModal && (
                <button 
                  className="btn" 
                  onClick={onOpenLoginModal}
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.25)', 
                    color: '#ffffff', 
                    fontWeight: 700, 
                    padding: '12px 20px', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <User size={16} />
                  <span>Đăng Nhập / Đăng Ký</span>
                </button>
              )}
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '16px',
            padding: '20px 24px',
            minWidth: '240px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', opacity: 0.9 }}>
              ⚡ TRẢI NGHIỆM NHANH (DEMO MSS301)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: '#ffffff', color: '#166534', fontWeight: 700, justifyContent: 'flex-start' }}
                onClick={() => onQuickLogin && onQuickLogin('PATIENT')}
              >
                <span>👤 Đăng nhập: Bệnh nhân Quân</span>
              </button>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: '#ffffff', color: '#1e40af', fontWeight: 700, justifyContent: 'flex-start' }}
                onClick={() => onQuickLogin && onQuickLogin('DOCTOR')}
              >
                <span>🩺 Đăng nhập: BS. Nguyễn Văn An</span>
              </button>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: '#ffffff', color: '#6d28d9', fontWeight: 700, justifyContent: 'flex-start' }}
                onClick={() => onQuickLogin && onQuickLogin('ADMIN')}
              >
                <span>🛡️ Đăng nhập: Quản trị viên Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Public Stat Grid */}
        <div className="stat-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <div className="stat-value">{doctors.length || 8}</div>
              <div className="stat-label">Bác sĩ chuyên khoa hàng đầu</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <CalendarCheck size={24} />
            </div>
            <div>
              <div className="stat-value">{appointments.length || 24}</div>
              <div className="stat-label">Lịch hẹn đã tiếp nhận</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-value">45 Phút</div>
              <div className="stat-label">Khung giờ chuẩn (Optimistic Lock)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div className="stat-value">100%</div>
              <div className="stat-label">Thanh toán VNPay QR tiện lợi</div>
            </div>
          </div>
        </div>

        {/* 4 Steps Clinic Workflow */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px 28px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Quy Trình Khám Bệnh 4 Bước Đơn Giản & Hiện Đại
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Hệ thống tự động hóa điều phối qua kiến trúc Microservices và hàng đợi sự kiện RabbitMQ.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '10px' }}>1</div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Chọn Bác Sĩ & Giờ Khám</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Chủ động chọn khoa và slot 45 phút. Hệ thống dùng Optimistic Lock chống đặt trùng.</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '10px' }}>2</div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Nhận Thông Báo Tức Thời</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Notification Service tự động gửi email/tin nhắn xác nhận sự kiện qua RabbitMQ.</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#7c3aed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '10px' }}>3</div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Thăm Khám & Bệnh Án Số</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Bác sĩ khám trực tiếp và lưu bệnh án điện tử an toàn, chuẩn bảo mật HIPAA.</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '10px' }}>4</div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Thanh Toán Viện Phí QR</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>Quét mã QR qua cổng VNPay/MoMo để thanh toán nhanh, không cần xếp hàng.</p>
            </div>
          </div>
        </div>

        {/* Featured Doctors Section */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px 28px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Đội Ngũ Bác Sĩ Chuyên Khoa Tiêu Biểu
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Các bác sĩ giàu kinh nghiệm sẵn sàng thăm khám và tư vấn tận tâm.
              </p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('doctors')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Xem tất cả ({doctors.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {doctors.slice(0, 3).map((doc, idx) => (
              <div key={doc.id || idx} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '15px'
                    }}>
                      {doc.name ? doc.name.charAt(doc.name.lastIndexOf(' ') + 1) : 'BS'}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{doc.name}</div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: '#f0fdfa',
                        color: '#0f766e',
                        padding: '1px 8px',
                        borderRadius: '999px',
                        border: '1px solid #ccfbf1'
                      }}>
                        {doc.specialty}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                    Phòng khám: <strong>{doc.room || 'P.201'}</strong> • Kinh nghiệm: <strong>{doc.experience || '10+ năm'}</strong>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0d9488', marginBottom: '14px' }}>
                    Phí khám: {doc.price ? Number(doc.price).toLocaleString('vi-VN') + ' đ' : '250.000 đ'}
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={onNewAppointmentClick}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <PlusCircle size={14} />
                  <span>Đặt Lịch Ngay</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
              Xin chào, {patientDisplayName}! 👋
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
                <p style={{ fontSize: '13px', color: '#64748b' }}>Chỉ hiển thị các lịch hẹn riêng của bệnh nhân {patientDisplayName}</p>
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
                <div style={{ fontWeight: 700, color: '#065f46' }}>Bệnh nhân: {patientDisplayName}</div>
                <div style={{ color: '#047857', marginTop: '4px' }}>Mã BN: {currentUser?.patientId || currentUser?.userId || (isDemo ? 'p2010000-0001' : 'BN-' + (currentUser?.id || 'MỚI'))}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Nhóm máu:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentUser?.bloodGroup || (isDemo ? 'O+' : 'Chưa rõ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Tiền sử dị ứng:</span>
                <span style={{ fontWeight: 700, color: (currentUser?.allergies && currentUser.allergies !== 'Không có') || isDemo ? '#dc2626' : '#16a34a' }}>
                  {currentUser?.allergies || (isDemo ? 'Dị ứng Penicillin' : 'Không có')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Năm sinh:</span>
                <span style={{ fontWeight: 600 }}>{currentUser?.dob || (isDemo ? '2002' : 'Chưa cập nhật')} {currentUser?.gender ? `(${currentUser.gender})` : (isDemo ? '(Nam)' : '')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Địa chỉ:</span>
                <span style={{ fontWeight: 600 }}>{currentUser?.address || (isDemo ? 'Hà Nội' : 'Chưa cập nhật')}</span>
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
