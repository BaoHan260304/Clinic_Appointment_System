package com.group05.doctor.domain.exception;

public class BadRequestException extends DomainException {

    public BadRequestException(String message) {
        super(message);
    }
}
