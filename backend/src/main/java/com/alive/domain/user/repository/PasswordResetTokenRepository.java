package com.alive.domain.user.repository;

import com.alive.domain.user.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 비밀번호 재설정 토큰 리포지토리. 토큰 문자열 또는 이메일로 조회한다.
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByEmail(String email);
}
