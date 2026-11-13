import React from 'react';
import { Star, MapPin, Phone, Mail, Calendar, PlusCircle, CheckCircle, Stethoscope } from 'lucide-react';

export default function DoctorsView({ doctors = [], currentUser, onBookWithDoctor }) {
  const role = currentUser?.role || 'PATIENT';
  const isDoctorRole = role === 'DOCTOR';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              {isDoctorRole ? 'Lịch Trực & Ca Khám Chuyên Khoa' : 'Đội Ngũ Bác Sĩ Chuyên Khoa'}
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: isDoctorRole ? '#dbeafe' : '#dcfce7',
              color: isDoctorRole ? '#1d4ed8' : '#15803d'
            }}>
              Doctor Service (Port 8082)
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {isDoctorRole 
              ? 'Thông tin phân bổ phòng khám và lịch trực của các bác sĩ chuyên khoa'
              : 'Chọn bác sĩ phù hợp chuyên khoa và khung giờ để đặt lịch khám ngay'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {doctors.map(doctor => {
          const docName = doctor.fullName || doctor.name || 'Bác sĩ chuyên khoa';
          const docSpecialty = doctor.specialty || doctor.specialization || 'Đa Khoa';
          const docPrice = typeof doctor.price === 'number' ? doctor.price : 300000;
          const docRating = typeof doctor.rating === 'number' ? doctor.rating : 4.9;
          const docExp = typeof doctor.experienceYears === 'number' ? doctor.experienceYears : 10;
          const docRoom = doctor.room || 'Phòng khám đa khoa - Tầng 2';
          const docDays = Array.isArray(doctor.availableDays) && doctor.availableDays.length > 0
            ? doctor.availableDays.join(', ')
            : 'Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6';
          const isMyProfile = isDoctorRole && docName.includes('Nguyễn Văn An');
          const initialChar = docName.split(' ').pop().charAt(0) || 'B';

          return (
            <div 
              key={doctor.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                border: isMyProfile ? '2px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isMyProfile ? '#f8fafc' : '#ffffff',
                boxShadow: isMyProfile ? '0 8px 20px -4px rgba(37, 99, 235, 0.2)' : 'none'
              }}
            >
              <div>
                {/* Highlight banner if this is the logged-in doctor */}
                {isMyProfile && (
                  <div style={{
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #bfdbfe'
                  }}>
                    <Stethoscope size={14} />
                    <span>HỒ SƠ CỦA BẠN (Đang đăng nhập)</span>
                  </div>
                )}

                {/* Doctor Header */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: isMyProfile ? '#dbeafe' : '#f0fdfa',
                    border: `1px solid ${isMyProfile ? '#93c5fd' : '#ccfbf1'}`,
                    color: isMyProfile ? '#1d4ed8' : '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 800
                  }}>
                    {initialChar}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{docName}</h3>
                    <div style={{ 
                      display: 'inline-block', 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      color: isMyProfile ? '#1d4ed8' : '#0d9488', 
                      backgroundColor: isMyProfile ? '#eff6ff' : '#f0fdfa', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      marginTop: '2px' 
                    }}>
                      {docSpecialty}
                    </div>
                  </div>
                </div>

                {/* Meta details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={15} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{docRating}</span>
                    <span>({docExp} năm kinh nghiệm)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} color="#0d9488" />
                    <span>{docRoom}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="#0d9488" />
                    <span>Lịch trực: {docDays}</span>
                  </div>
                </div>
              </div>

              {/* Bottom price and book */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Phí khám</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f766e' }}>
                    {new Intl.NumberFormat('vi-VN').format(docPrice)} đ
                  </span>
                </div>

                {role !== 'DOCTOR' ? (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onBookWithDoctor(doctor)}
                  >
                    <PlusCircle size={14} />
                    <span>Đặt lịch</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                    {isMyProfile ? 'Phòng của bạn' : 'Đồng nghiệp'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
