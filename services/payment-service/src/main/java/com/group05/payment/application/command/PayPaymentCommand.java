package com.group05.payment.application.command;

import java.util.UUID;

public record PayPaymentCommand(
        UUID paymentId,
        UUID performedBy,
        String performedByRole
) {
}
