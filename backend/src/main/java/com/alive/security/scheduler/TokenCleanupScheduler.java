package com.alive.security.scheduler;

import com.alive.security.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupScheduler {

    private final RefreshTokenService refreshTokenService;

    /**
     * 매일 새벽 3시에 만료된 RefreshToken 정리
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanupExpiredTokens() {
        log.info("만료된 RefreshToken 정리 시작");
        refreshTokenService.cleanupExpiredTokens();
        log.info("만료된 RefreshToken 정리 완료");
    }
}