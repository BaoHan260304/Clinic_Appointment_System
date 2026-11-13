package com.group05.doctor.infrastructure.persistence.repository;

import com.group05.doctor.domain.model.AssignedSlot;
import com.group05.doctor.domain.model.AvailableSlot;
import com.group05.doctor.domain.model.Doctor;
import com.group05.doctor.domain.model.SlotStatus;
import com.group05.doctor.domain.repository.DoctorRepository;
import com.group05.doctor.domain.valueobject.DoctorId;
import com.group05.doctor.infrastructure.persistence.entity.DoctorJpaEntity;
import com.group05.doctor.infrastructure.persistence.entity.SlotJpaEntity;
import com.group05.doctor.infrastructure.persistence.mapper.DoctorPersistenceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DoctorRepositoryImpl implements DoctorRepository {

    private final SpringDataDoctorRepository jpaRepository;
    private final SpringDataSlotRepository slotRepository;
    private final DoctorPersistenceMapper mapper;

    @Override
    public Optional<Doctor> findById(DoctorId id) {
        return jpaRepository.findById(id.value())
                .map(mapper::toDomain);
    }

    @Override
    public boolean existsById(DoctorId id) {
        return jpaRepository.existsById(id.value());
    }

    @Override
    public Optional<DoctorId> findIdByUserId(UUID userId) {
        return jpaRepository.findIdByUserId(userId)
                .map(DoctorId::of);
    }

    @Override
    public Optional<Doctor> findByUserId(UUID userId) {
        return jpaRepository.findByUserId(userId)
                .map(mapper::toDomain);
    }

    @Override
    public List<Doctor> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Doctor> findBySpecialization(String specialization) {
        return jpaRepository.findBySpecializationContainingIgnoreCase(specialization).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailableSlot> findAvailableSlotsBySpecialization(
            String specialization,
            LocalDateTime from,
            LocalDateTime to
    ) {
        return jpaRepository.findAvailableSlotsBySpecialization(specialization, from, to);
    }

    @Override
    public Optional<AssignedSlot> assignAvailableSlot(
            String specialization,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {
        List<SlotJpaEntity> slots = jpaRepository.findAssignableSlots(
                specialization,
                startTime,
                endTime,
                PageRequest.of(0, 1)
        );

        if (!slots.isEmpty()) {
            SlotJpaEntity slot = slots.get(0);
            slot.setStatus(SlotStatus.BOOKED);
            DoctorJpaEntity doctor = slot.getDoctor();

            return Optional.of(new AssignedSlot(
                    slot.getId(),
                    doctor.getId(),
                    doctor.getUserId(),
                    doctor.getName(),
                    doctor.getSpecialization(),
                    doctor.getPhoneNumber(),
                    doctor.getEmail(),
                    slot.getStartTime(),
                    slot.getEndTime(),
                    true,
                    slot.getStatus().name()
            ));
        }

        // Fallback: Tìm bác sĩ còn trống lịch trong chuyên khoa để tự động gán slot
        List<DoctorJpaEntity> doctors = jpaRepository.findBySpecializationContainingIgnoreCase(specialization);
        if (doctors.isEmpty()) {
            doctors = jpaRepository.findAll().stream().filter(DoctorJpaEntity::isActive).toList();
        }

        for (DoctorJpaEntity doc : doctors) {
            if (!doc.isActive()) continue;
            boolean busy = slotRepository.existsBookedSlotInRange(doc.getId(), startTime, endTime);
            if (!busy) {
                SlotJpaEntity newSlot = SlotJpaEntity.builder()
                        .id(UUID.randomUUID())
                        .doctor(doc)
                        .startTime(startTime)
                        .endTime(endTime)
                        .status(SlotStatus.BOOKED)
                        .build();
                slotRepository.save(newSlot);

                return Optional.of(new AssignedSlot(
                        newSlot.getId(),
                        doc.getId(),
                        doc.getUserId(),
                        doc.getName(),
                        doc.getSpecialization(),
                        doc.getPhoneNumber(),
                        doc.getEmail(),
                        newSlot.getStartTime(),
                        newSlot.getEndTime(),
                        true,
                        newSlot.getStatus().name()
                ));
            }
        }

        return Optional.empty();
    }

    @Override
    public List<String> findDistinctSpecializations() {
        return jpaRepository.findDistinctActiveSpecializations();
    }

    @Override
    public boolean existsByUserId(UUID userId) {
        return jpaRepository.existsByUserId(userId);
    }

    @Override
    public Doctor save(Doctor doctor) {
        Optional<DoctorJpaEntity> existingOpt = jpaRepository.findById(doctor.getId().value());
        
        if (existingOpt.isPresent()) {
            DoctorJpaEntity existing = existingOpt.get();
            existing.setName(doctor.getName());
            existing.setSpecialization(doctor.getSpecialization());
            existing.setPhoneNumber(doctor.getPhoneNumber());
            existing.setEmail(doctor.getEmail());
            existing.setActive(doctor.isActive());
            existing.setBiography(doctor.getBiography());
            existing.setQualifications(doctor.getQualifications());
            existing.setAvatarUrl(doctor.getAvatarUrl());
            
            if (doctor.getSlots() != null) {
                java.util.Map<UUID, SlotJpaEntity> existingSlotsMap = existing.getSlots().stream()
                        .collect(Collectors.toMap(SlotJpaEntity::getId, s -> s));

                List<UUID> domainSlotIds = doctor.getSlots().stream()
                        .map(s -> s.getId().value())
                        .collect(Collectors.toList());

                // Remove slots that are no longer in the domain list
                existing.getSlots().removeIf(s -> !domainSlotIds.contains(s.getId()));

                // Update or add slots
                for (com.group05.doctor.domain.model.Slot domainSlot : doctor.getSlots()) {
                    SlotJpaEntity slotEntity = existingSlotsMap.get(domainSlot.getId().value());
                    if (slotEntity != null) {
                        // Update existing slot fields
                        slotEntity.setStartTime(domainSlot.getStartTime());
                        slotEntity.setEndTime(domainSlot.getEndTime());
                        slotEntity.setStatus(domainSlot.getStatus());
                    } else {
                        // Add new slot
                        SlotJpaEntity newSlot = SlotJpaEntity.builder()
                                .id(domainSlot.getId().value())
                                .doctor(existing)
                                .startTime(domainSlot.getStartTime())
                                .endTime(domainSlot.getEndTime())
                                .status(domainSlot.getStatus())
                                .build();
                        existing.getSlots().add(newSlot);
                    }
                }
            }
            
            DoctorJpaEntity savedEntity = jpaRepository.save(existing);
            return mapper.toDomain(savedEntity);
        } else {
            DoctorJpaEntity jpaEntity = mapper.toJpaEntity(doctor);
            DoctorJpaEntity savedEntity = jpaRepository.save(jpaEntity);
            return mapper.toDomain(savedEntity);
        }
    }

    @Override
    public void deleteById(DoctorId id) {
        jpaRepository.deleteById(id.value());
    }

    @Override
    public int releaseExpiredSlots(LocalDateTime cutoffTime) {
        return jpaRepository.releaseExpiredReservations(cutoffTime);
    }
}
