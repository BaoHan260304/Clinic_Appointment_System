package com.group05.notification.application.port;

import com.group05.notification.domain.aggregate.NotificationAggregate;
import com.group05.notification.domain.entity.NotificationDelivery;

public interface NotificationSenderPort {
    String send(NotificationAggregate aggregate, NotificationDelivery delivery) throws Exception;
}
