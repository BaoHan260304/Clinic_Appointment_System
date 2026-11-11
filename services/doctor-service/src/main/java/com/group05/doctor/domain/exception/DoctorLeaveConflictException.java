package com.group05.doctor.domain.exception;

public class DoctorLeaveConflictException extends DomainException {
    public DoctorLeaveConflictException(String message) {
        super(message);
    }
}
