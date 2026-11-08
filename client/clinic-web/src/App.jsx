import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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
      const created = await api.createAppointment(formData);
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
      showToast('Đã xác nhận lịch hẹn thành công!');
    } catch (err) {
      showToast('Lỗi khi xác nhận lịch: ' + err.message, 'error');
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
    setSelectedDoctorForBooking(doctor);
    setIsNewAppointmentOpen(true);
  };

  const handleLoginSuccess = async (email) => {
    await api.login(email, 'secret123');
    setCurrentUserState(api.getCurrentUser());
    showToast(`Đăng nhập thành công với tài khoản: ${email}`);
  };

  // Pending counts for sidebar badge
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
        stats={{ pendingAppointments, pendingPayments }}
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
        />

        <main className="content-area">
          {currentTab === 'dashboard' && (
            <DashboardView 
              appointments={appointments}
              doctors={doctors}
              payments={payments}
              onNewAppointmentClick={() => {
                setSelectedDoctorForBooking(null);
                setIsNewAppointmentOpen(true);
              }}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsView 
              appointments={appointments}
              onNewAppointmentClick={() => {
                setSelectedDoctorForBooking(null);
                setIsNewAppointmentOpen(true);
              }}
              onConfirmAppointment={handleConfirmAppointment}
              onCancelAppointment={handleCancelAppointment}
              onOpenPaymentModal={(appt) => setPaymentTargetAppointment(appt)}
            />
          )}

          {currentTab === 'doctors' && (
            <DoctorsView 
              doctors={doctors}
              onBookWithDoctor={handleBookWithDoctor}
            />
          )}

          {currentTab === 'patients' && (
            <PatientsView 
              patients={patients}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentsView 
              payments={payments}
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
        />
      )}
    </div>
  );
}
