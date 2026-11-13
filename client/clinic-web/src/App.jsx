import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RoleBanner from './components/RoleBanner';
import DashboardView from './views/DashboardView';
import AppointmentsView from './views/AppointmentsView';
import DoctorsView from './views/DoctorsView';
import PatientsView from './views/PatientsView';
import PaymentsView from './views/PaymentsView';
import NotificationsView from './views/NotificationsView';
import SystemView from './views/SystemView';
import NewAppointmentModal from './components/NewAppointmentModal';
import PaymentModal from './components/PaymentModal';
import AuthModal from './components/AuthModal';
import { api } from './api/client';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mode, setModeState] = useState(api.getMode());
  const [currentUser, setCurrentUserState] = useState(api.getCurrentUser());
  
  // Data states
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Modals
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [paymentTargetAppointment, setPaymentTargetAppointment] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync mode changes
  const setMode = (newMode) => {
    api.setMode(newMode);
    setModeState(newMode);
    loadAllData();
    showToast(`Đã chuyển sang chế độ: ${newMode === 'gateway' ? 'Gateway Live (Port 8080)' : 'Demo Cục Bộ'}`);
  };

  const setCurrentUser = (updater) => {
    const updated = typeof updater === 'function' ? updater(currentUser) : updater;
    api.setCurrentUser(updated);
    setCurrentUserState(updated);
  };

  const handleRoleSwitch = (role) => {
    if (role === 'GUEST') {
      handleLogout();
      return;
    }
    const profiles = {
      PATIENT: {
        userId: 'p2010000-0000-0000-0000-000000000001',
        patientId: 'p2010000-0000-0000-0000-000000000001',
        name: 'Nguyễn Mạnh Quân',
        role: 'PATIENT',
        email: 'quan.patient@example.com',
        title: 'Bệnh nhân'
      },
      DOCTOR: {
        userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        doctorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        name: 'BS. CKI Nguyễn Văn An',
        role: 'DOCTOR',
        email: 'dr.nva@clinic.com',
        title: 'Bác sĩ - Nội Tổng Quát'
      },
      ADMIN: {
        userId: 'admin-01',
        name: 'Quản trị viên Hệ thống',
        role: 'ADMIN',
        email: 'admin@medisync.local',
        title: 'Quản trị viên'
      }
    };
    const selected = profiles[role] || profiles.PATIENT;
    setCurrentUser(selected);
    showToast(`Đã chuyển sang vai trò: ${role === 'PATIENT' ? 'Bệnh nhân' : role === 'DOCTOR' ? 'Bác sĩ' : 'Quản trị viên'}`);
  };

  // Load data
  const loadAllData = async () => {
    try {
      const [appts, docs, pats, pays, notifs] = await Promise.all([
        api.getAppointments(),
        api.getDoctors(),
        api.getPatients(),
        api.getPayments(),
        api.getNotifications()
      ]);
      setAppointments(appts || []);
      setDoctors(docs || []);
      setPatients(pats || []);
      setPayments(pays || []);
      setNotifications(notifs || []);
    } catch (e) {
      console.error('Error loading data:', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleCreateAppointment = async (formData) => {
    try {
      await api.createAppointment(formData);
      await loadAllData();
      showToast('Đặt lịch khám thành công! Sự kiện đã được gửi qua RabbitMQ.');
    } catch (err) {
      showToast('Lỗi khi tạo lịch hẹn: ' + err.message, 'error');
    }
  };

  const handleConfirmAppointment = async (id) => {
    try {
      await api.confirmAppointment(id);
      await loadAllData();
      showToast('Bác sĩ đã xác nhận duyệt lịch hẹn thành công!');
    } catch (err) {
      showToast('Lỗi khi xác nhận lịch: ' + err.message, 'error');
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      await api.completeAppointment(id);
      await loadAllData();
      showToast('Đã xác nhận hoàn tất ca khám bệnh!');
    } catch (err) {
      showToast('Lỗi khi hoàn tất ca khám: ' + err.message, 'error');
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await api.cancelAppointment(id);
      await loadAllData();
      showToast('Đã hủy lịch hẹn!');
    } catch (err) {
      showToast('Lỗi khi hủy lịch: ' + err.message, 'error');
    }
  };

  const handlePayPayment = async (paymentId) => {
    try {
      await api.payPayment(paymentId);
      await loadAllData();
      showToast('Thanh toán viện phí thành công! Trạng thái lịch hẹn đã đổi sang CONFIRMED.');
    } catch (err) {
      showToast('Lỗi khi thanh toán: ' + err.message, 'error');
    }
  };

  const handleBookWithDoctor = (doctor) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Vui lòng đăng nhập hoặc chọn vai trò Bệnh nhân để đặt lịch khám!', 'error');
      return;
    }
    setSelectedDoctorForBooking(doctor);
    setIsNewAppointmentOpen(true);
  };

  const handleLoginSuccess = async (email, password) => {
    const res = await api.login(email, password);
    if (res?.user) {
      setCurrentUserState(res.user);
      await loadAllData();
      showToast(`Đăng nhập thành công! Xin chào ${res.user.name}`);
    }
  };

  const handleRegisterSuccess = async (formData) => {
    const res = await api.register(formData);
    if (res?.user) {
      setCurrentUserState(res.user);
      await loadAllData();
      showToast(`Đăng ký tài khoản thành công! Xin chào ${res.user.name}`);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUserState(null);
    showToast('Bạn đã đăng xuất khỏi hệ thống.');
  };

  const pName = (!currentUser?.name || currentUser.name.includes('@') || currentUser.name === 'quan.patient' || currentUser.name === 'Đỗ Minh Quân')
    ? 'Nguyễn Mạnh Quân'
    : currentUser.name;

  // Pending counts for sidebar badge by role
  const myUpcomingAppointments = appointments.filter(a => 
    (a.patientName === pName || a.patientName === 'Nguyễn Mạnh Quân' || a.patientId === currentUser?.patientId) && 
    (a.status === 'PENDING' || a.status === 'CONFIRMED')
  ).length;

  const myPendingPayments = payments.filter(p => 
    (p.patientName === pName || p.patientName === 'Nguyễn Mạnh Quân' || p.patientId === currentUser?.patientId) && 
    p.status === 'PENDING'
  ).length;

  const doctorPendingAppointments = appointments.filter(a => 
    (a.doctorName?.includes('Nguyễn Văn An') || a.doctorId === currentUser?.doctorId) && 
    a.status === 'PENDING'
  ).length;

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING').length;
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#0d9488',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        currentUser={currentUser}
        stats={{ 
          myUpcomingAppointments,
          myPendingPayments,
          doctorPendingAppointments,
          pendingAppointments, 
          pendingPayments 
        }}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header 
          currentTab={currentTab}
          mode={mode}
          setMode={setMode}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onOpenLoginModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        <main className="content-area">
          {/* Prominent Role Indicator Banner */}
          <RoleBanner 
            currentUser={currentUser} 
            onSwitchRole={handleRoleSwitch} 
          />

          {currentTab === 'dashboard' && (
            <DashboardView 
              appointments={appointments}
              doctors={doctors}
              payments={payments}
              currentUser={currentUser}
              onNewAppointmentClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                  showToast('Vui lòng đăng nhập hoặc chọn vai trò Bệnh nhân để đặt lịch khám!', 'error');
                } else {
                  setSelectedDoctorForBooking(null);
                  setIsNewAppointmentOpen(true);
                }
              }}
              onNavigateTab={setCurrentTab}
              onOpenLoginModal={() => setIsAuthModalOpen(true)}
              onQuickLogin={handleRoleSwitch}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsView 
              appointments={appointments}
              currentUser={currentUser}
              onNewAppointmentClick={() => {
                setSelectedDoctorForBooking(null);
                setIsNewAppointmentOpen(true);
              }}
              onConfirmAppointment={handleConfirmAppointment}
              onCompleteAppointment={handleCompleteAppointment}
              onCancelAppointment={handleCancelAppointment}
              onOpenPaymentModal={(appt) => setPaymentTargetAppointment(appt)}
            />
          )}

          {currentTab === 'doctors' && (
            <DoctorsView 
              doctors={doctors}
              currentUser={currentUser}
              onBookWithDoctor={handleBookWithDoctor}
            />
          )}

          {currentTab === 'patients' && (
            <PatientsView 
              patients={patients}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentsView 
              payments={payments}
              currentUser={currentUser}
              onPayPayment={handlePayPayment}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationsView 
              notifications={notifications}
            />
          )}

          {currentTab === 'system' && (
            <SystemView />
          )}
        </main>
      </div>

      {/* Modals */}
      {isNewAppointmentOpen && (
        <NewAppointmentModal 
          doctors={doctors}
          currentUser={currentUser}
          initialDoctor={selectedDoctorForBooking}
          onClose={() => {
            setIsNewAppointmentOpen(false);
            setSelectedDoctorForBooking(null);
          }}
          onSubmit={handleCreateAppointment}
        />
      )}

      {paymentTargetAppointment && (
        <PaymentModal 
          appointment={paymentTargetAppointment}
          onClose={() => setPaymentTargetAppointment(null)}
          onConfirmPayment={async (apptId) => {
            const payItem = payments.find(p => p.appointmentId === apptId);
            if (payItem) {
              await handlePayPayment(payItem.id);
            }
          }}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}
