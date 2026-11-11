package com.group05.appointment.domain.repository;

import com.group05.appointment.domain.entity.AppointmentLog;

import java.util.List;

public interface AppointmentLogRepository {

    void saveAll(List<AppointmentLog> logs);
}
