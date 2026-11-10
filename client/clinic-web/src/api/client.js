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
    const user = getStoredData(STORAGE_KEYS.USER, {
      userId: 'p2010000-0000-0000-0000-000000000001',
      patientId: 'p2010000-0000-0000-0000-000000000001',
      name: 'Nguyễn Mạnh Quân',
      email: 'quan.patient@example.com',
      role: 'PATIENT'
    });
    if (user && user.name === 'Đỗ Minh Quân') {
      user.name = 'Nguyễn Mạnh Quân';
      this.setCurrentUser(user);
    }
    return user;
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
          body: JSON.stringify({ email, username: email, usernameOrEmail: email, password })
        });
        if (res?.accessToken) {
          this.setToken(res.accessToken);
          try {
            const me = await this.request('/auth/me');
            const userObj = {
              userId: me.userId,
              patientId: me.patientId,
              name: me.fullName || email.split('@')[0],
              email: me.email,
              role: me.roles?.[0] || 'PATIENT'
            };
            this.setCurrentUser(userObj);
            return { success: true, user: userObj };
          } catch (e) {}
          return res;
        }
      } catch (err) {
        console.warn('Gateway error, fallback to mock login:', err.message);
      }
    }

    // Mock Login
    let role = 'PATIENT';
    let name = 'Nguyễn Mạnh Quân';
    let userId = 'p2010000-0000-0000-0000-000000000001';
    let patientId = 'p2010000-0000-0000-0000-000000000001';
    let doctorId = null;

    if (email.includes('doctor') || email.includes('bs.')) {
      role = 'DOCTOR';
      name = 'BS. CKI Nguyễn Văn An';
      userId = 'd1010000-0000-0000-0000-000000000001';
      doctorId = 'd1010000-0000-0000-0000-000000000001';
      patientId = null;
    } else if (email.includes('admin')) {
      role = 'ADMIN';
      name = 'Quản trị viên Hệ thống';
      userId = 'admin-01';
      patientId = null;
    } else if (email.includes('quan') || email.includes('patient') || email === 'quan.patient@example.com') {
      role = 'PATIENT';
      name = 'Nguyễn Mạnh Quân';
      userId = 'p2010000-0000-0000-0000-000000000001';
      patientId = 'p2010000-0000-0000-0000-000000000001';
      doctorId = null;
    } else {
      const customUsers = getStoredData('clinic_registered_users', []);
      const matched = customUsers.find(u => u.email === email);
      if (matched) {
        role = matched.role;
        name = matched.fullName || matched.name;
        userId = matched.id || matched.userId;
        patientId = matched.patientId;
        doctorId = matched.doctorId;
      } else {
        name = email.split('@')[0];
      }
    }

    const mockUser = {
      userId,
      patientId,
      doctorId,
      name,
      email,
      role
    };
    this.setCurrentUser(mockUser);
    this.setToken('mock_jwt_token_' + Date.now());
    return { success: true, user: mockUser };
  },

  async register(formData) {
    if (this.getMode() === 'gateway') {
      try {
        const res = await this.request('/api/users/register', {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phoneNumber: formData.phone || formData.phoneNumber,
            role: formData.role || 'PATIENT',
            specialization: formData.specialty,
            dateOfBirth: formData.dob,
            gender: formData.gender,
            contactInformation: formData.address
          })
        });
        if (res) {
          return await this.login(formData.email, formData.password);
        }
      } catch (err) {
        console.warn('Gateway register error, fallback to mock register:', err.message);
      }
    }

    // Mock Register
    const newId = `u-${Date.now()}`;
    const isDoc = formData.role === 'DOCTOR';
    const newUser = {
      id: newId,
      userId: newId,
      patientId: !isDoc ? `p-${Date.now()}` : null,
      doctorId: isDoc ? `d-${Date.now()}` : null,
      fullName: formData.fullName,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone || '0901234567',
      role: formData.role || 'PATIENT',
      specialty: formData.specialty || 'Đa Khoa',
      dob: formData.dob || '2000-01-01',
      gender: formData.gender || 'Nam',
      bloodGroup: formData.bloodGroup || 'O+',
      allergies: formData.allergies || 'Không có',
      address: formData.address || 'Hà Nội'
    };

    const registered = getStoredData('clinic_registered_users', []);
    setStoredData('clinic_registered_users', [...registered, newUser]);

    if (!isDoc) {
      const pats = await this.getPatients();
      setStoredData(STORAGE_KEYS.PATIENTS, [
        {
          id: newUser.patientId,
          fullName: newUser.fullName,
          dob: newUser.dob,
          gender: newUser.gender,
          phone: newUser.phone,
          email: newUser.email,
          address: newUser.address,
          bloodGroup: newUser.bloodGroup,
          allergies: newUser.allergies
        },
        ...pats
      ]);
    } else {
      const docs = await this.getDoctors();
      setStoredData(STORAGE_KEYS.DOCTORS, [
        {
          id: newUser.doctorId,
          fullName: newUser.fullName,
          specialty: newUser.specialty,
          phone: newUser.phone,
          email: newUser.email,
          rating: 5.0,
          experienceYears: 1,
          room: 'Phòng Khám Mới - Tầng 2',
          availableDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
          price: 300000
        },
        ...docs
      ]);
    }

    this.setCurrentUser(newUser);
    this.setToken('mock_jwt_token_' + Date.now());
    return { success: true, user: newUser };
  },

  logout() {
    this.setToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { success: true };
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
    const list = getStoredData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    const cleaned = list.map(a => {
      if (a.patientName === 'quan.patient' || a.patientName === 'Đỗ Minh Quân' || a.patientName?.includes('@')) {
        return { ...a, patientName: 'Nguyễn Mạnh Quân' };
      }
      return a;
    });
    setStoredData(STORAGE_KEYS.APPOINTMENTS, cleaned);
    return cleaned;
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

    let cleanPatientName = data.patientName;
    if (!cleanPatientName || cleanPatientName.includes('@') || cleanPatientName === 'quan.patient' || cleanPatientName === 'Đỗ Minh Quân') {
      cleanPatientName = 'Nguyễn Mạnh Quân';
    }

    const list = await this.getAppointments();
    const newAppointment = {
      id: `a301-mock-${Date.now()}`,
      patientId: data.patientId || 'p2010000-0000-0000-0000-000000000001',
      patientName: cleanPatientName,
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

  async completeAppointment(appointmentId) {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request(`/api/appointments/${appointmentId}/complete`, {
          method: 'POST'
        });
      } catch (e) {
        console.warn('Gateway offline, updating local mock:', e.message);
      }
    }

    const list = await this.getAppointments();
    const updated = list.map(item =>
      item.id === appointmentId ? { ...item, status: 'COMPLETED' } : item
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
    const list = getStoredData(STORAGE_KEYS.PAYMENTS, initialPayments);
    const cleaned = list.map(p => {
      if (p.patientName === 'quan.patient' || p.patientName === 'Đỗ Minh Quân' || p.patientName?.includes('@')) {
        return { ...p, patientName: 'Nguyễn Mạnh Quân' };
      }
      return p;
    });
    setStoredData(STORAGE_KEYS.PAYMENTS, cleaned);
    return cleaned;
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
