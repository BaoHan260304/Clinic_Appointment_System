package com.group09.notification.application.usecase;

import com.group09.notification.domain.vo.NotificationId;

public interface DeleteNotificationUseCase {
    void handle(NotificationId notificationId);
}