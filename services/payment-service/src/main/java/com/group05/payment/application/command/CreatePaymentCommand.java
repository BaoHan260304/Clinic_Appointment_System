package com.group05.payment.application.command;

import com.group05.payment.domain.vo.PaymentTiming;

import java.util.UUID;

public record CreatePaymentCommand(
        UUID appointmentId,
        PaymentTiming paymentTiming,
        UUID patientUserId
) {
}
