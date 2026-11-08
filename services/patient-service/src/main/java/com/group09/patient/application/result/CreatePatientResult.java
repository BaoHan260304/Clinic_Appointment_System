package com.group09.patient.application.result;

public record CreatePatientResult(
        PatientResult patient,
        boolean created
) {
}
