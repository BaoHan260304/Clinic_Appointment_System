package com.group09.doctor.domain.model;

import java.time.LocalDateTime;

public record AvailableSlot(
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long availableCount
) {
}
