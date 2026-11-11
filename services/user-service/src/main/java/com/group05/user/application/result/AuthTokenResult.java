package com.group05.user.application.result;

public record AuthTokenResult(
        String accessToken,
        String refreshToken,
        long accessTokenExpiresInSeconds,
        long refreshTokenExpiresInSeconds
) {
}
