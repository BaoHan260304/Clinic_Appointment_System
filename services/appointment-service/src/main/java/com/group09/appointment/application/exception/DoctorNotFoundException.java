package com.group09.appointment.application.exception;

import java.util.UUID;

public class DoctorNotFoundException extends ResourceNotFoundException {

    public DoctorNotFoundException(UUID doctorId) {
        super("Không tìm thấy bác sĩ: " + doctorId);
    }
}
