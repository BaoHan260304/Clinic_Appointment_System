package com.group09.appointment.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DoctorAppointmentScheduleItemResponse(
        UUID appointmentId,
        UUID patientId,
        UUID doctorId,
        UUID slotId,
        String appointmentStatus,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String reason
) {
}
