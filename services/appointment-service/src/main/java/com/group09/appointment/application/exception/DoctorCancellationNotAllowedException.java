package com.group09.appointment.application.exception;

import com.group09.appointment.domain.exception.DomainException;

public class DoctorCancellationNotAllowedException extends DomainException {

    public DoctorCancellationNotAllowedException(String message) {
        super(message);
    }
}
