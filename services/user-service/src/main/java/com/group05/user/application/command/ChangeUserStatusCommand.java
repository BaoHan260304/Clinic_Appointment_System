package com.group05.user.application.command;

import com.group05.user.domain.vo.UserStatus;

import java.util.UUID;

public record ChangeUserStatusCommand(UUID userId, UserStatus status) {
}
