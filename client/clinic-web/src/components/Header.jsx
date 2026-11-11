import React from 'react';
import { Radio, User, LogIn, LogOut, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  currentTab, 
  mode, 
  setMode, 
  currentUser, 
  setCurrentUser, 
  onOpenLoginModal,
  onLogout
}) {
  const titles = {
    dashboard: currentUser ? 'Bảng Điều Khiển Cá Nhân' : 'Trang Chủ Tổng Quan Phòng Khám',
    appointments: 'Quản Lý & Đặt Lịch Khám Bệnh',
    doctors: 'Đội Ngũ Bác Sĩ & Lịch Làm Việc',
    patients: 'Hồ Sơ Y Tế & Bệnh Nhân',
    payments: 'Quản Lý Hóa Đơn & Thanh Toán',
    notifications: 'Hệ Thống Thông Báo Sự Kiện (RabbitMQ)',
    system: 'Sơ Đồ Kiến Trúc Hệ Thống Microservices'
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (role === 'GUEST') {
      onLogout();
      return;
    }
    const profiles = {
      PATIENT: {
        userId: 'p2010000-0000-0000-0000-000000000001',
        patientId: 'p2010000-0000-0000-0000-000000000001',
        name: 'Nguyễn Mạnh Quân',
        role: 'PATIENT',
        email: 'quan.patient@example.com',
        title: 'Bệnh nhân'
      },
      DOCTOR: {
        userId: 'd1010000-0000-0000-0000-000000000001',
        doctorId: 'd1010000-0000-0000-0000-000000000001',
        name: 'BS. CKI Nguyễn Văn An',
        role: 'DOCTOR',
        email: 'bs.an@clinic.local',
        title: 'Bác sĩ - Nội Tổng Quát'
      },
      ADMIN: {
        userId: 'admin-01',
        name: 'Quản trị viên Hệ thống',
        role: 'ADMIN',
        email: 'admin@medisync.local',
        title: 'Quản trị viên'
      }
    };
    const selected = profiles[role] || profiles.PATIENT;
    setCurrentUser(selected);
  };

  const toggleMode = () => {
    const newMode = mode === 'gateway' ? 'mock' : 'gateway';
    setMode(newMode);
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <h2 className="page-title">{titles[currentTab] || 'MediSync Clinic'}</h2>
        
        {/* Toggle Live Gateway vs Mock */}
        <button 
          className={`mode-toggle-btn ${mode === 'gateway' ? 'live' : 'demo'}`}
          onClick={toggleMode}
          title="Bấm để chuyển đổi giữa kết nối API Gateway và Chế độ Demo nhanh"
        >
          <span className="pulse-dot"></span>
          <span>
            {mode === 'gateway' ? 'Gateway Live (Port 8080)' : 'Chế độ Demo Tự động'}
          </span>
        </button>
      </div>

      <div className="header-right">
        {/* Quick Role Switcher for Students demoing */}
        <div className="role-selector" title="Chuyển đổi góc nhìn vai trò người dùng">
          <User size={14} color="#0d9488" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0d9488' }}>Vai trò:</span>
          <select value={currentUser?.role || 'GUEST'} onChange={handleRoleChange}>
            {!currentUser && <option value="GUEST">Khách (Chưa đăng nhập)</option>}
            <option value="PATIENT">Bệnh nhân (Patient)</option>
            <option value="DOCTOR">Bác sĩ (Doctor)</option>
            <option value="ADMIN">Quản trị viên (Admin)</option>
            {currentUser && <option value="GUEST">Đăng xuất (Về Khách)</option>}
          </select>
        </div>

        {/* User Badge or Login Button */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar" style={{
                backgroundColor: currentUser.role === 'ADMIN' ? '#7c3aed' : currentUser.role === 'DOCTOR' ? '#2563eb' : '#0d9488',
                color: '#fff',
                fontWeight: 700
              }}>
                {currentUser.role === 'ADMIN' ? 'AD' : currentUser.role === 'DOCTOR' ? 'BS' : 'BN'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {currentUser.name || 'Người dùng'}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '999px',
                    backgroundColor: currentUser.role === 'ADMIN' ? '#f5f3ff' : currentUser.role === 'DOCTOR' ? '#eff6ff' : '#ecfdf5',
                    color: currentUser.role === 'ADMIN' ? '#7c3aed' : currentUser.role === 'DOCTOR' ? '#2563eb' : '#059669',
                    border: `1px solid ${currentUser.role === 'ADMIN' ? '#ddd6fe' : currentUser.role === 'DOCTOR' ? '#bfdbfe' : '#a7f3d0'}`
                  }}>
                    {currentUser.role === 'ADMIN' ? 'Admin' : currentUser.role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {currentUser.email || ''}
                </div>
              </div>
            </div>

            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onLogout}
              title="Đăng xuất khỏi hệ thống"
              style={{ color: '#ef4444', borderColor: '#fecaca', backgroundColor: '#fff5f5' }}
            >
              <LogOut size={14} />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : (
          <button 
            className="btn btn-primary btn-sm" 
            onClick={onOpenLoginModal}
            title="Đăng nhập hoặc Đăng ký tài khoản mới"
            style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
          >
            <LogIn size={15} />
            <span>Đăng nhập / Đăng ký</span>
          </button>
        )}
      </div>
    </header>
  );
}
