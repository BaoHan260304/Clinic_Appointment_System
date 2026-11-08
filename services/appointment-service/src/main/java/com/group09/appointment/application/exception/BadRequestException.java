package com.group09.appointment.application.exception;

import com.group09.appointment.domain.exception.DomainException;

public class BadRequestException extends DomainException {

    public BadRequestException(String message) {
        super(message);
    }
}
