package com.alive.domain.user.repository;

import com.alive.domain.user.entity.EmailVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 이메일 인증 코드 리포지토리. 이메일당 최신 코드 하나를 조회/갱신한다.
 */
@Repository
public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {
    Optional<EmailVerificationCode> findByEmail(String email);
    void deleteByEmail(String email);
}
