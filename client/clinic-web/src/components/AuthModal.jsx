import React, { useState } from 'react';
import { User, Lock, LogIn, Sparkles } from 'lucide-react';

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('quan.patient@example.com');
  const [password, setPassword] = useState('secret123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (customEmail) => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(customEmail || email);
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Đăng Nhập Tài Khoản</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Hệ thống xác thực JWT (User Service)</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Quick Demo Login Presets */}
        <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0f766e', marginBottom: '10px' }}>
            <Sparkles size={14} />
            <span>Phím tắt đăng nhập demo cho SV/GV:</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              style={{ justifyContent: 'flex-start', background: 'white' }}
              onClick={() => handleLogin('quan.patient@example.com')}
            >
              👤 Đăng nhập quyền <strong>Bệnh nhân</strong> (Đỗ Minh Quân)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              style={{ justifyContent: 'flex-start', background: 'white' }}
              onClick={() => handleLogin('bs.an@clinic.local')}
            >
              🩺 Đăng nhập quyền <strong>Bác sĩ</strong> (BS. CKI Nguyễn Văn An)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              style={{ justifyContent: 'flex-start', background: 'white' }}
              onClick={() => handleLogin('admin@clinic.local')}
            >
              🛡️ Đăng nhập quyền <strong>Quản trị viên</strong> (Admin)
            </button>
          </div>
        </div>

        {/* Standard form */}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="form-group">
            <label className="form-label">Email hoặc Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            disabled={loading}
          >
            <LogIn size={16} />
            <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
