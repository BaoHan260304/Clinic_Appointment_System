package com.group09.payment.application.exception;

public class AppointmentServiceUnavailableException extends RuntimeException {

    public AppointmentServiceUnavailableException(Throwable cause) {
        super("Dịch vụ lịch hẹn tạm thời không khả dụng", cause);
    }
}
