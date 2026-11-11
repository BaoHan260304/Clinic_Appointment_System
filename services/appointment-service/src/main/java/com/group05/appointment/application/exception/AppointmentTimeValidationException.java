package com.group05.appointment.application.exception;

import com.group05.appointment.domain.exception.DomainException;

public class AppointmentTimeValidationException extends DomainException {

    public AppointmentTimeValidationException(String message) {
        super(message);
    }
}
