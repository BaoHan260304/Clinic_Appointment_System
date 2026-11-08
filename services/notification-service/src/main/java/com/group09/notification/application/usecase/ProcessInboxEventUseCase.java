package com.group09.notification.application.usecase;

import com.group09.notification.api.dto.NotificationEventPayload;

public interface ProcessInboxEventUseCase {
    void handle(NotificationEventPayload payload);
}