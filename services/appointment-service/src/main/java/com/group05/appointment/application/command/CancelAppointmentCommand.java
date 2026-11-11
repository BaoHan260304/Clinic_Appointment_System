package com.group05.appointment.application.command;

import java.util.UUID;

public record CancelAppointmentCommand(
        UUID appointmentId,
        UUID cancelledBy,
        String cancelledByRole,
        String cancelReason
) {
}