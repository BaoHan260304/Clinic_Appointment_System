package com.group05.patient.api.dto;

import java.util.List;

public record DoctorPatientConsultationResponse(
        PatientResponse patient,
        List<MedicalRecordResponse> medicalRecords
) {
}
