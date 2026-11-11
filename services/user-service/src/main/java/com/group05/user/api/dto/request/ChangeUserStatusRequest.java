package com.group05.user.api.dto.request;

import com.group05.user.domain.vo.UserStatus;
import jakarta.validation.constraints.NotNull;

public record ChangeUserStatusRequest(@NotNull(message = "Trạng thái người dùng không được để trống") UserStatus status) {
}
