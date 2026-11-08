package com.group09.appointment.application.result;

import java.time.LocalDateTime;

public record RescheduleOptionResult(
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long availableCount
) {
}
