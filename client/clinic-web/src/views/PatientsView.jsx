import React, { useState } from 'react';
import { Users, FileText, Phone, Mail, MapPin, AlertCircle, Heart, Shield, Lock, Eye } from 'lucide-react';

export default function PatientsView({ patients = [], currentUser }) {
  const role = currentUser?.role || 'PATIENT';
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewScope, setViewScope] = useState('AUTO');

  const isPatientPersonal = role === 'PATIENT' && viewScope === 'AUTO';
  const myRecord = patients.find(p => p.fullName === 'Nguyễn Mạnh Quân') || patients[0];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              {isPatientPersonal ? 'Hồ Sơ Y Tế Cá Nhân' : 'Danh Sách Hồ Sơ Bệnh Nhân Toàn Viện'}
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: role === 'PATIENT' ? '#dcfce7' : role === 'DOCTOR' ? '#dbeafe' : '#ede9fe',
              color: role === 'PATIENT' ? '#15803d' : role === 'DOCTOR' ? '#1d4ed8' : '#6d28d9'
            }}>
              Patient Service
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {isPatientPersonal 
              ? 'Thông tin sức khỏe cá nhân, nhóm máu và tiền sử bệnh án được mã hóa bảo mật' 
              : 'Quản lý thông tin cá nhân và lịch sử bệnh án (Bác sĩ & Quản trị viên)'}
          </p>
        </div>

        {role === 'PATIENT' && (
          <button
            className={`btn btn-sm ${viewScope === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewScope(prev => prev === 'AUTO' ? 'ALL' : 'AUTO')}
            title="Kiểm tra phân quyền: Xem thử danh sách bệnh nhân toàn viện"
          >
            <Eye size={14} />
            <span>{viewScope === 'AUTO' ? 'Xem danh bạ toàn viện (Admin Mode)' : 'Về hồ sơ của tôi'}</span>
          </button>
        )}
      </div>

      {/* IF PATIENT PERSONAL VIEW */}
      {isPatientPersonal ? (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{myRecord?.fullName}</h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Mã bệnh nhân: <code>{myRecord?.id}</code></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Ngày sinh:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{myRecord?.dob} (Giới tính: {myRecord?.gender})</div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Nhóm máu:</span>
                <div style={{ fontWeight: 800, color: '#2563eb' }}>{myRecord?.bloodGroup}</div>
              </div>

              <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>Tiền sử dị ứng thuốc:</span>
                <div style={{ fontWeight: 800, color: '#b91c1c' }}>{myRecord?.allergies}</div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Số điện thoại:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{myRecord?.phone}</div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Email:</span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{myRecord?.email}</div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Địa chỉ liên hệ:</span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{myRecord?.address}</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '14px', borderRadius: '8px', backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={18} color="#0d9488" />
              <span style={{ fontSize: '12px', color: '#0f766e' }}>
                Hồ sơ sức khỏe của bạn được đồng bộ và bảo mật bởi <strong>patient-service</strong> (Port 8084).
              </span>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '12px' }}>Quy Định Bảo Mật Y Tế (HIPAA)</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Để bảo vệ quyền riêng tư cá nhân của bệnh nhân theo luật y tế:
            </p>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: 1.8, marginTop: '8px' }}>
              <li>Bệnh nhân không được quyền tra cứu bệnh án của bệnh nhân khác.</li>
              <li>Chỉ Bác sĩ điều trị và Quản trị viên phòng khám mới có quyền mở hồ sơ bệnh án.</li>
            </ul>
          </div>
        </div>
      ) : (
        /* TABLE FOR DOCTORS AND ADMIN */
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
                      {p.fullName === 'Nguyễn Mạnh Quân' && (
                        <span style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>Bệnh nhân đăng nhập</span>
                      )}
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
      )}

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
                <div style={{ color: '#dc2626' }}><strong>Tiền sử dị ứng:</strong> {selectedPatient.allergies}</div>
                <div><strong>Số điện thoại:</strong> {selectedPatient.phone}</div>
                <div><strong>Email:</strong> {selectedPatient.email}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Địa chỉ:</strong> {selectedPatient.address}</div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Chẩn Đoán Gần Nhất</h4>
                <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '13px', color: '#1e40af' }}>
                  Huyết áp: 120/80 mmHg • Nhịp tim: 75 bpm • Tình trạng sức khỏe ổn định. Đề nghị tái khám định kỳ sau 3 tháng.
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
