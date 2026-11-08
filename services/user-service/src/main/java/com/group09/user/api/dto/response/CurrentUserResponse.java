package com.group09.user.api.dto.response;

import java.util.List;
import java.util.UUID;

public record CurrentUserResponse(
        String id,
        UUID userId,
        UUID patientId,
        String email,
        List<String> roles
) {
}
