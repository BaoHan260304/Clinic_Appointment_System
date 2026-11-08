package com.group09.payment.application.usecase;

import com.group09.payment.application.result.PaymentResult;
import com.group09.payment.application.result.PaymentResultMapper;
import com.group09.payment.domain.entity.Payment;
import com.group09.payment.domain.exception.PaymentNotFoundException;
import com.group09.payment.domain.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GetPaymentUseCase {

    private final PaymentRepository paymentRepository;

    public GetPaymentUseCase(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public PaymentResult execute(UUID paymentId, UUID userId, String role) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));

        PaymentAuthorization.requireOwnerOrStaff(payment, userId, role);
        return PaymentResultMapper.from(payment);
    }
}
