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
  PATIENTS: 'clinic_patients_data',
  NOTIFICATIONS: 'clinic_notifications_data'
};

export function isDemoPatient(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase();
  const name = (user.name || user.fullName || '').trim();
  const id = user.userId || user.patientId || user.id || '';
  return email === 'quan.patient@example.com' ||
         name === 'Nguyễn Mạnh Quân' ||
         name === 'Đỗ Minh Quân' ||
         name === 'quan.patient' ||
         id === 'p2010000-0000-0000-0000-000000000001';
}

export function matchesPatient(record, currentUser) {
  if (!record || !currentUser) return false;
  if (isDemoPatient(currentUser)) {
    return record.patientName === 'Nguyễn Mạnh Quân' ||
           record.fullName === 'Nguyễn Mạnh Quân' ||
           record.patientId === 'p2010000-0000-0000-0000-000000000001' ||
           record.id === 'p2010000-0000-0000-0000-000000000001';
  }
  const curName = (currentUser.name || currentUser.fullName || '').trim().toLowerCase();
  const recName = (record.patientName || record.fullName || '').trim().toLowerCase();
  const curId = currentUser.patientId || currentUser.userId || currentUser.id;
  const recId = record.patientId || record.id;

  if (curId && recId && curId === recId) return true;
  if (curName && recName && curName === recName) return true;
  return false;
}

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

