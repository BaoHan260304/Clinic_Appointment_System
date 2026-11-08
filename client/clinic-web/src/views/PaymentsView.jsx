import React from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle, QrCode } from 'lucide-react';

export default function PaymentsView({ payments, onPayPayment }) {
  const totalPaid = payments
    .filter(p => p.status === 'PAID')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  const totalPending = payments
    .filter(p => p.status === 'PENDING')
    .reduce((acc, cur) => acc + (cur.amount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Quản Lý Viện Phí & Thanh Toán</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Theo dõi hóa đơn viện phí và cổng thanh toán VNPay / MoMo (Payment Service)</p>
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
            <div className="stat-label">Tổng viện phí đã thu</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{new Intl.NumberFormat('vi-VN').format(totalPending)} đ</div>
            <div className="stat-label">Viện phí đang chờ thanh toán</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div className="stat-value">{payments.length}</div>
            <div className="stat-label">Tổng số giao dịch</div>
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
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
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
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '12px' }}>Chưa thanh toán</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {p.status !== 'PAID' && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => onPayPayment(p.id)}
                        style={{ backgroundColor: '#059669' }}
                      >
                        <QrCode size={13} />
                        <span>Thanh toán ngay</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
