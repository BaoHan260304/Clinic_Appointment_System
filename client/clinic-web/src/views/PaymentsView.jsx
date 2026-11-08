import React from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle, QrCode } from 'lucide-react';

export default function PaymentsView({ payments = [], currentUser, onPayPayment }) {
  const role = currentUser?.role || 'PATIENT';
  const isPatient = role === 'PATIENT';

  const scopedPayments = isPatient 
    ? payments.filter(p => p.patientName === 'Nguyễn Mạnh Quân' || p.patientId === currentUser?.patientId)
    : payments;

  const totalPaid = scopedPayments
    .filter(p => p.status === 'PAID')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  const totalPending = scopedPayments
    .filter(p => p.status === 'PENDING')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              {isPatient ? 'Hóa Đơn & Viện Phí Của Tôi' : 'Quản Lý Doanh Thu & Viện Phí Toàn Viện'}
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: isPatient ? '#dcfce7' : '#ede9fe',
              color: isPatient ? '#15803d' : '#6d28d9'
            }}>
              Payment Service (Port 8086)
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {isPatient 
              ? 'Theo dõi và thanh toán viện phí trực tuyến qua cổng QR VNPAY / MoMo an toàn'
              : 'Thống kê tổng doanh thu viện phí và trạng thái hóa đơn của tất cả bệnh nhân'}
          </p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="stat-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-value">{new Intl.NumberFormat('vi-VN').format(totalPaid)} đ</div>
            <div className="stat-label">{isPatient ? 'Viện phí bạn đã thanh toán' : 'Tổng viện phí toàn viện đã thu'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{new Intl.NumberFormat('vi-VN').format(totalPending)} đ</div>
            <div className="stat-label">{isPatient ? 'Viện phí đang chờ bạn đóng' : 'Viện phí toàn viện chờ thu'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div className="stat-value">{scopedPayments.length}</div>
            <div className="stat-label">Số giao dịch {isPatient ? 'của bạn' : 'toàn hệ thống'}</div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã giao dịch</th>
                <th>Bệnh nhân</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Thời gian thanh toán</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {scopedPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Không có giao dịch thanh toán nào.
                  </td>
                </tr>
              ) : (
                scopedPayments.map(p => (
                  <tr key={p.id}>
                    <td>
                      <code style={{ fontSize: '12px', fontWeight: 600, color: '#0f766e' }}>
                        {p.transactionCode}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.patientName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Mã lịch: {p.appointmentId.slice(0, 10)}...</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                        {new Intl.NumberFormat('vi-VN').format(p.amount)} {p.currency}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {p.method}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${p.status === 'PAID' ? 'success' : 'warning'}`}>
                        {p.status === 'PAID' ? 'Đã hoàn tất' : 'Chờ thanh toán'}
                      </span>
                    </td>
                    <td>
                      {p.paidAt ? (
                        <div>{p.paidAt}</div>
                      ) : (
                        <span style={{ color: '#d97706', fontSize: '12px', fontStyle: 'italic' }}>Chưa thanh toán</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {p.status !== 'PAID' ? (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => onPayPayment(p.id)}
                          title="Thanh toán ngay bằng mã QR VNPAY"
                        >
                          <QrCode size={13} />
                          <span>Quét mã QR trả phí</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                          ✓ Đã thu tiền
                        </span>
                      )}
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
