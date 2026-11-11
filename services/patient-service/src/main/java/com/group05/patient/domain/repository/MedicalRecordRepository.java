package com.group05.patient.domain.repository;

import com.group05.patient.domain.aggregate.MedicalRecordAggregate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MedicalRecordRepository {

    MedicalRecordAggregate save(MedicalRecordAggregate aggregate);

    Optional<MedicalRecordAggregate> findById(UUID id);

    List<MedicalRecordAggregate> findByPatientId(UUID patientId);

    void deleteById(UUID id);
}

