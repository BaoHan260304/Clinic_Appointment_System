import React, { useState } from 'react';
import { QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PaymentModal({ appointment, onClose, onConfirmPayment }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const amount = 300000;

  const handlePay = async () => {
    setIsProcessing(true);
    await onConfirmPayment(appointment.id);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', textAlign: 'center' }}>
        <div className="modal-header" style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 auto' }}>Cổng Thanh Toán Viện Phí</h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Thanh toán nhanh qua mã QR chuyển khoản hoặc VNPAY
        </p>

        {/* Fake QR Box */}
        <div style={{
          background: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '24px',
          margin: '0 auto 20px',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* SVG QR Code Simulation */}
          <div style={{ width: '160px', height: '160px', background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={130} color="#0f172a" />
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', fontWeight: 600 }}>
            Quét mã qua App Ngân hàng hoặc Ví VNPAY
          </span>
        </div>

        {/* Invoice Info */}
        <div style={{ textAlign: 'left', background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Bệnh nhân:</span>
            <strong>{appointment.patientName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748b' }}>Bác sĩ khám:</span>
            <strong>{appointment.doctorName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #a7f3d0' }}>
            <span style={{ fontWeight: 700, color: '#0f766e' }}>Tổng tiền thanh toán:</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f766e' }}>
              {new Intl.NumberFormat('vi-VN').format(amount)} VNĐ
            </span>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '12px', fontSize: '14px', backgroundColor: '#059669' }}
          onClick={handlePay}
          disabled={isProcessing}
        >
          <ShieldCheck size={18} />
          <span>{isProcessing ? 'Đang gửi xác nhận sang Payment Service...' : 'Xác Nhận Đã Thanh Toán'}</span>
        </button>
      </div>
    </div>
  );
}
