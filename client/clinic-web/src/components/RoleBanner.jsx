import React from 'react';
import { UserCheck, ShieldCheck, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';

export default function RoleBanner({ currentUser, onSwitchRole }) {
  if (!currentUser) {
    return (
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
              CHẾ ĐỘ KHÁCH (CHƯA ĐĂNG NHẬP)
            </div>
            <p style={{ fontSize: '12px', color: '#b45309', margin: '2px 0 0' }}>
              Bạn đang duyệt thông tin công khai. Hãy chọn 1 vai trò bên phải để đăng nhập nhanh, hoặc bấm nút "Đăng nhập / Đăng ký" trên thanh Header!
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary btn-sm" onClick={() => onSwitchRole('PATIENT')}>
            Đăng nhập Bệnh nhân
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onSwitchRole('DOCTOR')}>
            Đăng nhập Bác sĩ
          </button>
        </div>
      </div>
    );
  }

  const role = currentUser?.role || 'PATIENT';

  if (role === 'PATIENT') {
    return (
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#dcfce7',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <UserCheck size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#166534' }}>
                GÓC NHÌN BỆNH NHÂN (Nguyễn Mạnh Quân)
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '1px 8px',
                borderRadius: '999px'
              }}>
                Quyền hạn cá nhân
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#15803d', margin: '2px 0 0', lineHeight: 1.4 }}>
              Hệ thống tự động lọc chỉ hiển thị lịch khám & hóa đơn viện phí của bạn. Bạn có quyền <strong>Đặt lịch khám mới</strong> và <strong>Thanh toán viện phí</strong> (không có quyền duyệt lịch).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>Thử vai trò khác:</span>
          <button 
            className="btn btn-sm"
            style={{ backgroundColor: '#ffffff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '11px', padding: '4px 10px' }}
            onClick={() => onSwitchRole('DOCTOR')}
          >
            Đổi sang Bác sĩ
          </button>
          <button 
            className="btn btn-sm"
            style={{ backgroundColor: '#ffffff', color: '#6d28d9', border: '1px solid #ddd6fe', fontSize: '11px', padding: '4px 10px' }}
            onClick={() => onSwitchRole('ADMIN')}
          >
            Đổi sang Admin
          </button>
        </div>
      </div>
    );
  }

  if (role === 'DOCTOR') {
    return (
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Stethoscope size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e40af' }}>
                GÓC NHÌN BÁC SĨ (BS. CKI Nguyễn Văn An - Nội Tổng Quát)
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                padding: '1px 8px',
                borderRadius: '999px'
              }}>
                Phòng khám 201
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#1d4ed8', margin: '2px 0 0', lineHeight: 1.4 }}>
              Hệ thống lọc các ca khám được chỉ định cho bạn. Bạn có quyền <strong>Duyệt lịch hẹn (Confirm)</strong>, <strong>Hoàn tất ca khám</strong> và <strong>Xem bệnh án điện tử</strong>.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>Thử vai trò khác:</span>
          <button 
            className="btn btn-sm"
            style={{ backgroundColor: '#ffffff', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '11px', padding: '4px 10px' }}
            onClick={() => onSwitchRole('PATIENT')}
          >
            Đổi sang Bệnh nhân
          </button>
          <button 
            className="btn btn-sm"
            style={{ backgroundColor: '#ffffff', color: '#6d28d9', border: '1px solid #ddd6fe', fontSize: '11px', padding: '4px 10px' }}
            onClick={() => onSwitchRole('ADMIN')}
          >
            Đổi sang Admin
          </button>
        </div>
      </div>
    );
  }

  // ADMIN
  return (
    <div style={{
      backgroundColor: '#f5f3ff',
      border: '1px solid #ddd6fe',
      borderRadius: '12px',
      padding: '12px 18px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: '#ede9fe',
          color: '#6d28d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#5b21b6' }}>
              GÓC NHÌN QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN)
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: '#ede9fe',
              color: '#5b21b6',
              padding: '1px 8px',
              borderRadius: '999px'
            }}>
              Toàn quyền quản trị
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#6d28d9', margin: '2px 0 0', lineHeight: 1.4 }}>
            Bạn đang có quyền truy cập tối cao: Xem và điều phối toàn bộ lịch hẹn của tất cả bác sĩ, quản lý hồ sơ bệnh nhân, theo dõi doanh thu viện phí và giám sát cụm Microservices.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '11px', color: '#5b21b6', fontWeight: 600 }}>Thử vai trò khác:</span>
        <button 
          className="btn btn-sm"
          style={{ backgroundColor: '#ffffff', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '11px', padding: '4px 10px' }}
          onClick={() => onSwitchRole('PATIENT')}
        >
          Đổi sang Bệnh nhân
        </button>
        <button 
          className="btn btn-sm"
          style={{ backgroundColor: '#ffffff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '11px', padding: '4px 10px' }}
          onClick={() => onSwitchRole('DOCTOR')}
        >
          Đổi sang Bác sĩ
        </button>
      </div>
    </div>
  );
}
