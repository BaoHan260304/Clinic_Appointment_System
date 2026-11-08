package com.group09.appointment.application.exception;

public class DoctorServiceUnavailableException extends ExternalServiceException {

    public DoctorServiceUnavailableException(Throwable cause) {
        super("Dịch vụ bác sĩ hiện không khả dụng", cause);
    }
}
