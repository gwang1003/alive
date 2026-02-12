package com.alive.security.service;

import com.alive.security.JwtUtil;
import com.alive.security.entity.RefreshToken;
import com.alive.security.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration; // 7일

    /**
     * RefreshToken 생성 및 저장
     */
    @Transactional
    public String createRefreshToken(String email) {
        // 기존 RefreshToken 삭제 (한 사용자당 하나의 RefreshToken만)
        String token = jwtUtil.generateRefreshToken(email);

        // 삭제 대신 '조회 후 업데이트' 전략 (더 안전함)
        RefreshToken refreshToken = refreshTokenRepository.findByEmail(email)
                .map(existingToken -> {
                    existingToken.updateToken(token); // 토큰 값과 만료일만 업데이트하는 메서드 작성
                    return existingToken;
                })
                .orElseGet(() -> RefreshToken.builder()
                        .token(token)
                        .email(email)
                        .createdAt(LocalDateTime.now())
                        .expiresAt(LocalDateTime.now().plusDays(7))
                    .build());

        refreshTokenRepository.save(refreshToken);
        return token;
    }

    /**
     * RefreshToken 검증
     */
    public boolean validateRefreshToken(String token) {
        // JWT 검증
        if (!jwtUtil.validateRefreshToken(token)) {
            return false;
        }

        // DB에 존재하는지 확인
        Optional<RefreshToken> refreshTokenOpt = refreshTokenRepository.findByToken(token);
        if (refreshTokenOpt.isEmpty()) {
            return false;
        }

        RefreshToken refreshToken = refreshTokenOpt.get();

        // 만료 여부 확인
        return !refreshToken.isExpired();
    }

    /**
     * RefreshToken으로 사용자 이메일 조회
     */
    public String getEmailFromRefreshToken(String token) {
        return jwtUtil.getEmailFromToken(token);
    }

    /**
     * RefreshToken 삭제 (로그아웃)
     */
    @Transactional
    public void deleteRefreshToken(String email) {
        refreshTokenRepository.deleteByEmail(email);
    }

    /**
     * 만료된 RefreshToken 정리 (스케줄러용)
     */
    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}