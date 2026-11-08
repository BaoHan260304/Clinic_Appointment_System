export const initialDoctors = [
  {
    id: "d1010000-0000-0000-0000-000000000001",
    fullName: "BS. CKI Nguyễn Văn An",
    specialty: "Nội Tổng Quát",
    phone: "0912 345 678",
    email: "bs.an@clinic.local",
    rating: 4.9,
    experienceYears: 12,
    room: "Phòng 201 - Tầng 2",
    availableDays: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
    price: 300000
  },
  {
    id: "d1010000-0000-0000-0000-000000000002",
    fullName: "ThS. BS Trần Thị Bích",
    specialty: "Tim Mạch",
    phone: "0988 765 432",
    email: "bs.bich@clinic.local",
    rating: 4.8,
    experienceYears: 15,
    room: "Phòng 305 - Tầng 3",
    availableDays: ["Thứ 2", "Thứ 4", "Thứ 6", "Thứ 7"],
    price: 450000
  },
  {
    id: "d1010000-0000-0000-0000-000000000003",
    fullName: "BS. CKII Lê Hoàng Minh",
    specialty: "Nhi Khoa",
    phone: "0903 112 233",
    email: "bs.minh@clinic.local",
    rating: 5.0,
    experienceYears: 18,
    room: "Phòng 102 - Tầng 1",
    availableDays: ["Thứ 3", "Thứ 5", "Thứ 7", "Chủ Nhật"],
    price: 350000
  },
  {
    id: "d1010000-0000-0000-0000-000000000004",
    fullName: "BS. Phạm Thu Hương",
    specialty: "Da Liễu",
    phone: "0934 998 877",
    email: "bs.huong@clinic.local",
    rating: 4.7,
    experienceYears: 8,
    room: "Phòng 402 - Tầng 4",
    availableDays: ["Thứ 2", "Thứ 3", "Thứ 5", "Thứ 6"],
    price: 350000
  }
];

export const initialPatients = [
  {
    id: "p2010000-0000-0000-0000-000000000001",
    fullName: "Đỗ Minh Quân",
    dob: "2002-05-15",
    gender: "Nam",
    phone: "0971 234 567",
    email: "quan.patient@example.com",
    address: "Hà Nội",
    bloodGroup: "O+",
    allergies: "Dị ứng Penicillin"
  },
  {
    id: "p2010000-0000-0000-0000-000000000002",
    fullName: "Hoàng Mai Linh",
    dob: "1998-11-20",
    gender: "Nữ",
    phone: "0965 889 900",
    email: "linh.hoang@example.com",
    address: "Cầu Giấy, Hà Nội",
    bloodGroup: "A+",
    allergies: "Không có"
  },
  {
    id: "p2010000-0000-0000-0000-000000000003",
    fullName: "Vũ Tuấn Kiệt",
    dob: "2000-03-08",
    gender: "Nam",
    phone: "0918 554 433",
    email: "kiet.vu@example.com",
    address: "Nam Từ Liêm, Hà Nội",
    bloodGroup: "B+",
    allergies: "Hải sản"
  }
];

export const initialAppointments = [
  {
    id: "a3010000-0000-0000-0000-000000000001",
    patientId: "p2010000-0000-0000-0000-000000000001",
    patientName: "Đỗ Minh Quân",
    doctorId: "d1010000-0000-0000-0000-000000000001",
    doctorName: "BS. CKI Nguyễn Văn An",
    specialty: "Nội Tổng Quát",
    appointmentDate: "2026-11-10",
    appointmentTime: "09:00 - 09:30",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    reason: "Kiểm tra sức khỏe định kỳ và tư vấn huyết áp",
    createdAt: "2026-11-08 14:30"
  },
  {
    id: "a3010000-0000-0000-0000-000000000002",
    patientId: "p2010000-0000-0000-0000-000000000002",
    patientName: "Hoàng Mai Linh",
    doctorId: "d1010000-0000-0000-0000-000000000002",
    doctorName: "ThS. BS Trần Thị Bích",
    specialty: "Tim Mạch",
    appointmentDate: "2026-11-12",
    appointmentTime: "10:30 - 11:00",
    status: "PENDING",
    paymentStatus: "AWAITING_PAYMENT",
    reason: "Đau tức ngực nhẹ khi vận động mạnh",
    createdAt: "2026-11-08 16:15"
  },
  {
    id: "a3010000-0000-0000-0000-000000000003",
    patientId: "p2010000-0000-0000-0000-000000000003",
    doctorId: "d1010000-0000-0000-0000-000000000004",
    doctorName: "BS. Phạm Thu Hương",
    specialty: "Da Liễu",
    appointmentDate: "2026-11-09",
    appointmentTime: "14:00 - 14:30",
    status: "COMPLETED",
    paymentStatus: "PAID",
    reason: "Tái khám viêm da tiếp xúc",
    createdAt: "2026-11-05 10:00"
  }
];

export const initialPayments = [
  {
    id: "pay-101",
    appointmentId: "a3010000-0000-0000-0000-000000000001",
    patientName: "Đỗ Minh Quân",
    amount: 300000,
    currency: "VND",
    method: "VNPAY_QR",
    status: "PAID",
    paidAt: "2026-11-08 14:35",
    transactionCode: "TXN_VN_20261108_9981"
  },
  {
    id: "pay-102",
    appointmentId: "a3010000-0000-0000-0000-000000000002",
    patientName: "Hoàng Mai Linh",
    amount: 450000,
    currency: "VND",
    method: "ONLINE_BANKING",
    status: "PENDING",
    paidAt: null,
    transactionCode: "TXN_PENDING_4431"
  },
  {
    id: "pay-103",
    appointmentId: "a3010000-0000-0000-0000-000000000003",
    patientName: "Vũ Tuấn Kiệt",
    amount: 350000,
    currency: "VND",
    method: "CASH",
    status: "PAID",
    paidAt: "2026-11-05 10:05",
    transactionCode: "CASH_COUNTER_01"
  }
];

export const initialNotifications = [
  {
    id: "notif-001",
    title: "Xác nhận lịch hẹn thành công",
    body: "Lịch hẹn khám với BS. CKI Nguyễn Văn An vào 09:00 ngày 10/11/2026 đã được xác nhận.",
    channel: "EMAIL",
    destination: "quan.patient@example.com",
    status: "SENT",
    type: "APPOINTMENT_CONFIRMED",
    time: "2026-11-08 14:35"
  },
  {
    id: "notif-002",
    title: "Nhắc nhở thanh toán viện phí",
    body: "Bạn có 1 lịch hẹn đang chờ thanh toán 450.000 VNĐ trước 23:59 hôm nay.",
    channel: "SMS",
    destination: "0965 889 900",
    status: "SENT",
    type: "PAYMENT_REMINDER",
    time: "2026-11-08 16:16"
  },
  {
    id: "notif-003",
    title: "Cập nhật hồ sơ bệnh án",
    body: "Bác sĩ Phạm Thu Hương đã cập nhật kết quả tái khám và đơn thuốc.",
    channel: "EMAIL",
    destination: "kiet.vu@example.com",
    status: "SENT",
    type: "MEDICAL_RECORD_UPDATED",
    time: "2026-11-05 11:20"
  }
];
