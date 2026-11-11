package com.group05.appointment.api.dto;

import com.group05.appointment.application.result.RescheduleOptionResult;

import java.time.LocalDateTime;

public record RescheduleOptionResponse(
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long availableCount
) {
    public static RescheduleOptionResponse from(RescheduleOptionResult result) {
        return new RescheduleOptionResponse(
                result.startTime(),
                result.endTime(),
                result.availableCount()
        );
    }
}
