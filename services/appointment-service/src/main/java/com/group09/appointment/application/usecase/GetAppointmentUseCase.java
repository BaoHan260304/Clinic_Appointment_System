package com.group09.appointment.application.usecase;

import com.group09.appointment.application.exception.AppointmentNotFoundException;
import com.group09.appointment.application.result.AppointmentResult;
import com.group09.appointment.application.result.AppointmentResultMapper;
import com.group09.appointment.domain.repository.AppointmentRepository;
import com.group09.appointment.domain.vo.AppointmentId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GetAppointmentUseCase {
    private final AppointmentRepository appointmentRepository;

    public GetAppointmentUseCase(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional(readOnly = true)
    public AppointmentResult execute(UUID appointmentId) {
        return appointmentRepository.findById(AppointmentId.of(appointmentId))
                .map(AppointmentResultMapper::from)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
    }
}
