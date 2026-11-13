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

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0] || {};
  const docName = selectedDoctor.fullName || selectedDoctor.name || 'BS. CKI Nguyễn Văn An';
  const docSpecialty = selectedDoctor.specialty || selectedDoctor.specialization || 'Nội Tổng Quát';
  const docPrice = typeof selectedDoctor.price === 'number' ? selectedDoctor.price : 300000;

  const patientDisplayName = (!currentUser?.name || currentUser.name.includes('@') || currentUser.name === 'quan.patient' || currentUser.name === 'Đỗ Minh Quân')
    ? 'Nguyễn Mạnh Quân'
    : currentUser.name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      patientId: currentUser?.userId || 'p2010000-0000-0000-0000-000000000001',
      patientName: patientDisplayName,
      doctorId: selectedDoctor.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      doctorName: docName,
      specialty: docSpecialty,
      specialization: docSpecialty,
      appointmentDate: date,
      appointmentTime: time,
      price: docPrice,
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
              value={patientDisplayName} 
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
              {doctors.map(d => {
                const name = d.fullName || d.name || 'Bác sĩ';
                const spec = d.specialty || d.specialization || 'Đa Khoa';
                const cost = typeof d.price === 'number' ? d.price : 300000;
                return (
                  <option key={d.id} value={d.id}>
                    {name} - {spec} ({new Intl.NumberFormat('vi-VN').format(cost)} đ)
                  </option>
                );
              })}
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
              {new Intl.NumberFormat('vi-VN').format(docPrice)} VNĐ
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
