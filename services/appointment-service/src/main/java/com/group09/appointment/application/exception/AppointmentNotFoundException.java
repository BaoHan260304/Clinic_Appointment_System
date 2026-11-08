package com.group09.appointment.application.exception;

import java.util.UUID;

public class AppointmentNotFoundException extends ResourceNotFoundException {

    public AppointmentNotFoundException(UUID appointmentId) {
        super("Không tìm thấy lịch hẹn: " + appointmentId);
    }
}
