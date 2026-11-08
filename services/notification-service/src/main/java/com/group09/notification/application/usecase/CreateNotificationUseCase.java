package com.group09.notification.application.usecase;

import com.group09.notification.application.command.CreateNotificationCommand;
import com.group09.notification.domain.aggregate.NotificationAggregate;

public interface CreateNotificationUseCase {
    NotificationAggregate handle(CreateNotificationCommand command);
}
