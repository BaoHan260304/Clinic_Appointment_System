package com.group09.doctor.application.dto;

import java.time.LocalDateTime;

public record AvailableSlotDto(
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long availableCount
) {
}
