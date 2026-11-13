import React, { useState } from 'react';
import { isDemoPatient } from '../api/client';
import { 
  Users, FileText, Phone, Mail, MapPin, AlertCircle, Heart, Shield, Lock, Eye, 
  AlertTriangle, CheckCircle2, Activity, Pill, Search, X, ShieldAlert, ArrowRight, UserCheck
} from 'lucide-react';

export default function PatientsView({ patients = [], currentUser }) {
  const role = currentUser?.role || 'PATIENT';
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHipaaBlockedModal, setShowHipaaBlockedModal] = useState(false);

  const isPatientPersonal = role === 'PATIENT';

  // Normalize current patient data (Strictly scoped by patient identity)
  const isDemo = isDemoPatient(currentUser);

  let myRecord = null;
  if (isDemo) {
    myRecord = patients.find(p => p.fullName === 'Nguyễn Mạnh Quân' || p.id === 'p2010000-0000-0000-0000-000000000001') || {
      id: "p2010000-0000-0000-0000-000000000001",
      fullName: "Nguyễn Mạnh Quân",
      dob: "2002-05-15",
      gender: "Nam",
      phone: "0971 234 567",
      email: "quan.patient@example.com",
      address: "Hà Nội",
      bloodGroup: "O+",
      allergies: "Dị ứng Penicillin"
    };
  } else {
    myRecord = patients.find(p => 
      (currentUser?.patientId && p.id === currentUser.patientId) ||
      (currentUser?.userId && p.id === currentUser.userId) ||
      (p.email && currentUser?.email && p.email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (p.fullName && currentUser?.name && p.fullName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
    ) || {
      id: currentUser?.patientId || currentUser?.userId || `p-${Date.now()}`,
      fullName: currentUser?.name || currentUser?.fullName || 'Bệnh nhân mới',
      dob: currentUser?.dob || '2000-01-01',
      gender: currentUser?.gender || 'Nam',
      phone: currentUser?.phone || 'Chưa cập nhật',
      email: currentUser?.email || '',
      address: currentUser?.address || 'Hà Nội',
      bloodGroup: currentUser?.bloodGroup || 'Chưa rõ',
      allergies: currentUser?.allergies || 'Không có'
    };
  }

  // Mock EHR history for modal
  const medicalHistories = {
    "Nguyễn Mạnh Quân": {
      diagnoses: "Viêm họng hạt cấp tính • Theo dõi phản ứng dị ứng Penicillin",
      vitals: "Huyết áp: 120/80 mmHg • Nhịp tim: 74 bpm • Thân nhiệt: 37.2°C • SpO2: 99%",
      doctorName: "BS. Nguyễn Văn An (Khoa Nội)",
      notes: "Cơ địa dị ứng với kháng sinh Penicillin và nhóm Beta-lactam. Tuyệt đối không chỉ định Amoxicillin/Augmentin.",
      prescriptions: [
        { name: "Azithromycin 500mg (Kháng sinh thay thế Macrolide)", dosage: "1 viên", freq: "1 lần/ngày sau ăn sáng", duration: "3 ngày" },
        { name: "Paracetamol 500mg", dosage: "1 viên", freq: "Uống khi sốt > 38.5°C, cách 6 tiếng", duration: "3 ngày" },
        { name: "Alpha Choay", dosage: "2 viên", freq: "2 lần/ngày ngậm dưới lưỡi", duration: "5 ngày" }
      ]
    },
    "Hoàng Mai Linh": {
      diagnoses: "Rối loạn nhịp xoang nhẹ • Đau thắt ngực khi gắng sức",
      vitals: "Huyết áp: 115/75 mmHg • Nhịp tim: 82 bpm • Thân nhiệt: 36.8°C • SpO2: 98%",
      doctorName: "BS. Trần Thị Bích (Khoa Tim mạch)",
      notes: "Bệnh nhân không có tiền sử dị ứng thuốc. Cần đo điện tâm đồ ECG định kỳ và hạn chế cà phê, thức khuya.",
      prescriptions: [
        { name: "Bisoprolol 2.5mg", dosage: "1/2 viên", freq: "1 lần/ngày vào buổi sáng", duration: "30 ngày" },
        { name: "Magnesium B6", dosage: "1 viên", freq: "2 lần/ngày sau ăn", duration: "15 ngày" }
      ]
    },
    "Vũ Tuấn Kiệt": {
      diagnoses: "Viêm phế quản co thắt • Cơ địa dị ứng phấn hoa & Aspirin",
      vitals: "Huyết áp: 125/82 mmHg • Nhịp tim: 78 bpm • Thân nhiệt: 37.0°C • SpO2: 97%",
      doctorName: "BS. Lê Hoàng Minh (Khoa Nhi/Hô hấp)",
      notes: "Tiền sử dị ứng Aspirin và thuốc NSAIDs. Đề phòng co thắt phế quản khi thời tiết giao mùa.",
      prescriptions: [
        { name: "Salbutamol xịt 100mcg", dosage: "2 nhát", freq: "Khi có cơn khó thở", duration: "Theo nhu cầu" },
        { name: "Montelukast 10mg", dosage: "1 viên", freq: "1 lần/ngày trước khi ngủ", duration: "14 ngày" }
      ]
    }
  };

  const getPatientHistory = (name) => {
    return medicalHistories[name] || {
      diagnoses: "Kiểm tra sức khỏe định kỳ tổng quát • Tình trạng ổn định",
      vitals: "Huyết áp: 120/80 mmHg • Nhịp tim: 75 bpm • Thân nhiệt: 36.8°C • SpO2: 99%",
      doctorName: "BS. Nguyễn Văn An (Khoa Khám bệnh)",
      notes: "Chỉ số sinh tồn và xét nghiệm sinh hóa cơ bản trong giới hạn bình thường.",
      prescriptions: [
        { name: "Multivitamin & Khoáng chất", dosage: "1 viên", freq: "1 lần/ngày sau bữa sáng", duration: "30 ngày" }
      ]
    };
  };

  const filteredPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    const fullName = (p.fullName || '').toLowerCase();
    const phone = (p.phone || '').toLowerCase();
    const blood = (p.bloodGroup || '').toLowerCase();
    return fullName.includes(term) || phone.includes(term) || blood.includes(term);
  });

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              {isPatientPersonal ? 'Hồ Sơ Y Tế Cá Nhân (Chuẩn HIPAA)' : 'Danh Sách Hồ Sơ Bệnh Nhân Toàn Viện'}
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: role === 'PATIENT' ? '#dcfce7' : role === 'DOCTOR' ? '#dbeafe' : '#ede9fe',
              color: role === 'PATIENT' ? '#15803d' : role === 'DOCTOR' ? '#1d4ed8' : '#6d28d9',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Shield size={12} />
              patient-service : 8084
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {isPatientPersonal 
              ? 'Phân hệ quản lý hồ sơ sức khỏe cá nhân, nhóm máu và bệnh án điện tử (EHR) theo tiêu chuẩn bảo mật HIPAA' 
              : 'Quản lý thông tin hồ sơ y tế bệnh nhân và tra cứu bệnh án điện tử (Dành cho Bác sĩ & Quản trị viên)'}
          </p>
        </div>

        {/* Status role badge */}
        <div style={{
          padding: '8px 14px',
          borderRadius: '8px',
          backgroundColor: isPatientPersonal ? '#f0fdf4' : '#eff6ff',
          border: `1px solid ${isPatientPersonal ? '#bbf7d0' : '#bfdbfe'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px'
        }}>
          {isPatientPersonal ? (
            <>
              <Lock size={15} color="#16a34a" />
              <span style={{ color: '#15803d', fontWeight: 600 }}>
                Chế độ Bệnh nhân: Giới hạn truy cập hồ sơ của chính mình
              </span>
            </>
          ) : (
            <>
              <UserCheck size={15} color="#2563eb" />
              <span style={{ color: '#1d4ed8', fontWeight: 600 }}>
                Chế độ {role === 'DOCTOR' ? 'Bác sĩ điều trị' : 'Quản trị viên'}: Toàn quyền xem danh bạ & bệnh án
              </span>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: QUYỀN BỆNH NHÂN (PATIENT) - CHỨNG MINH TÍNH NĂNG BẢO MẬT HIPAA
          ========================================================================= */}
      {isPatientPersonal ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
          {/* Cột trái: Hồ sơ sức khỏe cá nhân của Nguyễn Mạnh Quân */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(5, 150, 105, 0.15)'
                  }}>
                    <Heart size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>{myRecord?.fullName}</h3>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span>Mã bệnh nhân:</span>
                      <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', color: '#0f172a' }}>{myRecord?.id}</code>
                    </div>
                  </div>
                </div>

                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  ĐANG ĐĂNG NHẬP
                </span>
              </div>

              {/* Chi tiết thông số lâm sàng & cá nhân */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ngày sinh & Giới tính</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>
                    {myRecord?.dob} (Giới tính: {myRecord?.gender})
                  </div>
                </div>

                {/* Nhóm máu O+ nổi bật */}
                <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontSize: '11px', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Nhóm máu (Blood Group)</span>
                  <div style={{ fontWeight: 900, color: '#1e40af', fontSize: '17px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{myRecord?.bloodGroup}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', background: '#ffffff', padding: '1px 6px', borderRadius: '4px' }}>Nhóm máu Phổ thông</span>
                  </div>
                </div>

                {/* Tiền sử dị ứng & Cảnh báo an toàn (Động theo từng bệnh nhân) */}
                {myRecord?.allergies && myRecord.allergies !== 'Không có' && myRecord.allergies !== 'None' ? (
                  <div style={{ gridColumn: 'span 2', padding: '14px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <AlertTriangle size={15} color="#dc2626" />
                      <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 800, textTransform: 'uppercase' }}>
                        Cảnh báo tiền sử dị ứng thuốc nghiêm trọng
                      </span>
                    </div>
                    <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: '15px' }}>
                      {myRecord?.allergies}
                    </div>
                    <p style={{ fontSize: '11px', color: '#7f1d1d', marginTop: '4px', lineHeight: 1.5 }}>
                      * Khuyến cáo y khoa: Hệ thống tự động gắn cờ chống chỉ định đối với các nhóm thuốc có tiền sử phản ứng quá mẫn ({myRecord?.allergies}).
                    </p>
                  </div>
                ) : (
                  <div style={{ gridColumn: 'span 2', padding: '14px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <CheckCircle2 size={15} color="#16a34a" />
                      <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase' }}>
                        Tiền sử dị ứng & Cảnh báo an toàn
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#15803d', fontSize: '14px' }}>
                      Chưa ghi nhận tiền sử dị ứng thuốc hay thực phẩm
                    </div>
                    <p style={{ fontSize: '11px', color: '#166534', marginTop: '4px', lineHeight: 1.5 }}>
                      * Hồ sơ sức khỏe chưa ghi nhận tiền sử quá mẫn. Bệnh nhân có thể sử dụng các phác đồ điều trị thông thường theo chỉ định của bác sĩ.
                    </p>
                  </div>
                )}

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Số điện thoại liên hệ</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{myRecord?.phone}</div>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Email cá nhân</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{myRecord?.email}</div>
                </div>

                <div style={{ gridColumn: 'span 2', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Địa chỉ thường trú</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{myRecord?.address}</div>
                </div>
              </div>
            </div>

            {/* Bệnh án cá nhân gần nhất */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <FileText size={18} color="#2563eb" />
                  Bệnh Án Cá Nhân & Đơn Thuốc Gần Nhất
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Ngày cập nhật: 28/10/2026</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700 }}>CHẨN ĐOÁN LÂM SÀNG:</div>
                  <div style={{ fontWeight: 700, color: '#1e40af', marginTop: '2px' }}>
                    {getPatientHistory(myRecord.fullName).diagnoses}
                  </div>
                  <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '4px' }}>
                    Bác sĩ khám: {getPatientHistory(myRecord.fullName).doctorName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    {getPatientHistory(myRecord.fullName).prescriptions.length > 0 ? 'Đơn thuốc chỉ định:' : 'Danh mục thuốc điều trị:'}
                  </div>
                  {getPatientHistory(myRecord.fullName).prescriptions.length === 0 ? (
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '12px' }}>
                      Chưa phát sinh đơn thuốc nào cho đợt khám này.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {getPatientHistory(myRecord.fullName).prescriptions.map((rx, idx) => (
                        <div key={idx} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ color: '#0f172a' }}>{rx.name}</strong>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{rx.dosage} • {rx.freq}</div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb' }}>{rx.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: KHỐI CHỨNG MINH TÍNH NĂNG BẢO MẬT HIPAA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Shield size={22} color="#059669" />
                <h3 className="card-title" style={{ margin: 0, color: '#065f46' }}>
                  Tiêu Chuẩn Bảo Mật Y Tế (HIPAA)
                </h3>
              </div>

              <div style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#059669" />
                <span style={{ fontSize: '12px', color: '#065f46', fontWeight: 700 }}>
                  Trạng thái: Đang bảo vệ quyền riêng tư cá nhân
                </span>
              </div>

              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                Hệ thống <strong>MediSync Clinic</strong> áp dụng nghiêm ngặt đạo luật <strong>HIPAA</strong> (Health Insurance Portability and Accountability Act) về bảo vệ hồ sơ sức khỏe điện tử:
              </p>

              <ul style={{ paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.8, marginTop: '10px' }}>
                <li>
                  <strong>Quyền riêng tư tuyệt đối:</strong> Bệnh nhân chỉ được quyền tra cứu và quản lý thông tin bệnh án của chính bản thân mình.
                </li>
                <li>
                  <strong>Chặn truy cập chéo:</strong> Mọi nỗ lực truy cập thông tin bệnh án của bệnh nhân khác đều bị <code>patient-service</code> từ chối.
                </li>
                <li>
                  <strong>Phân quyền RBAC nghiêm ngặt:</strong> Chỉ tài khoản mang vai trò <strong>Bác sĩ (DOCTOR)</strong> hoặc <strong>Quản trị viên (ADMIN)</strong> mới có thẩm quyền mở danh bạ toàn viện.
                </li>
              </ul>

              {/* NÚT THAO TÁC DEMO TRỰC TIẾP TRƯỚC GIẢNG VIÊN */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Thao tác kiểm tra thực tế trước Giảng viên:
                </p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowHipaaBlockedModal(true)}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: '#fff1f2',
                    borderColor: '#fecdd3',
                    color: '#be123c',
                    fontWeight: 700
                  }}
                >
                  <ShieldAlert size={16} color="#be123c" />
                  <span>Thử truy cập hồ sơ bệnh nhân khác (Test HIPAA)</span>
                </button>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px', textAlign: 'center' }}>
                  Bấm nút trên để kiểm chứng cơ chế chặn truy cập trái phép của Microservice
                </span>
              </div>
            </div>

            {/* Thông tin Microservice kiến trúc */}
            <div className="card" style={{ backgroundColor: '#f8fafc' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={15} color="#2563eb" />
                Kiến trúc Backend phụ trách
              </h4>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.7 }}>
                <div>• Service: <strong>patient-service</strong> (Spring Boot 3.3)</div>
                <div>• Cổng mạng (Port): <strong>8084</strong></div>
                <div>• Cơ sở dữ liệu: <strong>patient_db</strong> (PostgreSQL : 55435)</div>
                <div>• Cơ chế bảo vệ: <strong>CurrentUserHolder</strong> xác thực JWT Claim và ném <code>SecurityException (403)</code> khi vi phạm.</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: QUYỀN BÁC SĨ / ADMIN - HIỂN THỊ DANH BẠ TOÀN VIỆN & XEM BỆNH ÁN
            ========================================================================= */
        <div>
          {/* Thanh tìm kiếm & lọc bệnh nhân */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '400px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Tìm bệnh nhân theo tên, SĐT, nhóm máu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Tổng số hồ sơ tiếp nhận: <strong>{filteredPatients.length}</strong> bệnh nhân
            </div>
          </div>

          {/* Bảng danh sách bệnh nhân */}
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
                    <th>Nhóm máu / Cảnh báo dị ứng</th>
                    <th style={{ textAlign: 'right' }}>Thao tác lâm sàng</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(p => {
                    const isQuan = p.fullName === 'Nguyễn Mạnh Quân';
                    return (
                      <tr key={p.id} style={{ backgroundColor: isQuan ? '#f8fafc' : 'transparent' }}>
                        <td>
                          <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {p.id.slice(0, 13)}...
                          </code>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.fullName}</div>
                          {isQuan && (
                            <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700, backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                              Bệnh nhân demo (O+ / Penicillin)
                            </span>
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
                            <span className="status-pill info" style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}>
                              Máu: {p.bloodGroup}
                            </span>
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: p.allergies && p.allergies !== 'Không có' ? '#dc2626' : '#64748b', 
                            fontWeight: p.allergies && p.allergies !== 'Không có' ? 700 : 400,
                            marginTop: '2px' 
                          }}>
                            {p.allergies || 'Không có'}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedPatient(p)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <FileText size={13} />
                            <span>Xem bệnh án</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: BÁC SĨ / ADMIN XEM CHI TIẾT BỆNH ÁN ĐIỆN TỬ (EHR)
          ========================================================================= */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Hồ Sơ Bệnh Án Điện Tử (EHR)</h3>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                    Quyền Bác sĩ: Đã xác thực
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
                  Bệnh nhân: <strong>{selectedPatient.fullName}</strong> • Mã hồ sơ: <code>{selectedPatient.id}</code>
                </p>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedPatient(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Thẻ thông tin hành chính & Cảnh báo dị ứng */}
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><strong>Ngày sinh:</strong> {selectedPatient.dob} ({selectedPatient.gender})</div>
                <div>
                  <strong>Nhóm máu:</strong> <span style={{ color: '#2563eb', fontWeight: 800 }}>{selectedPatient.bloodGroup}</span>
                </div>
                <div style={{ gridColumn: 'span 2', color: selectedPatient.allergies !== 'Không có' ? '#dc2626' : '#15803d', fontWeight: 700 }}>
                  <strong>Tiền sử dị ứng:</strong> {selectedPatient.allergies}
                </div>
                <div><strong>Số điện thoại:</strong> {selectedPatient.phone}</div>
                <div><strong>Email:</strong> {selectedPatient.email}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Địa chỉ:</strong> {selectedPatient.address}</div>
              </div>

              {/* Chẩn đoán lâm sàng gần nhất */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
                  Chẩn Đoán Lâm Sàng & Chỉ Số Sinh Tồn
                </h4>
                <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '13px' }}>
                  <div style={{ color: '#1e40af', fontWeight: 700 }}>
                    Chẩn đoán: {getPatientHistory(selectedPatient.fullName).diagnoses}
                  </div>
                  <div style={{ color: '#2563eb', fontSize: '12px', marginTop: '4px' }}>
                    Chỉ số sinh tồn: {getPatientHistory(selectedPatient.fullName).vitals}
                  </div>
                  <div style={{ color: '#475569', fontSize: '12px', marginTop: '6px', fontStyle: 'italic' }}>
                    Ghi chú bác sĩ: "{getPatientHistory(selectedPatient.fullName).notes}"
                  </div>
                </div>
              </div>

              {/* Phác đồ đơn thuốc điều trị */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
                  Đơn Thuốc Chỉ Định (Prescriptions)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {getPatientHistory(selectedPatient.fullName).prescriptions.map((rx, idx) => (
                    <div key={idx} style={{ padding: '10px 14px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>{rx.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Liều lượng: {rx.dosage} • Tần suất: {rx.freq}</div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                        {rx.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chứng chỉ bác sĩ ký duyệt */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Bác sĩ điều trị phụ trách:</span>
                <strong style={{ color: '#0f172a' }}>{getPatientHistory(selectedPatient.fullName).doctorName}</strong>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={13} /> Dữ liệu được mã hóa chuẩn HIPAA bởi patient-service
              </span>
              <button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: MÔ PHỎNG & CHỨNG MINH LỖI 403 FORBIDDEN KHI VI PHẠM HIPAA
          ========================================================================= */}
      {showHipaaBlockedModal && (
        <div className="modal-overlay" onClick={() => setShowHipaaBlockedModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px', borderTop: '4px solid #dc2626' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldAlert size={22} color="#dc2626" />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                    403 FORBIDDEN - TRUY CẬP BỊ TỪ CHỐI
                  </h3>
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                    Vi phạm chính sách quyền riêng tư y tế HIPAA
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowHipaaBlockedModal(false)}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ padding: '14px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', color: '#7f1d1d', lineHeight: 1.6 }}>
                <strong>patient-service (Port 8084)</strong> đã chặn truy vấn dữ liệu chéo:
                <div style={{ marginTop: '8px', background: '#ffffff', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px', border: '1px solid #fee2e2' }}>
                  <div><strong>HTTP Status:</strong> 403 FORBIDDEN</div>
                  <div><strong>Endpoint:</strong> GET /api/patients</div>
                  <div><strong>Tài khoản:</strong> {myRecord?.fullName || 'Bệnh nhân'} (Role: PATIENT)</div>
                  <div><strong>Lý do chặn:</strong> Required role: DOCTOR or ADMIN</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Nguyên tắc bảo vệ dữ liệu trong Hệ Thống Microservices:
                </h4>
                <ul style={{ paddingLeft: '18px', color: '#475569', fontSize: '12px', lineHeight: 1.7 }}>
                  <li>Bệnh nhân chỉ được phép xem thông tin sức khỏe của chính mình qua <code>GET /api/patients/me</code>.</li>
                  <li>Bất kỳ hành vi cố gắng tra cứu danh sách toàn viện hoặc ID người khác đều bị tầng Security của <strong>patient-service</strong> ném <code>SecurityException</code>.</li>
                  <li>Để xem được danh bạ toàn viện, vui lòng chuyển đổi vai trò sang <strong>Bác sĩ</strong> hoặc <strong>Admin</strong> trên thanh menu Header.</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '18px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowHipaaBlockedModal(false)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Đã hiểu cơ chế bảo mật HIPAA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
