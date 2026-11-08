package com.group09.payment.api.dto;

import com.group09.payment.domain.vo.PaymentTiming;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreatePaymentRequest(
        @NotNull(message = "Mã lịch hẹn không được để trống")
        UUID appointmentId,

        PaymentTiming paymentTiming
) {
}
