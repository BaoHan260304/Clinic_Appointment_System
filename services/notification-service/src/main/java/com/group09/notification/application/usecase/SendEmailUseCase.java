package com.group09.notification.application.usecase;

import com.group09.notification.api.dto.SendEmailRequest;
import com.group09.notification.api.dto.SendEmailResponse;

/**
 * Use case for sending emails.
 * Orchestrates template rendering, validation, and email delivery.
 */
public interface SendEmailUseCase {
    SendEmailResponse execute(SendEmailRequest request);
}
