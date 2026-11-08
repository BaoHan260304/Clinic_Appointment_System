package com.group09.notification.application.port;

import com.group09.notification.domain.aggregate.NotificationAggregate;
import com.group09.notification.domain.entity.NotificationDelivery;

public interface NotificationSenderPort {
    String send(NotificationAggregate aggregate, NotificationDelivery delivery) throws Exception;
}
