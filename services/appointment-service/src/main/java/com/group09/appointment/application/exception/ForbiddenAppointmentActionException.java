package com.group09.appointment.application.exception;

import com.group09.appointment.domain.exception.DomainException;

public class ForbiddenAppointmentActionException extends DomainException {

    public ForbiddenAppointmentActionException(String message) {
        super(message);
    }
}
