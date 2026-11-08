package com.group09.appointment.application.exception;

import com.group09.appointment.domain.exception.DomainException;

public class AppointmentTimeValidationException extends DomainException {

    public AppointmentTimeValidationException(String message) {
        super(message);
    }
}
