import React from 'react';
import { Bell, Mail, MessageSquare, CheckCircle, Radio } from 'lucide-react';

export default function NotificationsView({ notifications }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Hệ Thống Thông Báo Sự Kiện (RabbitMQ)</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Thông báo được phát sinh từ các Domain Event và gửi tự động qua Notification Service
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.map(n => (
          <div key={n.id} className="card" style={{ marginBottom: 0, padding: '20px', display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: n.channel === 'EMAIL' ? '#eff6ff' : '#ecfdf5',
              color: n.channel === 'EMAIL' ? '#2563eb' : '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {n.channel === 'EMAIL' ? <Mail size={20} /> : <MessageSquare size={20} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{n.title}</h4>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{n.time}</span>
              </div>

              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                {n.body}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, color: '#475569' }}>
                  Kênh: {n.channel} ({n.destination})
                </span>
                <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <CheckCircle size={13} /> {n.status === 'SENT' ? 'Đã gửi thành công' : 'Đang xử lý'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
