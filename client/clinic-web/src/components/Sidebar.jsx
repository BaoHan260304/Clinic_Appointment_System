import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  UserCheck, 
  Users, 
  CreditCard, 
  Bell, 
  Server, 
  HeartPulse,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Tổng quan hệ thống', icon: LayoutDashboard },
    { id: 'appointments', label: 'Quản lý lịch hẹn', icon: CalendarCheck, badge: stats?.pendingAppointments || null },
    { id: 'doctors', label: 'Bác sĩ & Lịch làm', icon: UserCheck },
    { id: 'patients', label: 'Hồ sơ bệnh nhân', icon: Users },
    { id: 'payments', label: 'Thanh toán viện phí', icon: CreditCard, badge: stats?.pendingPayments || null },
    { id: 'notifications', label: 'Lịch sử thông báo', icon: Bell },
    { id: 'system', label: 'Kiến trúc Microservices', icon: Server, highlight: true }
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand-section">
        <div className="brand-icon">
          <HeartPulse size={24} />
        </div>
        <div>
          <h1 className="brand-title">MediSync</h1>
          <p className="brand-subtitle">MSS301 Clinic System</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="nav-menu">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge" style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#ef4444', color: '#fff' }}>
                  {item.badge}
                </span>
              )}
              {item.highlight && !isActive && (
                <span className="nav-badge" style={{ backgroundColor: '#f0fdfa', color: '#0d9488', border: '1px solid #ccfbf1' }}>
                  Review
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Student Project Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={14} color="#0d9488" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>Đồ Án MSS301</span>
        </div>
        <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
          Spring Boot Microservices + Clean Architecture + React
        </p>
      </div>
    </aside>
  );
}
