-- Update existing doctors to match clinic profiles
UPDATE doctors 
SET name = 'BS. CKI Nguyễn Văn An', specialization = 'Nội Tổng Quát' 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

UPDATE doctors 
SET name = 'ThS. BS Trần Thị Bích', specialization = 'Tim Mạch' 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';

UPDATE doctors 
SET name = 'BS. CKII Lê Hoàng Minh', specialization = 'Nhi Khoa' 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13';

-- Insert Doctor 4: BS. Phạm Thu Hương
INSERT INTO doctors (id, name, specialization, phone_number, email, is_active, user_id)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'BS. Phạm Thu Hương', 'Da Liễu', '0934998877', 'bs.huong@clinic.local', TRUE, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, specialization = EXCLUDED.specialization;

-- Seed slots for 2026-11-01 to 2027-02-28 for all active doctors
WITH candidate_slots AS (
    SELECT
        d.id AS doctor_id,
        work_days.work_date::date + slot_times.start_at AS start_time,
        work_days.work_date::date + slot_times.start_at + INTERVAL '30 minutes' AS end_time,
        md5(d.id::text || '|' || (work_days.work_date::date + slot_times.start_at)::text) AS slot_hash
    FROM doctors d
    CROSS JOIN generate_series(
        DATE '2026-11-01',
        DATE '2027-02-28',
        INTERVAL '1 day'
    ) AS work_days(work_date)
    CROSS JOIN (
        VALUES
            (TIME '08:00:00'),
            (TIME '08:30:00'),
            (TIME '09:00:00'),
            (TIME '09:30:00'),
            (TIME '10:00:00'),
            (TIME '10:30:00'),
            (TIME '13:30:00'),
            (TIME '14:00:00'),
            (TIME '14:30:00'),
            (TIME '15:00:00'),
            (TIME '15:30:00'),
            (TIME '16:00:00')
    ) AS slot_times(start_at)
    WHERE d.is_active = TRUE
      AND EXTRACT(ISODOW FROM work_days.work_date) BETWEEN 1 AND 7
)
INSERT INTO doctor_slots (id, doctor_id, start_time, end_time, status)
SELECT
    (
        substring(slot_hash, 1, 8) || '-' ||
        substring(slot_hash, 9, 4) || '-' ||
        substring(slot_hash, 13, 4) || '-' ||
        substring(slot_hash, 17, 4) || '-' ||
        substring(slot_hash, 21, 12)
    )::uuid,
    doctor_id,
    start_time,
    end_time,
    'AVAILABLE'
FROM candidate_slots candidate
WHERE NOT EXISTS (
    SELECT 1
    FROM doctor_slots existing
    WHERE existing.doctor_id = candidate.doctor_id
      AND existing.start_time = candidate.start_time
      AND existing.end_time = candidate.end_time
)
ON CONFLICT (id) DO NOTHING;
