import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react';

export default function NewAppointmentModal({ 
  doctors, 
  currentUser, 
  initialDoctor, 
  onClose, 
  onSubmit 
}) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctor ? initialDoctor.id : (doctors[0]?.id || ''));
  const [date, setDate] = useState('2026-11-15');
  const [time, setTime] = useState('09:00 - 09:30');
  const [reason, setReason] = useState('Khám sức khỏe tổng quát');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      patientId: currentUser?.userId || 'p2010000-0000-0000-0000-000000000001',
      patientName: currentUser?.name || 'Đỗ Minh Quân',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.fullName,
      specialty: selectedDoctor.specialty,
      appointmentDate: date,
      appointmentTime: time,
      price: selectedDoctor.price,
      reason
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Đặt Lịch Khám Bệnh Mới</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Nhập thông tin lịch hẹn để đăng ký với bác sĩ</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Info */}
          <div className="form-group">
            <label className="form-label">Bệnh nhân đặt lịch</label>
            <input 
              type="text" 
              className="form-input" 
              value={currentUser?.name || 'Đỗ Minh Quân'} 
              disabled 
              style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
            />
          </div>

          {/* Doctor Selection */}
          <div className="form-group">
            <label className="form-label">Chọn Bác Sĩ & Chuyên Khoa</label>
            <select 
              className="form-select"
              value={selectedDoctorId}
              onChange={e => setSelectedDoctorId(e.target.value)}
              required
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.fullName} - {d.specialty} ({new Intl.NumberFormat('vi-VN').format(d.price)} đ)
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Ngày khám</label>
              <input 
                type="date" 
                className="form-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Khung giờ khám (Slot)</label>
              <select 
                className="form-select"
                value={time}
                onChange={e => setTime(e.target.value)}
              >
                <option value="08:00 - 08:30">08:00 - 08:30 (Sáng)</option>
                <option value="09:00 - 09:30">09:00 - 09:30 (Sáng)</option>
                <option value="10:00 - 10:30">10:00 - 10:30 (Sáng)</option>
                <option value="14:00 - 14:30">14:00 - 14:30 (Chiều)</option>
                <option value="15:30 - 16:00">15:30 - 16:00 (Chiều)</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">Lý do khám / Triệu chứng</label>
            <textarea 
              className="form-textarea" 
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Mô tả triệu chứng hoặc nhu cầu khám..."
              required
            />
          </div>

          {/* Price summary */}
          <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#0f766e', fontWeight: 600 }}>Tạm tính viện phí:</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f766e' }}>
              {new Intl.NumberFormat('vi-VN').format(selectedDoctor?.price || 300000)} VNĐ
            </span>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Đang gửi yêu cầu...' : 'Xác Nhận Đặt Lịch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
