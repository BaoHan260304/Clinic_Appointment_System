package com.group05.appointment.application.exception;

public abstract class ExternalServiceException extends RuntimeException {

    protected ExternalServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
