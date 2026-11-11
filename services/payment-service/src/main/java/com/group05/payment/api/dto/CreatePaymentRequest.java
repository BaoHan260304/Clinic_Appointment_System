package com.group05.payment.api.dto;

import com.group05.payment.domain.vo.PaymentTiming;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreatePaymentRequest(
        @NotNull(message = "Mã lịch hẹn không được để trống")
        UUID appointmentId,

        PaymentTiming paymentTiming
) {
}
