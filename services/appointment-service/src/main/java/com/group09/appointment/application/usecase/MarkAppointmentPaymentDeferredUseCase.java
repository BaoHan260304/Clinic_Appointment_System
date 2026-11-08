package com.group09.appointment.application.usecase;

import com.group09.appointment.application.command.MarkAppointmentPaymentCommand;
import com.group09.appointment.application.event.AppointmentEventMapper;
import com.group09.appointment.application.event.AppointmentNotificationDetails;
import com.group09.appointment.application.event.AppointmentNotificationDetailsResolver;
import com.group09.appointment.application.exception.AppointmentNotFoundException;
import com.group09.appointment.application.port.NotificationPort;
import com.group09.appointment.application.result.AppointmentResult;
import com.group09.appointment.application.result.AppointmentResultMapper;
import com.group09.appointment.domain.aggregate.AppointmentAggregate;
import com.group09.appointment.domain.repository.AppointmentLogRepository;
import com.group09.appointment.domain.repository.AppointmentRepository;
import com.group09.appointment.domain.vo.ActorRole;
import com.group09.appointment.domain.vo.AppointmentId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MarkAppointmentPaymentDeferredUseCase {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentLogRepository appointmentLogRepository;
    private final NotificationPort notificationPort;
    private final AppointmentNotificationDetailsResolver notificationDetailsResolver;

    public MarkAppointmentPaymentDeferredUseCase(
            AppointmentRepository appointmentRepository,
            AppointmentLogRepository appointmentLogRepository,
            NotificationPort notificationPort,
            AppointmentNotificationDetailsResolver notificationDetailsResolver
    ) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentLogRepository = appointmentLogRepository;
        this.notificationPort = notificationPort;
        this.notificationDetailsResolver = notificationDetailsResolver;
    }

    @Transactional
    public AppointmentResult execute(MarkAppointmentPaymentCommand command) {
        AppointmentAggregate appointment = appointmentRepository.findById(AppointmentId.of(command.appointmentId()))
                .orElseThrow(() -> new AppointmentNotFoundException(command.appointmentId()));

        appointment.markPaymentDeferred(command.performedBy(), ActorRole.valueOf(command.performedByRole()));
        AppointmentAggregate savedAppointment = appointmentRepository.save(appointment);
        appointmentLogRepository.saveAll(appointment.getLogs());
        AppointmentNotificationDetails notificationDetails = notificationDetailsResolver.resolve(savedAppointment);
        notificationPort.publishAppointmentConfirmed(AppointmentEventMapper.confirmed(savedAppointment, notificationDetails));

        return AppointmentResultMapper.from(savedAppointment);
    }
}
