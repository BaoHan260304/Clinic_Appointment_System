package com.group05.notification.application.usecase;

import com.group05.notification.domain.aggregate.NotificationAggregate;
import java.util.List;
import java.util.UUID;

public interface ListNotificationsUseCase {
    List<NotificationAggregate> handleByRecipientId(UUID recipientId);
    List<NotificationAggregate> handleUnreadByRecipientId(UUID recipientId);
}