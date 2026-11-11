package com.group09.doctor.domain.exception;

public class DoctorLeaveConflictException extends DomainException {
    public DoctorLeaveConflictException(String message) {
        super(message);
    }
}
