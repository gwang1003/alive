package com.alive.security.repository;

import com.alive.security.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // 토큰으로 찾기
    Optional<RefreshToken> findByToken(String token);

    // 이메일로 찾기
    Optional<RefreshToken> findByEmail(String email);

    // 이메일로 삭제 (로그아웃 시)
    void deleteByEmail(String email);

    // 만료된 토큰 삭제 (배치 작업용)
    void deleteByExpiresAtBefore(LocalDateTime now);
}