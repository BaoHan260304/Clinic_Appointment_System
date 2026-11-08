package com.group09.doctor.domain.repository;

import com.group09.doctor.domain.model.Slot;
import com.group09.doctor.domain.model.SlotStatus;
import com.group09.doctor.domain.valueobject.DoctorId;

import java.time.LocalDateTime;
import java.util.List;

public interface SlotRepository {
    List<Slot> findByDoctorIdAndFilters(DoctorId doctorId, LocalDateTime fromDate, LocalDateTime toDate, SlotStatus status);
    boolean existsBookedSlotInRange(DoctorId doctorId, LocalDateTime rangeStart, LocalDateTime rangeEndExclusive);
}
