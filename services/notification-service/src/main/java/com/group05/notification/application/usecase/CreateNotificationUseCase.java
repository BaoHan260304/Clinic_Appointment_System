package com.group05.notification.application.usecase;

import com.group05.notification.application.command.CreateNotificationCommand;
import com.group05.notification.domain.aggregate.NotificationAggregate;

public interface CreateNotificationUseCase {
    NotificationAggregate handle(CreateNotificationCommand command);
}
