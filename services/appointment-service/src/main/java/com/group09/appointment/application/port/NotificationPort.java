package com.group09.appointment.application.port;

import com.group09.commonevents.appointment.AppointmentCanceledEvent;
import com.group09.commonevents.appointment.AppointmentConfirmedEvent;
import com.group09.commonevents.appointment.AppointmentCreatedEvent;
import com.group09.commonevents.appointment.AppointmentUpdatedEvent;

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
