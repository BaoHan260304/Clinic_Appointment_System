package com.group05.doctor.application.dto;

import java.util.UUID;

public record DoctorIdentityResponse(
        UUID doctorId,
        UUID userId,
        String name
) {
}
