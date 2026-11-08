package com.group09.notification.application.usecase;

import com.group09.notification.domain.aggregate.NotificationAggregate;
import com.group09.notification.domain.vo.NotificationId;

public interface UpdateNotificationUseCase {
    NotificationAggregate handle(NotificationId notificationId, String title, String body);

    NotificationAggregate markAsRead(NotificationId notificationId);
}