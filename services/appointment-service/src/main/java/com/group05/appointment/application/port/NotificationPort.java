package com.group05.appointment.application.port;

import com.group05.commonevents.appointment.AppointmentCanceledEvent;
import com.group05.commonevents.appointment.AppointmentConfirmedEvent;
import com.group05.commonevents.appointment.AppointmentCreatedEvent;
import com.group05.commonevents.appointment.AppointmentUpdatedEvent;

public interface NotificationPort {

    void publishAppointmentCreated(AppointmentCreatedEvent event);

    void publishAppointmentConfirmed(AppointmentConfirmedEvent event);

    void publishAppointmentCanceled(AppointmentCanceledEvent event);

    void publishAppointmentUpdated(AppointmentUpdatedEvent event);

    void sendDoctorCancellationEmail(DoctorCancellationNotification notification);

    record DoctorCancellationNotification(
            java.util.UUID appointmentId,
            java.util.UUID patientId,
            String patientEmail,
            String patientName,
            java.time.LocalDateTime appointmentStartTime,
            java.time.LocalDateTime appointmentEndTime,
            String cancelReason
    ) {
    }
}
