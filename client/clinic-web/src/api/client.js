import {
  initialDoctors,
  initialPatients,
  initialAppointments,
  initialPayments,
  initialNotifications
} from './mockData';

const STORAGE_KEYS = {
  MODE: 'clinic_app_mode', // 'gateway' or 'mock'
  TOKEN: 'clinic_access_token',
  USER: 'clinic_current_user',
  APPOINTMENTS: 'clinic_appointments_data',
  PAYMENTS: 'clinic_payments_data',
  DOCTORS: 'clinic_doctors_data',
  NOTIFICATIONS: 'clinic_notifications_data'
};

// Khởi tạo localStorage nếu chưa có
function getStoredData(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStoredData(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

export const api = {
  getMode() {
    return localStorage.getItem(STORAGE_KEYS.MODE) || 'mock';
  },

  setMode(mode) {
    localStorage.setItem(STORAGE_KEYS.MODE, mode);
  },

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken(token) {
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    else localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getCurrentUser() {
    return getStoredData(STORAGE_KEYS.USER, {
      userId: 'p2010000-0000-0000-0000-000000000001',
      name: 'Đỗ Minh Quân',
      email: 'quan.patient@example.com',
      role: 'PATIENT'
    });
  },

  setCurrentUser(user) {
    setStoredData(STORAGE_KEYS.USER, user);
  },

  // HTTP Helper cho Gateway
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errText = await res.text();
      let errJson = null;
      try { errJson = JSON.parse(errText); } catch (e) {}
      throw new Error(errJson?.message || errText || `Lỗi HTTP ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return null;
  },

  // Auth APIs
  async login(email, password) {
    if (this.getMode() === 'gateway') {
      try {
        const res = await this.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        this.setToken(res.accessToken);
        return res;
      } catch (err) {
        console.warn('Gateway error, fallback to mock login:', err.message);
      }
    }

    // Mock Login
    let role = 'PATIENT';
    let name = 'Đỗ Minh Quân';
    if (email.includes('doctor') || email.includes('bs.')) {
      role = 'DOCTOR';
      name = 'BS. CKI Nguyễn Văn An';
    } else if (email.includes('admin')) {
      role = 'ADMIN';
      name = 'Quản trị viên Hệ thống';
    }

    const mockUser = {
      userId: 'p2010000-0000-0000-0000-000000000001',
      name,
      email,
      role
    };
    this.setCurrentUser(mockUser);
    this.setToken('mock_jwt_token_' + Date.now());
    return { success: true, user: mockUser };
  },

  // Appointments
  async getAppointments() {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request('/api/appointments');
      } catch (e) {
        console.warn('Gateway offline, using local store:', e.message);
      }
    }
    return getStoredData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  },

  async createAppointment(data) {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request('/api/appointments', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      } catch (e) {
        console.warn('Gateway offline, fallback to mock:', e.message);
      }
    }

    const list = await this.getAppointments();
    const newAppointment = {
      id: `a301-mock-${Date.now()}`,
      patientId: data.patientId || 'p2010000-0000-0000-0000-000000000001',
      patientName: data.patientName || 'Đỗ Minh Quân',
      doctorId: data.doctorId,
      doctorName: data.doctorName || 'Bác sĩ chuyên khoa',
      specialty: data.specialty || 'Đa Khoa',
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime || '09:00 - 09:30',
      status: 'PENDING',
      paymentStatus: 'AWAITING_PAYMENT',
      reason: data.reason || 'Khám tổng quát',
      createdAt: new Date().toLocaleString('vi-VN')
    };

    const updated = [newAppointment, ...list];
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);

    // Cũng tạo 1 bản ghi payment pending
    const payments = await this.getPayments();
    const newPayment = {
      id: `pay-${Date.now()}`,
      appointmentId: newAppointment.id,
      patientName: newAppointment.patientName,
      amount: data.price || 300000,
      currency: 'VND',
      method: 'VNPAY_QR',
      status: 'PENDING',
      paidAt: null,
      transactionCode: `TXN_${Date.now()}`
    };
    setStoredData(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);

    return newAppointment;
  },

  async cancelAppointment(appointmentId, reason = 'Bệnh nhân bận việc đột xuất') {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request(`/api/appointments/${appointmentId}/cancel`, {
          method: 'POST',
          body: JSON.stringify({ reason })
        });
      } catch (e) {
        console.warn('Gateway offline, updating local mock:', e.message);
      }
    }

    const list = await this.getAppointments();
    const updated = list.map(item =>
      item.id === appointmentId ? { ...item, status: 'CANCELED', cancelReason: reason } : item
    );
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);
    return { success: true };
  },

  async confirmAppointment(appointmentId) {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request(`/api/appointments/${appointmentId}/confirm`, {
          method: 'POST'
        });
      } catch (e) {
        console.warn('Gateway offline, updating local mock:', e.message);
      }
    }

    const list = await this.getAppointments();
    const updated = list.map(item =>
      item.id === appointmentId ? { ...item, status: 'CONFIRMED' } : item
    );
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);
    return { success: true };
  },

  // Doctors
  async getDoctors() {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request('/api/doctors');
      } catch (e) {}
    }
    return getStoredData(STORAGE_KEYS.DOCTORS, initialDoctors);
  },

  // Patients
  async getPatients() {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request('/api/patients');
      } catch (e) {}
    }
    return initialPatients;
  },

  // Payments
  async getPayments() {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request('/api/payments');
      } catch (e) {}
    }
    return getStoredData(STORAGE_KEYS.PAYMENTS, initialPayments);
  },

  async payPayment(paymentId) {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request(`/api/payments/${paymentId}/pay`, {
          method: 'POST'
        });
      } catch (e) {}
    }

    const payments = await this.getPayments();
    let paidAppointmentId = null;
    const updated = payments.map(p => {
      if (p.id === paymentId) {
        paidAppointmentId = p.appointmentId;
        return { ...p, status: 'PAID', paidAt: new Date().toLocaleString('vi-VN') };
      }
      return p;
    });
    setStoredData(STORAGE_KEYS.PAYMENTS, updated);

    // Update appointment payment status too
    if (paidAppointmentId) {
      const appointments = await this.getAppointments();
      const updatedAppts = appointments.map(a =>
        a.id === paidAppointmentId ? { ...a, paymentStatus: 'PAID', status: 'CONFIRMED' } : a
      );
      setStoredData(STORAGE_KEYS.APPOINTMENTS, updatedAppts);
    }
    return { success: true };
  },

  // Notifications
  async getNotifications() {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request('/api/notifications');
      } catch (e) {}
    }
    return getStoredData(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }
};
