package com.group05.appointment.application.exception;

import com.group05.appointment.domain.exception.DomainException;

public class DoctorCancellationNotAllowedException extends DomainException {

    public DoctorCancellationNotAllowedException(String message) {
        super(message);
    }
}
