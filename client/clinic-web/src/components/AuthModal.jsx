import React, { useState } from 'react';
import { User, Lock, LogIn, UserPlus, Sparkles, Stethoscope, Heart, Phone, Mail, Calendar, Key, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { api } from '../api/client';

export default function AuthModal({ onClose, onLoginSuccess, onRegisterSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('quan.patient@example.com');
  const [loginPassword, setLoginPassword] = useState('secret123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('quan.patient@example.com');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: input email, 2: input otp & new pass

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await api.forgotPassword(forgotEmail);
      setLoading(false);
      setForgotOtp('888666'); // preset demo
      setForgotStep(2);
      setSuccessMessage('Mã OTP xác thực đã được gửi về email qua RabbitMQ! Mã thử nghiệm: 888666');
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Không thể gửi mã OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotOtp) {
      setErrorMessage('Vui lòng nhập mã OTP xác thực');
      return;
    }
    if (forgotNewPass.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await api.resetPassword(forgotEmail, forgotOtp, forgotNewPass);
      setLoading(false);
      setSuccessMessage('🎉 Đặt lại mật khẩu thành công! Đang chuyển về màn hình đăng nhập...');
      setLoginEmail(forgotEmail);
      setLoginPassword(forgotNewPass);
      setTimeout(() => {
        setActiveTab('login');
        setForgotStep(1);
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Đặt lại mật khẩu thất bại');
    }
  };

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('PATIENT');
  const [regDob, setRegDob] = useState('2000-01-01');
  const [regGender, setRegGender] = useState('Nam');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regAllergies, setRegAllergies] = useState('Không có');
  const [regSpecialty, setRegSpecialty] = useState('Nội Tổng Quát');

  const handleLoginSubmit = async (customEmail, customPass) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const email = customEmail || loginEmail;
      const pass = customPass || loginPassword;
      await onLoginSuccess(email, pass);
      setLoading(false);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Đăng nhập không thành công');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!regFullName || !regEmail || !regPassword) {
      setErrorMessage('Vui lòng điền đầy đủ các thông tin bắt buộc');
      setLoading(false);
      return;
    }

    try {
      const formData = {
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: regRole,
        dob: regDob,
        gender: regGender,
        bloodGroup: regBloodGroup,
        allergies: regAllergies,
        specialty: regSpecialty
      };
      await onRegisterSuccess(formData);
      setLoading(false);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Đăng ký thất bại');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: activeTab === 'register' ? '540px' : '440px', transition: 'max-width 0.2s ease' }}>
        
        {/* Header with Close */}
        <div className="modal-header" style={{ marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Tài Khoản & Xác Thực</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Hệ thống Quản lý Người dùng (User Service & JWT)</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Tab switchers: Đăng nhập vs Đăng ký */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '4px', backgroundColor: '#f1f5f9', borderRadius: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', boxShadow: activeTab === 'login' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', fontWeight: 700 }}
            onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
          >
            <LogIn size={15} />
            <span>Đăng Nhập</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', boxShadow: activeTab === 'register' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', fontWeight: 700 }}
            onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
          >
            <UserPlus size={15} />
            <span>Đăng Ký Tài Khoản</span>
          </button>
        </div>

        {errorMessage && (
          <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{ padding: '10px 14px', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ===================== TAB 1: LOGIN ===================== */}
        {activeTab === 'login' && (
          <div>
            {/* Quick Demo 1-Click Login Presets */}
            <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0f766e', marginBottom: '10px' }}>
                <Sparkles size={14} />
                <span>Đăng nhập nhanh 1-Click (Demo SV/GV):</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  style={{ justifyContent: 'flex-start', background: 'white', fontSize: '12px' }}
                  onClick={() => handleLoginSubmit('quan.patient@example.com', 'secret123')}
                >
                  👤 <strong>Bệnh nhân</strong>: Nguyễn Mạnh Quân (quan.patient@example.com)
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  style={{ justifyContent: 'flex-start', background: 'white', fontSize: '12px' }}
                  onClick={() => handleLoginSubmit('bs.an@clinic.local', 'secret123')}
                >
                  🩺 <strong>Bác sĩ</strong>: BS. CKI Nguyễn Văn An (bs.an@clinic.local)
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  style={{ justifyContent: 'flex-start', background: 'white', fontSize: '12px' }}
                  onClick={() => handleLoginSubmit('admin@medisync.local', 'secret123')}
                >
                  🛡️ <strong>Quản trị viên</strong>: Admin (admin@medisync.local)
                </button>
              </div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }}>
              <div className="form-group">
                <label className="form-label">Email hoặc Tên đăng nhập</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '36px' }}
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Mật khẩu</label>
                  <button 
                    type="button" 
                    onClick={() => { setActiveTab('forgot'); setErrorMessage(null); setSuccessMessage(null); setForgotStep(1); }}
                    style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ paddingLeft: '36px' }}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '11px', marginTop: '10px', fontSize: '14px' }}
                disabled={loading}
              >
                <LogIn size={16} />
                <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ===================== TAB 2: REGISTER ===================== */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            {/* Role picker */}
            <div className="form-group">
              <label className="form-label">Bạn muốn đăng ký tài khoản với tư cách gì?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: `2px solid ${regRole === 'PATIENT' ? '#0d9488' : '#e2e8f0'}`,
                    backgroundColor: regRole === 'PATIENT' ? '#f0fdfa' : '#ffffff',
                    color: regRole === 'PATIENT' ? '#0f766e' : '#64748b',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onClick={() => setRegRole('PATIENT')}
                >
                  <Heart size={16} />
                  <span>Bệnh Nhân</span>
                </button>

                <button
                  type="button"
                  className="btn btn-sm"
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: `2px solid ${regRole === 'DOCTOR' ? '#2563eb' : '#e2e8f0'}`,
                    backgroundColor: regRole === 'DOCTOR' ? '#eff6ff' : '#ffffff',
                    color: regRole === 'DOCTOR' ? '#1e40af' : '#64748b',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onClick={() => setRegRole('DOCTOR')}
                >
                  <Stethoscope size={16} />
                  <span>Bác Sĩ Khám</span>
                </button>
              </div>
            </div>

            {/* General Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={regRole === 'DOCTOR' ? 'BS. Trần Văn Hùng' : 'Nguyễn Thị Hoa'}
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="0912 345 678"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Địa chỉ Email *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu *</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Patient Specific Fields */}
            {regRole === 'PATIENT' && (
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Thông tin sức khỏe ban đầu:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '2px' }}>Ngày sinh</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      style={{ fontSize: '12px', padding: '6px' }}
                      value={regDob}
                      onChange={e => setRegDob(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '2px' }}>Giới tính</label>
                    <select 
                      className="form-input" 
                      style={{ fontSize: '12px', padding: '6px' }}
                      value={regGender}
                      onChange={e => setRegGender(e.target.value)}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '2px' }}>Nhóm máu</label>
                    <select 
                      className="form-input" 
                      style={{ fontSize: '12px', padding: '6px' }}
                      value={regBloodGroup}
                      onChange={e => setRegBloodGroup(e.target.value)}
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '2px' }}>Tiền sử dị ứng thuốc</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ví dụ: Dị ứng Penicillin, Hải sản, hoặc ghi Không có"
                    style={{ fontSize: '12px', padding: '6px' }}
                    value={regAllergies}
                    onChange={e => setRegAllergies(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Doctor Specific Fields */}
            {regRole === 'DOCTOR' && (
              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>
                  Thông tin chuyên môn bác sĩ:
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginBottom: '2px' }}>Chuyên khoa phụ trách *</label>
                  <select 
                    className="form-input" 
                    style={{ fontSize: '13px' }}
                    value={regSpecialty}
                    onChange={e => setRegSpecialty(e.target.value)}
                  >
                    <option value="Nội Tổng Quát">Nội Tổng Quát</option>
                    <option value="Tim Mạch">Tim Mạch</option>
                    <option value="Nhi Khoa">Nhi Khoa</option>
                    <option value="Da Liễu">Da Liễu</option>
                    <option value="Tai Mũi Họng">Tai Mũi Họng</option>
                    <option value="Mắt">Mắt</option>
                    <option value="Chấn Thương Chỉnh Hình">Chấn Thương Chỉnh Hình</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '11px', fontSize: '14px' }}
              disabled={loading}
            >
              <UserPlus size={16} />
              <span>{loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản & Đăng Nhập'}</span>
            </button>
          </form>
        )}


        {/* ===================== TAB 3: FORGOT PASSWORD ===================== */}
        {activeTab === 'forgot' && (
          <div>
            <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#0f766e', marginBottom: '4px' }}>
                <Key size={16} />
                <span>Khôi Phục Mật Khẩu Qua Email (RabbitMQ)</span>
              </div>
              <p style={{ fontSize: '12px', color: '#115e59', margin: 0, lineHeight: 1.5 }}>
                Nhập email đã đăng ký. Hệ thống sẽ phát sinh sự kiện OTP qua <strong>RabbitMQ</strong> và <strong>Notification Service</strong> sẽ gửi mã xác nhận đến hòm thư của bạn.
              </p>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label">Email tài khoản cần khôi phục</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                    <input 
                      type="email" 
                      className="form-input" 
                      style={{ paddingLeft: '36px' }}
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="ví dụ: quan.patient@example.com"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '11px', marginTop: '10px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  disabled={loading}
                >
                  <Send size={16} />
                  <span>{loading ? 'Đang gửi mã qua RabbitMQ...' : 'Gửi Mã Xác Thực OTP'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={forgotEmail}
                    disabled
                    style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Mã xác thực OTP (6 chữ số)</label>
                    <span style={{ fontSize: '11px', color: '#0d9488', fontWeight: 600 }}>Thử nghiệm: 888666</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Key size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ paddingLeft: '36px', letterSpacing: '2px', fontWeight: 700 }}
                      value={forgotOtp}
                      onChange={e => setForgotOtp(e.target.value)}
                      placeholder="888666"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mật khẩu mới</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                    <input 
                      type="password" 
                      className="form-input" 
                      style={{ paddingLeft: '36px' }}
                      value={forgotNewPass}
                      onChange={e => setForgotNewPass(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Xác nhận mật khẩu mới</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                    <input 
                      type="password" 
                      className="form-input" 
                      style={{ paddingLeft: '36px' }}
                      value={forgotConfirmPass}
                      onChange={e => setForgotConfirmPass(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '11px', marginTop: '10px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  disabled={loading}
                >
                  <CheckCircle2 size={16} />
                  <span>{loading ? 'Đang cập nhật mật khẩu...' : 'Xác Nhận Đổi Mật Khẩu'}</span>
                </button>
              </form>
            )}

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => { setActiveTab('login'); setErrorMessage(null); setSuccessMessage(null); setForgotStep(1); }}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} />
                <span>Quay lại Đăng nhập</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
