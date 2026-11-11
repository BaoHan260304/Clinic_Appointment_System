package com.group05.appointment.application.exception;

import com.group05.appointment.domain.exception.DomainException;

public class BadRequestException extends DomainException {

    public BadRequestException(String message) {
        super(message);
    }
}
