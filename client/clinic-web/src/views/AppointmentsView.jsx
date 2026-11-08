import React, { useState } from 'react';
import { 
  CalendarCheck, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  CreditCard,
  AlertCircle
} from 'lucide-react';

export default function AppointmentsView({ 
  appointments, 
  onNewAppointmentClick, 
  onConfirmAppointment, 
  onCancelAppointment,
  onOpenPaymentModal 
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(a => {
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchSearch = a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Header action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Danh Sách Lịch Khám Bệnh</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Quản lý và điều phối các lịch hẹn giữa bác sĩ và bệnh nhân</p>
        </div>

        <button className="btn btn-primary" onClick={onNewAppointmentClick}>
          <PlusCircle size={16} />
          <span>Đặt Lịch Khám Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Status buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Lọc:</span>
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'PENDING', label: 'Chờ duyệt' },
              { id: 'CONFIRMED', label: 'Đã xác nhận' },
              { id: 'COMPLETED', label: 'Đã hoàn thành' },
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
              placeholder="Tìm bệnh nhân, bác sĩ..."
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
                <th>Bác sĩ khám</th>
                <th>Thời gian</th>
                <th>Lý do khám</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <AlertCircle size={28} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
                    Không tìm thấy lịch khám nào phù hợp bộ lọc.
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
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.patientName}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.doctorName}</div>
                      <div style={{ fontSize: '11px', color: '#0d9488' }}>{item.specialty}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.appointmentDate}</div>
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
                        {item.status === 'CONFIRMED' ? 'Đã xác nhận' :
                         item.status === 'PENDING' ? 'Chờ duyệt' :
                         item.status === 'COMPLETED' ? 'Đã hoàn tất' : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${
                        item.paymentStatus === 'PAID' ? 'success' : 'warning'
                      }`}>
                        {item.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa đóng phí'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {item.status === 'PENDING' && (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => onConfirmAppointment(item.id)}
                            title="Xác nhận lịch khám"
                          >
                            <CheckCircle size={13} />
                            <span>Duyệt</span>
                          </button>
                        )}

                        {item.paymentStatus !== 'PAID' && item.status !== 'CANCELED' && (
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => onOpenPaymentModal(item)}
                            title="Thanh toán viện phí cho lịch này"
                            style={{ color: '#059669', borderColor: '#a7f3d0' }}
                          >
                            <CreditCard size={13} />
                            <span>Đóng phí</span>
                          </button>
                        )}

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
