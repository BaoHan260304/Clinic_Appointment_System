package com.group05.notification.application.usecase;

import com.group05.notification.api.dto.NotificationEventPayload;

public interface ProcessInboxEventUseCase {
    void handle(NotificationEventPayload payload);
}