export function normalizeDoctor(d) {
  if (!d) return null;
  const name = d.fullName || d.name || 'BS. CKI Nguyễn Văn An';
  const specialty = d.specialty || d.specialization || 'Nội Tổng Quát';
  const price = typeof d.price === 'number' ? d.price : (
    specialty.toLowerCase().includes('tim') ? 450000 :
    specialty.toLowerCase().includes('nhi') ? 350000 :
    specialty.toLowerCase().includes('da') ? 350000 : 300000
  );
  const phone = d.phone || d.phoneNumber || '0912 345 678';
  const email = d.email || 'bs.an@clinic.local';
  const rating = typeof d.rating === 'number' ? d.rating : 4.9;
  const experienceYears = typeof d.experienceYears === 'number' ? d.experienceYears : 10;
  const room = d.room || (
    specialty.toLowerCase().includes('tim') ? 'Phòng 305 - Tầng 3' :
    specialty.toLowerCase().includes('nhi') ? 'Phòng 102 - Tầng 1' :
    specialty.toLowerCase().includes('da') ? 'Phòng 402 - Tầng 4' : 'Phòng 201 - Tầng 2'
  );
  const availableDays = Array.isArray(d.availableDays) && d.availableDays.length > 0
    ? d.availableDays
    : ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];

  return {
    ...d,
    id: d.id,
    userId: d.userId || d.id,
    name,
    fullName: name,
    specialty,
    specialization: specialty,
    price,
    phone,
    phoneNumber: phone,
    email,
    rating,
    experienceYears,
    room,
    availableDays,
    slots: d.slots || []
  };
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
    const user = getStoredData(STORAGE_KEYS.USER, null);
    if (user && user.name === 'Đỗ Minh Quân') {
      user.name = 'Nguyễn Mạnh Quân';
      this.setCurrentUser(user);
    }
    return user;
  },

  setCurrentUser(user) {
    if (user) {
      setStoredData(STORAGE_KEYS.USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
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
      userId = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      doctorId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
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
    const targetEmail = (formData.email || '').trim().toLowerCase();
    if (!targetEmail) {
      throw new Error('Email không được để trống.');
    }

    // Kiểm tra trùng email với các tài khoản hệ thống mặc định
    const defaultEmails = [
      'quan.patient@example.com',
      'bs.an@clinic.local',
      'admin@medisync.local',
      'bs.bich@clinic.local',
      'bs.minh@clinic.local',
      'bs.huong@clinic.local'
    ];

    const registered = getStoredData('clinic_registered_users', []);
    
    // Kiểm tra trùng email
    const isEmailExisted = defaultEmails.includes(targetEmail) || 
      registered.some(u => (u.email || '').trim().toLowerCase() === targetEmail);

    if (isEmailExisted) {
      throw new Error(`Email "${formData.email}" đã tồn tại trên hệ thống. Vui lòng sử dụng email khác hoặc Đăng nhập!`);
    }

    // Kiểm tra trùng số điện thoại
    const targetPhone = (formData.phone || formData.phoneNumber || '').trim();
    if (targetPhone && registered.some(u => (u.phone || '').trim() === targetPhone)) {
      throw new Error(`Số điện thoại "${targetPhone}" đã được đăng ký cho tài khoản khác.`);
    }

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

  async forgotPassword(email) {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
      } catch (err) {
        console.warn('Gateway forgot-password error, fallback to mock:', err.message);
      }
    }
    return {
      success: true,
      otp: '888666',
      message: `Mã OTP đã được gửi về email ${email} qua hàng đợi RabbitMQ (Notification Service)!`
    };
  },

  async resetPassword(email, otp, newPassword) {
    if (this.getMode() === 'gateway') {
      try {
        return await this.request('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ email, otp, newPassword })
        });
      } catch (err) {
        console.warn('Gateway reset-password error, fallback to mock:', err.message);
      }
    }
    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay với mật khẩu mới.'
    };
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
      if (a.patientName === 'quan.patient' || a.patientName === 'Đỗ Minh Quân') {
        return { ...a, patientName: 'Nguyễn Mạnh Quân' };
      }
      return a;
    });
    setStoredData(STORAGE_KEYS.APPOINTMENTS, cleaned);
    return cleaned;
  },

  async createAppointment(data) {
    const doctors = await this.getDoctors();
    const targetDoctor = doctors.find(d => d.id === data.doctorId) || doctors[0];
    const doctorName = data.doctorName || targetDoctor?.fullName || targetDoctor?.name || 'BS. CKI Nguyễn Văn An';
    const doctorId = data.doctorId || targetDoctor?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const specialty = data.specialty || data.specialization || targetDoctor?.specialty || targetDoctor?.specialization || 'Nội Tổng Quát';
    const price = typeof data.price === 'number' ? data.price : (targetDoctor?.price || 300000);

    const currentUser = this.getCurrentUser();
    let cleanPatientName = data.patientName;
    if (!cleanPatientName) {
      cleanPatientName = isDemoPatient(currentUser) ? 'Nguyễn Mạnh Quân' : (currentUser?.name || 'Bệnh nhân');
    }

    const patientId = data.patientId || currentUser?.patientId || currentUser?.userId || (isDemoPatient(currentUser) ? 'p2010000-0000-0000-0000-000000000001' : `p-${Date.now()}`);

    const dateStr = data.appointmentDate || '2026-11-15';
    let startHourMin = '09:00';
    let endHourMin = '09:30';
    if (data.appointmentTime && data.appointmentTime.includes('-')) {
      const parts = data.appointmentTime.split('-').map(s => s.trim().split(' ')[0]);
      if (parts[0]) startHourMin = parts[0];
      if (parts[1]) endHourMin = parts[1];
    }
    const timeSlotStr = `${startHourMin} - ${endHourMin}`;
    const startTimeIso = `${dateStr}T${startHourMin}:00`;
    const endTimeIso = `${dateStr}T${endHourMin}:00`;

    // Anti-duplicate validation (Chống đặt trùng ca khám - Áp dụng cả Gateway & Mock)
    const currentAppointments = await this.getAppointments();
    const activeAppointments = currentAppointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');

    // 1. Kiểm tra bệnh nhân đã có lịch trong khung giờ này chưa
    const existingPatientAppt = activeAppointments.find(a =>
      a.appointmentDate === dateStr &&
      a.appointmentTime === timeSlotStr &&
      ((a.patientId && patientId && a.patientId === patientId) ||
       (a.patientName && cleanPatientName && a.patientName.trim().toLowerCase() === cleanPatientName.trim().toLowerCase()))
    );
    if (existingPatientAppt) {
      throw new Error(`Bạn đã có một lịch khám vào khung giờ ${timeSlotStr} ngày ${dateStr}. Không thể đặt trùng ca khám.`);
    }

    // 2. Kiểm tra bác sĩ đã được bệnh nhân khác đặt khung giờ này chưa
    const existingDoctorAppt = activeAppointments.find(a =>
      a.appointmentDate === dateStr &&
      a.appointmentTime === timeSlotStr &&
      ((a.doctorId && doctorId && a.doctorId === doctorId) ||
       (a.doctorName && doctorName && a.doctorName.trim().toLowerCase() === doctorName.trim().toLowerCase()))
    );
    if (existingDoctorAppt) {
      throw new Error(`Bác sĩ ${doctorName} đã có ca khám vào khung giờ ${timeSlotStr} ngày ${dateStr}. Vui lòng chọn khung giờ khác.`);
    }

    if (this.getMode() === 'gateway') {
      try {
        const payload = {
          specialization: specialty,
          startTime: startTimeIso,
          endTime: endTimeIso,
          rescheduledFromAppointmentId: null,
          reason: data.reason || 'Khám sức khỏe tổng quát',
          bookingSource: 'WEB_PORTAL'
        };
        const res = await this.request('/api/appointments', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (res && res.id) {
          const newAppt = {
            id: res.id,
            patientId: res.patientId || patientId,
            patientName: cleanPatientName,
            doctorId: res.doctorId || doctorId,
            doctorName: res.doctorName || doctorName,
            specialty: res.specialization || specialty,
            appointmentDate: dateStr,
            appointmentTime: timeSlotStr,
            status: res.status || 'PENDING',
            paymentStatus: 'AWAITING_PAYMENT',
            reason: res.reason || data.reason || 'Khám tổng quát',
            createdAt: new Date().toLocaleString('vi-VN')
          };
          const list = getStoredData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
          setStoredData(STORAGE_KEYS.APPOINTMENTS, [newAppt, ...list]);
          return newAppt;
        }
      } catch (e) {
        if (e.message && (e.message.includes('trùng') || e.message.includes('lịch') || e.message.includes('khung giờ'))) {
          throw e;
        }
        console.warn('Gateway booking failed or offline, fallback to mock booking:', e.message);
      }
    }

    // Mock Booking Fallback
    const newAppointment = {
      id: `a301-mock-${Date.now()}`,
      patientId: patientId,
      patientName: cleanPatientName,
      doctorId: doctorId,
      doctorName: doctorName,
      specialty: specialty,
      appointmentDate: dateStr,
      appointmentTime: timeSlotStr,
      status: 'PENDING',
      paymentStatus: 'AWAITING_PAYMENT',
      reason: data.reason || 'Khám tổng quát',
      createdAt: new Date().toLocaleString('vi-VN')
    };

    const updated = [newAppointment, ...currentAppointments];
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);

    // Cũng tạo 1 bản ghi payment pending với đúng patientId và patientName
    const payments = await this.getPayments();
    const newPayment = {
      id: `pay-${Date.now()}`,
      appointmentId: newAppointment.id,
      patientId: patientId,
      patientName: newAppointment.patientName,
      amount: price,
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
        const res = await this.request('/api/doctors');
        if (Array.isArray(res) && res.length > 0) {
          const normalized = res.map(d => normalizeDoctor(d));
          setStoredData(STORAGE_KEYS.DOCTORS, normalized);
          return normalized;
        }
      } catch (e) {
        console.warn('Gateway /api/doctors error, fallback to stored:', e.message);
      }
    }
    const raw = getStoredData(STORAGE_KEYS.DOCTORS, initialDoctors);
    return Array.isArray(raw) ? raw.map(d => normalizeDoctor(d)) : initialDoctors.map(d => normalizeDoctor(d));
  },

  // Patients
  async getPatients() {
    if (this.getMode() === 'gateway') {
      try {
        const res = await this.request('/api/patients');
        if (Array.isArray(res) && res.length > 0) return res;
      } catch (e) {}
    }
    const stored = getStoredData(STORAGE_KEYS.PATIENTS, null);
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
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
      if (p.patientName === 'quan.patient' || p.patientName === 'Đỗ Minh Quân') {
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
