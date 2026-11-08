import React from 'react';
import { Star, MapPin, Phone, Mail, Calendar, PlusCircle } from 'lucide-react';

export default function DoctorsView({ doctors, onBookWithDoctor }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Danh Sách Bác Sĩ Chuyên Khoa</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Đội ngũ bác sĩ phụ trách khám và điều trị tại phòng khám</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {doctors.map(doctor => (
          <div key={doctor.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Doctor Header */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  color: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 800
                }}>
                  {doctor.fullName.split(' ').pop().charAt(0)}
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{doctor.fullName}</h3>
                  <div style={{ display: 'inline-block', fontSize: '12px', fontWeight: 600, color: '#0d9488', backgroundColor: '#f0fdfa', padding: '2px 8px', borderRadius: '4px', marginTop: '2px' }}>
                    {doctor.specialty}
                  </div>
                </div>
              </div>

              {/* Meta details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={15} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{doctor.rating}</span>
                  <span>({doctor.experienceYears} năm kinh nghiệm)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="#0d9488" />
                  <span>{doctor.room}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={15} color="#0d9488" />
                  <span>Lịch trực: {doctor.availableDays.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Bottom price and book */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Phí khám ban đầu</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f766e' }}>
                  {new Intl.NumberFormat('vi-VN').format(doctor.price)} đ
                </span>
              </div>

              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onBookWithDoctor(doctor)}
              >
                <PlusCircle size={14} />
                <span>Đặt lịch</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
