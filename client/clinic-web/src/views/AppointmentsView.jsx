import React, { useState } from 'react';
import { 
  CalendarCheck, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  CreditCard,
  AlertCircle,
  Eye,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

export default function AppointmentsView({ 
  appointments = [], 
  currentUser,
  onNewAppointmentClick, 
  onConfirmAppointment, 
  onCancelAppointment,
  onCompleteAppointment,
  onOpenPaymentModal 
}) {
  const role = currentUser?.role || 'PATIENT';
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewScope, setViewScope] = useState('AUTO'); // 'AUTO' (filtered by role) or 'ALL' (system-wide)

  // Determine list based on role and view scope
  const isPersonalScope = viewScope === 'AUTO' && role !== 'ADMIN';

  const scopedAppointments = appointments.filter(a => {
    if (!isPersonalScope) return true;
    if (role === 'PATIENT') {
      return a.patientName === 'Đỗ Minh Quân' || a.patientId === currentUser?.patientId;
    }
    if (role === 'DOCTOR') {
      return a.doctorName?.includes('Nguyễn Văn An') || a.doctorId === currentUser?.doctorId;
    }
    return true;
  });

  const filteredAppointments = scopedAppointments.filter(a => {
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchSearch = a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Header action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              {role === 'PATIENT' ? 'Lịch Khám Của Tôi' :
               role === 'DOCTOR' ? 'Danh Sách Ca Khám Của Bác Sĩ' :
               'Quản Lý & Điều Phối Lịch Hẹn Toàn Viện'}
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: role === 'PATIENT' ? '#dcfce7' : role === 'DOCTOR' ? '#dbeafe' : '#ede9fe',
              color: role === 'PATIENT' ? '#15803d' : role === 'DOCTOR' ? '#1d4ed8' : '#6d28d9'
            }}>
              {role === 'PATIENT' ? 'Bệnh nhân' : role === 'DOCTOR' ? 'Bác sĩ' : 'Quản trị viên'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {role === 'PATIENT' ? 'Theo dõi trạng thái, thanh toán viện phí và lịch khám cá nhân của bạn' :
             role === 'DOCTOR' ? 'Duyệt lịch hẹn, chuẩn bị hồ sơ bệnh án và xác nhận hoàn tất ca khám' :
             'Toàn quyền điều phối, phân công lịch hẹn cho tất cả bác sĩ và bệnh nhân'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Toggle scope button for demo clarity */}
          {role !== 'ADMIN' && (
            <button
              className={`btn btn-sm ${viewScope === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewScope(prev => prev === 'AUTO' ? 'ALL' : 'AUTO')}
              title="Bấm để xem lịch cá nhân hoặc xem tất cả lịch phòng khám để kiểm tra phân quyền"
            >
              <Eye size={14} />
              <span>{viewScope === 'AUTO' ? 'Xem cả lịch toàn viện' : 'Về lịch cá nhân'}</span>
            </button>
          )}

          {/* Patient or Admin can create appointment; Doctors don't create appointments */}
          {role !== 'DOCTOR' && (
            <button className="btn btn-primary" onClick={onNewAppointmentClick}>
              <PlusCircle size={16} />
              <span>Đặt Lịch Khám Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Status buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Trạng thái:</span>
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'PENDING', label: 'Chờ duyệt' },
              { id: 'CONFIRMED', label: 'Đã xác nhận' },
              { id: 'COMPLETED', label: 'Đã hoàn tất' },
              { id: 'CANCELED', label: 'Đã hủy' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`btn btn-sm ${filterStatus === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterStatus(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Tìm bệnh nhân, bác sĩ, lý do..."
              className="form-input" 
              style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã lịch hẹn</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ phụ trách</th>
                <th>Ngày & Khung giờ</th>
                <th>Lý do khám bệnh</th>
                <th>Trạng thái lịch</th>
                <th>Thanh toán</th>
                <th style={{ textAlign: 'right' }}>Thao tác theo quyền ({role})</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <AlertCircle size={28} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
                    Không tìm thấy lịch khám nào phù hợp bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(item => (
                  <tr key={item.id}>
                    <td>
                      <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.id.slice(0, 13)}...
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.patientName}</div>
                      {item.patientName === 'Đỗ Minh Quân' && (
                        <span style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>Tài khoản của bạn</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.doctorName}</div>
                      <div style={{ fontSize: '11px', color: '#0d9488' }}>{item.specialty}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.appointmentDate}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.appointmentTime}</div>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.reason}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${
                        item.status === 'CONFIRMED' ? 'success' :
                        item.status === 'PENDING' ? 'warning' :
                        item.status === 'COMPLETED' ? 'info' : 'danger'
                      }`}>
                        {item.status === 'CONFIRMED' ? 'Đã duyệt' :
                         item.status === 'PENDING' ? 'Chờ duyệt' :
                         item.status === 'COMPLETED' ? 'Đã hoàn tất' : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${
                        item.paymentStatus === 'PAID' ? 'success' : 'warning'
                      }`}>
                        {item.paymentStatus === 'PAID' ? 'Đã đóng phí' : 'Chưa đóng phí'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        
                        {/* 1. NÚT DUYỆT LỊCH: CHỈ BÁC SĨ HOẶC ADMIN ĐƯỢC DUYỆT (BỆNH NHÂN KHÔNG THẤY) */}
                        {item.status === 'PENDING' && (role === 'DOCTOR' || role === 'ADMIN') && (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => onConfirmAppointment(item.id)}
                            title="Xác nhận lịch khám cho bệnh nhân"
                          >
                            <CheckCircle size={13} />
                            <span>Duyệt</span>
                          </button>
                        )}

                        {/* 2. NÚT HOÀN TẤT KHÁM: BÁC SĨ HOẶC ADMIN KHI KHÁM XONG */}
                        {item.status === 'CONFIRMED' && (role === 'DOCTOR' || role === 'ADMIN') && (
                          <button 
                            className="btn btn-sm"
                            style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '12px', padding: '4px 8px' }}
                            onClick={() => onCompleteAppointment && onCompleteAppointment(item.id)}
                            title="Xác nhận ca khám đã hoàn thành"
                          >
                            <Stethoscope size={13} />
                            <span>Khám xong</span>
                          </button>
                        )}

                        {/* 3. NÚT ĐÓNG VIỆN PHÍ: BỆNH NHÂN HOẶC ADMIN (BÁC SĨ KHÔNG THẤY) */}
                        {item.paymentStatus !== 'PAID' && item.status !== 'CANCELED' && (role === 'PATIENT' || role === 'ADMIN') && (
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => onOpenPaymentModal(item)}
                            title="Thanh toán viện phí trực tuyến qua QR"
                            style={{ color: '#059669', borderColor: '#a7f3d0' }}
                          >
                            <CreditCard size={13} />
                            <span>Đóng phí</span>
                          </button>
                        )}

                        {/* 4. NÚT HỦY LỊCH */}
                        {item.status !== 'CANCELED' && item.status !== 'COMPLETED' && (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => onCancelAppointment(item.id)}
                            title="Hủy lịch hẹn này"
                          >
                            <XCircle size={13} />
                            <span>Hủy</span>
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
