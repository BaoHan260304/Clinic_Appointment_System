package com.group09.notification.application.usecase.impl;

import com.group09.notification.application.usecase.DeleteNotificationUseCase;
import com.group09.notification.domain.repository.NotificationRepository;
import com.group09.notification.domain.vo.NotificationId;
import org.springframework.stereotype.Service;

@Service
public class DeleteNotificationUseCaseImpl implements DeleteNotificationUseCase {

    private final NotificationRepository notificationRepository;

    public DeleteNotificationUseCaseImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void handle(NotificationId notificationId) {
        notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo: " + notificationId.value()));
        
        notificationRepository.deleteById(notificationId);
    }
}
