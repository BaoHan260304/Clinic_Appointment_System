package com.group05.patient.application.result;

public record CreatePatientResult(
        PatientResult patient,
        boolean created
) {
}
