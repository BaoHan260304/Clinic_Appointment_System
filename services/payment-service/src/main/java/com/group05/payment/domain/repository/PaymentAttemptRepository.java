package com.group05.payment.domain.repository;

import com.group05.payment.domain.entity.PaymentAttempt;

import java.util.List;
import java.util.UUID;

public interface PaymentAttemptRepository {

    PaymentAttempt save(PaymentAttempt paymentAttempt);

    List<PaymentAttempt> findByPaymentId(UUID paymentId);
}
