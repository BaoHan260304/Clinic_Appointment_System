import React, { useState } from 'react';
import { Users, FileText, Phone, Mail, MapPin, AlertCircle, Heart } from 'lucide-react';

export default function PatientsView({ patients }) {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Danh Sách Hồ Sơ Bệnh Nhân</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Quản lý thông tin cá nhân và lịch sử bệnh án (Patient Service)</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã bệnh nhân</th>
                <th>Họ và tên</th>
                <th>Ngày sinh & Giới tính</th>
                <th>Số điện thoại & Email</th>
                <th>Địa chỉ</th>
                <th>Nhóm máu / Tiền sử</th>
                <th style={{ textAlign: 'right' }}>Hồ sơ y tế</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td>
                    <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                      {p.id.slice(0, 13)}...
                    </code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.fullName}</div>
                  </td>
                  <td>
                    <div>{p.dob}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Giới tính: {p.gender}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={12} color="#64748b" />
                      <span>{p.phone}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{p.email}</div>
                  </td>
                  <td>{p.address}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="status-pill info" style={{ padding: '2px 8px', fontSize: '11px' }}>
                        Máu: {p.bloodGroup}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '2px' }}>
                      {p.allergies}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedPatient(p)}
                    >
                      <FileText size={13} />
                      <span>Xem bệnh án</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Medical Record Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Hồ Sơ Bệnh Án Điện Tử</h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Bệnh nhân: {selectedPatient.fullName}</p>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedPatient(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><strong>Ngày sinh:</strong> {selectedPatient.dob}</div>
                <div><strong>Giới tính:</strong> {selectedPatient.gender}</div>
                <div><strong>Nhóm máu:</strong> {selectedPatient.bloodGroup}</div>
                <div><strong>Dị ứng:</strong> <span style={{ color: '#dc2626' }}>{selectedPatient.allergies}</span></div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
                  Lịch Sử Các Lần Khám & Toa Thuốc
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#0d9488' }}>Khám Nội Tổng Quát</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>05/11/2026 - BS. CKI Nguyễn Văn An</span>
                    </div>
                    <div style={{ fontSize: '13px', marginBottom: '6px' }}>
                      <strong>Chẩn đoán:</strong> Huyết áp hơi cao nhẹ do căng thẳng, thể trạng bình thường.
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: '6px' }}>
                      <strong>Đơn thuốc:</strong> Amlodipine 5mg (1 viên/ngày buổi sáng), Vitamin tổng hợp (30 ngày).
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
