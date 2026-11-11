package com.group09.doctor.application.usecase;

import com.group09.doctor.application.dto.DoctorDto;
import com.group09.doctor.application.dto.UpdateDoctorRequest;
import com.group09.doctor.application.mapper.DoctorAppMapper;
import com.group09.doctor.domain.exception.DoctorNotFoundException;
import com.group09.doctor.domain.model.Doctor;
import com.group09.doctor.domain.repository.DoctorRepository;
import com.group09.doctor.domain.valueobject.DoctorId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateDoctorUseCase {

    private final DoctorRepository doctorRepository;
    private final DoctorAppMapper mapper;

    @Transactional
    public DoctorDto execute(UUID doctorId, UpdateDoctorRequest request) {
        Doctor doctor = doctorRepository.findById(DoctorId.of(doctorId))
                .orElseThrow(() -> new DoctorNotFoundException("Không tìm thấy bác sĩ với mã " + doctorId));

        doctor.updateDetails(
                request.getName(),
                request.getSpecialization(),
                request.getPhoneNumber(),
                request.getEmail(),
                request.isActive()
        );

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapper.toDto(savedDoctor);
    }
}
