package com.group05.notification.application.usecase;

import com.group05.notification.domain.aggregate.NotificationAggregate;
import com.group05.notification.domain.vo.NotificationId;

public interface UpdateNotificationUseCase {
    NotificationAggregate handle(NotificationId notificationId, String title, String body);

    NotificationAggregate markAsRead(NotificationId notificationId);
}