package com.group05.notification.application.usecase;

import com.group05.notification.domain.vo.NotificationId;

public interface DeleteNotificationUseCase {
    void handle(NotificationId notificationId);
}