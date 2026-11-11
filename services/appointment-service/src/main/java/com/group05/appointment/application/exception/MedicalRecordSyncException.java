package com.group05.appointment.application.exception;

import com.group05.appointment.domain.exception.DomainException;

public class MedicalRecordSyncException extends DomainException {

    public MedicalRecordSyncException(String message) {
        super(message);
    }

    public MedicalRecordSyncException(String message, Throwable cause) {
        super(message, cause);
    }
}
