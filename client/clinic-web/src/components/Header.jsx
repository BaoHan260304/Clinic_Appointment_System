import React from 'react';
import { Radio, User, LogIn, LogOut, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  currentTab, 
  mode, 
  setMode, 
  currentUser, 
  setCurrentUser, 
  onOpenLoginModal 
}) {
  const titles = {
    dashboard: 'Bảng Điều Khiển Tổng Quan',
    appointments: 'Quản Lý & Đặt Lịch Khám Bệnh',
    doctors: 'Đội Ngũ Bác Sĩ & Lịch Làm Việc',
    patients: 'Hồ Sơ Y Tế & Bệnh Nhân',
    payments: 'Quản Lý Hóa Đơn & Thanh Toán',
    notifications: 'Hệ Thống Thông Báo Sự Kiện (RabbitMQ)',
    system: 'Sơ Đồ Kiến Trúc Hệ Thống Microservices'
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    const names = {
      PATIENT: 'Đỗ Minh Quân (Bệnh nhân)',
      DOCTOR: 'BS. CKI Nguyễn Văn An (Bác sĩ)',
      ADMIN: 'Quản trị viên Hệ thống'
    };
    setCurrentUser(prev => ({
      ...prev,
      role,
      name: names[role] || 'Người dùng'
    }));
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
          <select value={currentUser?.role || 'PATIENT'} onChange={handleRoleChange}>
            <option value="PATIENT">Bệnh nhân (Patient)</option>
            <option value="DOCTOR">Bác sĩ (Doctor)</option>
            <option value="ADMIN">Quản trị viên (Admin)</option>
          </select>
        </div>

        {/* User Badge */}
        <div className="user-badge">
          <div className="avatar">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
              {currentUser?.name || 'Đỗ Minh Quân'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {currentUser?.email || 'quan.patient@example.com'}
            </div>
          </div>
        </div>

        {/* Login modal trigger */}
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onOpenLoginModal}
          title="Đăng nhập tài khoản"
        >
          <LogIn size={14} />
          <span>Đăng nhập</span>
        </button>
      </div>
    </header>
  );
}
