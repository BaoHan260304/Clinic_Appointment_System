package com.group05.appointment.application.exception;

import com.group05.appointment.domain.exception.DomainException;

public class ForbiddenAppointmentActionException extends DomainException {

    public ForbiddenAppointmentActionException(String message) {
        super(message);
    }
}
