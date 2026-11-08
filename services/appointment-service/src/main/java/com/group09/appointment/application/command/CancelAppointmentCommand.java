package com.group09.appointment.application.command;

import java.util.UUID;

public record CancelAppointmentCommand(
        UUID appointmentId,
        UUID cancelledBy,
        String cancelledByRole,
        String cancelReason
) {
}